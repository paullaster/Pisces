import express from 'express';
import { CreateProductController } from '../app/controllers/products/create.product.js';
import { CreateProductService } from '../core/services/product/create.product.service.js';
import { SequelizeProductRepository } from '../data/interfaces/sequelize.product.repository.js';
import Products from '../data/integrations/database/models/product.js';


const prodcutRoutes = express.Router();
const productRepository = new SequelizeProductRepository(Products);
const createProductService = new CreateProductService(productRepository);
const createProductController = new CreateProductController(createProductService);



prodcutRoutes.post('/', createProductController.createProduct);
prodcutRoutes.put('/:id', )

export { prodcutRoutes};