export class CreateProductController {
    constructor(createProductService) {
        this.createProductService = createProductService;
        this.createProduct = this.createProduct.bind(this);
    }
    async createProduct(req, res) {
        try {
            const {success, product, error } = await this.createProductService.createProduct(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(product, 201, "Product created successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}