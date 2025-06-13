export class ProductController {
    constructor(createdProductUseCase, updateProductUseCase, fetchProductUseCase, deleteProductUseCase) {
        this.createdProductUseCase = createdProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.fetchProductUseCase = fetchProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
    }
    async create(req, res) {
        try {
            const product = await this.createdProductUseCase.createProduct(req.body);
            return res.ApiResponse.success(product, 201, "Product created successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }

    async fetch(req, res) {
        try {
            const products = await this.fetchProductUseCase.fetch({ deletedAt: null, ...req.query });
            return res.ApiResponse.success(products);
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
}