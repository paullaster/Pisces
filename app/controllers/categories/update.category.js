export class UpdateCategorycontroller {
    constructor(updateCategoryService) {
        this.updateCategoryService = updateCategoryService;
        this.updateCategory = this.updateCategory.bind(this);
    }
    async updateCategory(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Invalid body');
            }
            if (!req.params.cid) {
                return res.ApiResponse.error(400, 'The category ID is required');
            }
            const {success, data, error } = await this.updateCategoryService.updateCategoryRespository(req.params.cid, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 207, "Category updated ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}