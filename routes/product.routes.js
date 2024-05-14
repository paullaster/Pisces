import express from 'express';
import { CreateProductController } from '../app/controllers/products/create.product.js';
import { CreateProductService } from '../core/services/product/create.product.service.js';
import { SequelizeProductRepository } from '../data/interfaces/sequelize.product.repository.js';
import Products from '../data/integrations/database/models/product.js';
import { FetchProductController } from '../app/controllers/products/fetch.product.js';
import { FetchProductService } from '../core/services/product/fetch.product.service.js';


const prodcutRoutes = express.Router();
const productRepository = new SequelizeProductRepository(Products);

// Create product
const createProductService = new CreateProductService(productRepository);
const createProductController = new CreateProductController(createProductService);

// Fetch product
const fetchProductService = new FetchProductService(productRepository);
const fetchProductController = new FetchProductController(fetchProductService);


prodcutRoutes.post('/', createProductController.createProduct);
prodcutRoutes.get('/', fetchProductController.fetchAllProduct);
prodcutRoutes.get('/:pid', fetchProductController.fetchProductByID);
prodcutRoutes.get('/name/:name', fetchProductController.fetchProductByName);
prodcutRoutes.put('/:id', )

export { prodcutRoutes};