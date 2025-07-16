import express from 'express';
import { SequelizeProductRepository } from '../infrastructure/repositories/productRepository.js';
import { FetchV2ProductService } from '../core/services/product/fetch.v2.product.service.js';
import { ProductV2Controller } from '../app/controllers/products/product.v2.js';
import { models, sequelize } from '../data/integrations/database/models/index.js';

const { 
    Product, 
    ProductCategory, 
    Image, 
    VariantAttribute, 
    ProductVariant, 
    ProductDiscount, 
    Category, 
    Discount, 
    AttributeValue, 
    Attribute 
} = models;

const productV2Routes = express.Router();

// Instantiate the repository
const productRepository = new SequelizeProductRepository(
    sequelize,
    Product,
    ProductCategory,
    Image,
    ProductVariant,
    VariantAttribute,
    ProductDiscount,
    Category,
    Discount,
    AttributeValue,
    Attribute
);

// Instantiate the service
const fetchV2ProductService = new FetchV2ProductService(productRepository);

// Instantiate the controller
const productV2Controller = new ProductV2Controller(fetchV2ProductService);

// Define the routes
productV2Routes.get('/', productV2Controller.fetchAll.bind(productV2Controller));
productV2Routes.get('/:productId', productV2Controller.fetchById.bind(productV2Controller));

export { productV2Routes };
