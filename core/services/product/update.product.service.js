export class UpdateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.updateProduct = this.updateProduct.bind(this);
    }
    async updateProduct(product, payload) {
        try {
            const { success, error, data } = await this.productRepository.update(product, payload);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}