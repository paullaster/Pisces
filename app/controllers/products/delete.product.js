export class DeleteProductController {
    constructor(deleteProductService) {
        this.deleteProductService = deleteProductService;
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    async deleteProduct(req, res) {
        try {
            if (!req.params.pid) {
                return res.ApiResponse.error(400, 'The product ID is required');
            }
            const {success, product, error } = await this.deleteProductService.deleteProduct(req.params.pid);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(product, 207, "Product deleted ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}