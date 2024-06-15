export class CreateCategoryController {
    constructor (createCategoryService) {
        this.createCategoryService = createCategoryService;
        this.createCategory = this.createCategory.bind(this);
    }
    async createCategory(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Invalid body');
            }
            if (!Object.keys(req.body).length) {
                return res.ApiResponse.error(400, 'category cannot be empty');
            }
            const {success, data, error } = await this.createCategoryService.createCategory(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 201, "Category created successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}