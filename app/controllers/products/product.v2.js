export class ProductV2Controller {
    constructor(fetchV2ProductService) {
        this.fetchV2ProductService = fetchV2ProductService;
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
            res.status(404).json({ message: 'Not Implemented' });
        } catch (error) {
            next(error);
        }
    }
}
