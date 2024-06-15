export class DeleteCategoryController {
    constructor(deleteCategoryService) {
        this.deleteCategoryService = deleteCategoryService;
        this.deleteCategory = this.deleteCategory.bind(this);
    }
    async deleteCategory(req, res) {
        try {
            if (!req.params.cid) {
                return res.ApiResponse.error(400, 'The category ID is required');
            }
            const {success, category, error } = await this.deleteCategoryService.deleteCategory(req.params.cid);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(category, 207, "Category deleted ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}