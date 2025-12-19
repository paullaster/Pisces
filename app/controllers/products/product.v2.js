export class ProductV2Controller {
    constructor(fetchV2ProductService, FetchByIdV2ProductService) {
        this.fetchV2ProductService = fetchV2ProductService;
        this.FetchByIdV2ProductService = FetchByIdV2ProductService;
    }

    async fetchAll(req, res, next) {
        try {
            const query = req.query;
            const result = await this.fetchV2ProductService.execute(query);
            return res.ApiResponse.success(result);
        } catch (error) {
            next(error);
        }
    }


    async fetchById(req, res, next) {
        try {
            const { productId } = req.params;

            if (!productId) {
                return next(new Error('Product ID is required'));
            }
            const query = req.query;
            const result = await this.FetchByIdV2ProductService.execute(productId, query);
            return res.ApiResponse.success(result);
        } catch (error) {
            next(error);
        }
    }
}
