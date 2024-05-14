export class UpdateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.updateProduct = this.updateProduct.bind(this);
    }
    async updateProduct(product) {
        try {
            const productExists = await this.productRepository.getProductById(product.pid);
            if (!productExists) {
                return { success: false, product: "Product not found" };
            }
            const updatedProduct = await this.productRepository.update(product);
            return {success: true, product: updatedProduct};
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}