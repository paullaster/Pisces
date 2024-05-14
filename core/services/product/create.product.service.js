export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.createProduct = this.createProduct.bind(this);
    }
    async createProduct(product) {
        try {
            const productExists = await this.productRepository.getProductById(product.pid);
            if (productExists) {
                return { success: false, product: "Product already exists"};
            }
            const newProduct = await this.productRepository.create(product);
            return {success: true, product:newProduct};
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}