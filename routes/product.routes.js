import express from 'express';
import { CreateProductController } from '../app/controllers/products/create.product.js';
import { CreateProductService } from '../core/services/product/create.product.service.js';
import { SequelizeProductRepository } from '../data/interfaces/sequelize.product.repository.js';
import Product from '../data/integrations/database/models/product.js';
import { FetchProductController } from '../app/controllers/products/fetch.product.js';
import { FetchProductService } from '../core/services/product/fetch.product.service.js';
import { UpdateProductController } from '../app/controllers/products/update.product.js';
import { UpdateProductService } from '../core/services/product/update.product.service.js';
import { DeleteProductService } from '../core/services/product/delete.product.service.js';
import { DeleteProductController } from '../app/controllers/products/delete.product.js';
import { productImageMiddleware } from '../app/middleware/fetch.product.with.image.js';


const prodcutRoutes = express.Router();
const productRepository = new SequelizeProductRepository(Product);

// Create product
const createProductService = new CreateProductService(productRepository);
const createProductController = new CreateProductController(createProductService);

// Fetch product
const fetchProductService = new FetchProductService(productRepository);
const fetchProductController = new FetchProductController(fetchProductService);

// update product
const updateProductService = new UpdateProductService(productRepository);
const updateProductController = new UpdateProductController(updateProductService);

// delete product
const deleteProductService  = new DeleteProductService(productRepository);
const deleteProductController = new DeleteProductController(deleteProductService);


prodcutRoutes.post('/', createProductController.createProduct);
prodcutRoutes.get('/', productImageMiddleware, fetchProductController.fetchAllProduct);
prodcutRoutes.get('/:pid', productImageMiddleware, fetchProductController.fetchProductByID);
prodcutRoutes.get('/name/:name', fetchProductController.fetchProductByName);
prodcutRoutes.put('/:pid', updateProductController.updateProduct);
prodcutRoutes.delete('/:pid', deleteProductController.deleteProduct);

export { prodcutRoutes };