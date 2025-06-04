import express from 'express';
import { CreateCategoryService } from '../core/services/category/create.category.service.js';
import { FetchCategoryController } from '../app/controllers/categories/fetch.category.js';
import { FetchCategoryService } from '../core/services/category/fetch.category.service.js';
import { UpdateCategoryService } from '../core/services/category/update.category.service.js';
import { UpdateCategorycontroller } from '../app/controllers/categories/update.category.js';
import { DeleteCategoryService } from '../core/services/category/delete.category.service.js';
import { DeleteCategoryController } from '../app/controllers/categories/delete.category.js';
import { categoryImageMiddleware } from '../app/middleware/fetch.category.with.image.js';
import { models, sequelize } from '../data/integrations/database/models/index.js';
import { SequelizeCategoryRepository } from '../infrastructure/repositories/categoryRepository.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';
import { CategoryController } from '../app/controllers/categories/categoryController.js';
const { Category } = models;


const categoryRoutes = express.Router();

// Repository
const categoryRepository = new SequelizeCategoryRepository(sequelize, Category);

// UseCases
const createCategoryService = new CreateCategoryService(categoryRepository);
const fetchCategoryUseCase = new FetchCategoryService(categoryRepository);


// Category controlller
const categoryController = new CategoryController(createCategoryService, fetchCategoryUseCase);


// update
const updateCategoryService = new UpdateCategoryService(categoryRepository);
const updateCategoryCotroller = new UpdateCategorycontroller(updateCategoryService);

// delete
const deleteCategoryService = new DeleteCategoryService(categoryRepository);
const deleteCategoryCotroller = new DeleteCategoryController(deleteCategoryService);


// Middlewares
const validator = new JoiSanitizer();


// Schemas
const validCategoryCreationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    color: Joi.string().required(),
    icon: Joi.string().required(),
    isActive: Joi.boolean().required(),
});
const categoryIdParam = Joi.object({
    categoryId: Joi.string().required(),
});

// ROUTES
categoryRoutes.post('/', validator.validateBody(validCategoryCreationSchema), categoryController.createCategory.bind(categoryController));
categoryRoutes.get('/', categoryController.findAll.bind(categoryController));
categoryRoutes.get('/:categoryId', validator.validateParams(categoryIdParam), categoryController.fetchOne.bind(categoryController));
categoryRoutes.put('/:categoryId', validator.validateParams(categoryIdParam), updateCategoryCotroller.updateCategory);
categoryRoutes.delete('/:categoryId', validator.validateParams(categoryIdParam), deleteCategoryCotroller.deleteCategory);





export { categoryRoutes }


