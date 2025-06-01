import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";
import app from "../../../infrastructure/config/app.js";

const { defaultCurrency } = app;
export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.createProduct = this.createProduct.bind(this);
    }
    async createProduct(product) {
        try {
            if (!product) {
                return { success: false, error: 'Product cannot be empty' };
            }
            if (typeof product !== 'object') {
                return { success: false, error: 'Product must be a key value pair of product information' };
            }
            if (Object.keys(product).length === 0) {
                return { success: false, error: 'Product cannot be empty' };
            }
            product.pid = RandomCodeGenerator(10, 'prod');
            product.lastPid = product.pid;
            new ValidateObjectPayload(product);
            const { error, success, data } = await this.productRepository.create(product);
            return { error, success, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}