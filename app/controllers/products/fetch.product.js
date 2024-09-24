export class FetchProductController {
    constructor(fetchProductService) {
        this.fetchProductService = fetchProductService;
        this.fetchAllProduct = this.fetchAllProduct.bind(this);
        this.fetchProductByID = this.fetchProductByID.bind(this);
        this.fetchProductByName = this.fetchProductByName.bind(this);
    }
    async fetchAllProduct(req, res) {
        try {
            if (req.query) {
                const {page, limit, ...options} = req.query;
                const {success, products, error } = await this.fetchProductService.fetchAllProducts(options, page, limit, true, req.model);
                if (!success) {
                    return res.ApiResponse.error(404, error);
                }
                return res.ApiResponse.success(products, 200);
            }
            const {success, products, error } = await this.fetchProductService.fetchAllProducts();
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(products, 200, "Products fetched successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchProductByID(req, res) {
        try {
            if (!req.params.pid) {
                return res.ApiResponse.error(428, 'The product ID is required');
            }
            const {success, product, error } = await this.fetchProductService.fetchProductByID(req.params.pid, req.model);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(product, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchProductByName(req, res) {
        try {
            
            if (!req.params.name) {
                return res.ApiResponse.error(428, 'The product name is required');
            }
            const { page, limit } = req.query;
            const {success, product, error } = await this.fetchProductService.fetchProductByName(req.params.name, page, limit);

            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(product, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}