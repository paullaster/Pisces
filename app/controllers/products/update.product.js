export class UpdateProductController {
    constructor(updateProductService) {
        this.updateProductService = updateProductService;
        this.updateProduct = this.updateProduct.bind(this);
    }
    async updateProduct(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Invalid body');
            }
            if (!req.params.pid) {
                return res.ApiResponse.error(400, 'The product ID is required');
            }
            const {success, data, error } = await this.updateProductService.updateProduct(req.params.pid, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 207, "Product updated ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}