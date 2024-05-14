import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";
export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.createProduct = this.createProduct.bind(this);
    }
    async createProduct(product) {
        try {
            const productObj = new ValidateObjectPayload(product);
            const {error, success, type } = await this.productRepository.getProductById(productObj.object.pid, 'create');
            if (!success) {
                return { success: false, error: error};
            }
            if (success && type === 'create') {
                const {error, success, data } = await this.productRepository.create(product);
                if(!success) {
                    return {success: false, error};
                }
                return {success: true, data};
            }
            return {success: false, error};
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}