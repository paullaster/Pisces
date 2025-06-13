import { prepareImageUrl } from "../../../common/prepare.image.url.js";

export class FetchProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.fetchProductByName = this.fetchProductByName.bind(this);
    }
    async fetchById(productId, query) {
        try {
            if (!productId) throw new Error('Invalid product Id');
            return await this.productRepository.findById(productId, query);
        } catch (error) {
            throw error;
        }
    }
    async fetchProductByName(name, offset = 0, limit = 10) {
        try {
            if (!name) {
                return { success: false, error: 'Product name is required' };
            }
            if (typeof name !== 'string') {
                return { success: false, error: 'Product name must be a string' };
            }
            if (name.trim().length === 0) {
                return { success: false, error: 'Product name cannot be empty' };
            }
            const { success, error, data } = await this.productRepository.getProductByName(name, offset, limit);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, product: data };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    async fetch(query) {
        try {
            return await this.productRepository.findAll(query);
        } catch (error) {
            throw error;
        }
    }
}