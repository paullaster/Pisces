export class FetchProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.fetchProductByID = this.fetchProductByID.bind(this);
        this.fetchProductByName = this.fetchProductByName.bind(this);
        this.fetchAllProducts = this.fetchAllProducts.bind(this);
    }
    async fetchProductByID(pid) {
        try {
            if (!pid) {
                return {success: false, error: 'Product ID is required'};
            }
            if (typeof pid!=='string') {
                return {success: false, error: 'Product ID must be a string'};
            }
            if (pid.trim().length===0) {
                return {success: false, error: 'Product ID cannot be empty'};
            }
            if (pid.trim().length>10) {
                return {success: false, error: 'Product ID cannot be more than 10 characters'};
            }
            const product = await this.productRepository.getProductById(pid);
            if (!product) {
                return {success: false, error: 'Product does not exist'};
            }
            return {success: true, product: product};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
    async fetchProductByName(name) {
        try {
            if (!name) {
                return {success: false, error: 'Product name is required'};
            }
            if (typeof name!=='string') {
                return {success: false, error: 'Product name must be a string'};
            }
            if (name.trim().length===0) {
                return {success: false, error: 'Product name cannot be empty'};
            }
            const product = await this.productRepository.getProductByName(name);
            if (!product) {
                return {success: false, error: 'Product does not exist'};
            }
            return {success: true, product: product};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
    async fetchAllProducts(options = {}, offset = 0, limit =10) {
        try {
            return {success: true, products: await this.productRepository.getProducts(options, offset, limit)};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}