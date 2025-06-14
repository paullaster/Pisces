import express from 'express';
import { CreateProductService } from '../core/services/product/create.product.service.js';
import { FetchProductService } from '../core/services/product/fetch.product.service.js';
import { UpdateProductController } from '../app/controllers/products/update.product.js';
import { UpdateProductService } from '../core/services/product/update.product.service.js';
import { DeleteProductService } from '../core/services/product/delete.product.service.js';
import { DeleteProductController } from '../app/controllers/products/delete.product.js';
import { models, sequelize } from '../data/integrations/database/models/index.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';
import { SequelizeProductRepository } from '../infrastructure/repositories/productRepository.js';
import { ProductController } from '../app/controllers/products/product.js';
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


const prodcutRoutes = express.Router({
    caseSensitive: true,
    mergeParams: true,
});

// repository
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

// Use Cases
const createProductService = new CreateProductService(productRepository);
const fetchProductService = new FetchProductService(productRepository);


// update product
const updateProductService = new UpdateProductService(productRepository);
const updateProductController = new UpdateProductController(updateProductService);

// delete product
const deleteProductService = new DeleteProductService(productRepository);
const deleteProductController = new DeleteProductController(deleteProductService);

// Controller
const productController = new ProductController(createProductService, updateProductService, fetchProductService, deleteProductService);

// middleware
const validator = new JoiSanitizer();

// schema:
const productCreationSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().optional(),
    description: Joi.string().required(),
    recipeTips: Joi.string().optional(),
    variants: Joi.array().optional(),
    categories: Joi.array().optional(),
    discounts: Joi.array().optional(),
});

const productIdParam = Joi.object({
    productId: Joi.string().required(),
})

prodcutRoutes.post('/', validator.validateBody(productCreationSchema), productController.create.bind(productController));
prodcutRoutes.get('/', productController.fetch.bind(productController));
prodcutRoutes.get('/:productId', validator.validateParams(productIdParam), productController.fetchById.bind(productController));
prodcutRoutes.put('/:productId', validator.validateParams(productIdParam), productController.update.bind(productController));
prodcutRoutes.delete('/:pid', deleteProductController.deleteProduct);

export { prodcutRoutes };