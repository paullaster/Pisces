import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";
import { ImageProcessorService } from "../assets/image.processor.service.js";
export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.createProduct = this.createProduct.bind(this);
    }
    async createProduct(product) {
        try {
            if (!product) {
                return {success: false, error: 'Product cannot be empty'};
            }
            if (typeof product!=='object') {
                return {success: false, error: 'Product must be a key value pair of product information'};
            }
            if (Object.keys(product).length===0) {
                return {success: false, error: 'Product cannot be empty'};
            }
            product.pid = RandomCodeGenerator(10);
            const productObj = new ValidateObjectPayload(product);
            const {image, ...item} = product;
            image.pid = product.pid;
            item.image = await new ImageProcessorService(image).url;
            const {error, success, type } = await this.productRepository.getProductById(productObj.object.pid, 'create');
            if (!success) {
                return { success: false, error: error};
            }
            if (success && type === 'create') {
                const {error, success, data } = await this.productRepository.create(item);
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