import express from 'express';
import { CreateCategoryController } from '../app/controllers/categories/create.category.js';
import { CreateCategoryService } from '../core/services/category/create.category.service.js';
import { SequelizeCategoryRepository } from '../data/interfaces/sequilize.category.repository.js';
import Category from '../data/integrations/database/models/category.js';
import { FetchCategoryController } from '../app/controllers/categories/fetch.category.js';
import { FetchCategoryService } from '../core/services/category/fetch.category.service.js';
import { UpdateCategoryService } from '../core/services/category/update.category.service.js';
import { UpdateCategorycontroller } from '../app/controllers/categories/update.category.js';
import { DeleteCategoryService } from '../core/services/category/delete.category.service.js';
import { DeleteCategoryController } from '../app/controllers/categories/delete.category.js';
import { categoryImageMiddleware } from '../app/middleware/fetch.category.with.image.js';


const categoryRoutes = express.Router();
const categoryRepository = new SequelizeCategoryRepository(Category);

// create category
const createCategoryService = new CreateCategoryService(categoryRepository);
const  createCategorycontroller = new CreateCategoryController(createCategoryService);

// find
const fetchCategoryService = new FetchCategoryService(categoryRepository);
const fetchCategoryController = new FetchCategoryController(fetchCategoryService);

// update
const updateCategoryService = new UpdateCategoryService(categoryRepository);
const updateCategoryCotroller = new UpdateCategorycontroller(updateCategoryService);

// delete
const deleteCategoryService = new DeleteCategoryService(categoryRepository);
const deleteCategoryCotroller = new DeleteCategoryController(deleteCategoryService);

// ROUTES
categoryRoutes.post('/', createCategorycontroller.createCategory);
categoryRoutes.get('/', categoryImageMiddleware, fetchCategoryController.fetchAllCategories);
categoryRoutes.get('/:cid', fetchCategoryController.fetchCategoryByID);
categoryRoutes.get('/name/:name', fetchCategoryController.fetchCategoryByName);
categoryRoutes.put('/:cid', updateCategoryCotroller.updateCategory);
categoryRoutes.delete('/:cid', deleteCategoryCotroller.deleteCategory);





export {categoryRoutes}


