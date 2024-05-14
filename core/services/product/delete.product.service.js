export class DeleteProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    async deleteProduct(pid) {
        try {
            return {success: true, product: await this.productRepository.delete(pid)};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}