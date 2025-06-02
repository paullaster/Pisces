import express from 'express';
import { CreateCategoryController } from '../app/controllers/categories/create.category.js';
import { CreateCategoryService } from '../core/services/category/create.category.service.js';
import { FetchCategoryController } from '../app/controllers/categories/fetch.category.js';
import { FetchCategoryService } from '../core/services/category/fetch.category.service.js';
import { UpdateCategoryService } from '../core/services/category/update.category.service.js';
import { UpdateCategorycontroller } from '../app/controllers/categories/update.category.js';
import { DeleteCategoryService } from '../core/services/category/delete.category.service.js';
import { DeleteCategoryController } from '../app/controllers/categories/delete.category.js';
import { categoryImageMiddleware } from '../app/middleware/fetch.category.with.image.js';
import { models } from '../data/integrations/database/models/index.js';
import { SequelizeCategoryRepository } from '../infrastructure/repositories/categoryRepository.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';
const { Category } = models;


const categoryRoutes = express.Router();
const categoryRepository = new SequelizeCategoryRepository(Category);

// create category
const createCategoryService = new CreateCategoryService(categoryRepository);
const createCategorycontroller = new CreateCategoryController(createCategoryService);

// find
const fetchCategoryService = new FetchCategoryService(categoryRepository);
const fetchCategoryController = new FetchCategoryController(fetchCategoryService);

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

// ROUTES
categoryRoutes.post('/', validator.validateBody(validCategoryCreationSchema), createCategorycontroller.createCategory);
categoryRoutes.get('/', categoryImageMiddleware, fetchCategoryController.fetchAllCategories);
categoryRoutes.get('/:cid', fetchCategoryController.fetchCategoryByID);
categoryRoutes.get('/name/:name', fetchCategoryController.fetchCategoryByName);
categoryRoutes.put('/:cid', updateCategoryCotroller.updateCategory);
categoryRoutes.delete('/:cid', deleteCategoryCotroller.deleteCategory);





export { categoryRoutes }


