export class FetchCategoryController {
    constructor(fetchCategoryService) {
        this.fetchCategoryService = fetchCategoryService;
        this.fetchAllCategories = this.fetchAllCategories.bind(this);
        this.fetchCategoryByName = this.fetchCategoryByName.bind(this);
        this.fetchCategoryByID = this.fetchCategoryByID.bind(this);
    }
    async fetchAllCategories(req, res) {
        try {
            if (req.query) {
                const { page, limit, ...options } = req.query;
                const { success, data:categories, error } = await this.fetchCategoryService.fetchAllCategories(options, page, limit);
                if (!success) {
                    return res.ApiResponse.error(404, error);
                }
                return res.ApiResponse.success(categories, 200);
            }
            const { success, data:categories, error } = await this.fetchCategoryService.fetchAllCategories();
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(categories, 200, "Category fetched successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchCategoryByID(req, res) {
        try {
            if (!req.params.cid) {
                return res.ApiResponse.error(428, 'The Category ID is required');
            }
            const {success, category, error } = await this.fetchCategoryService.fetchCategoryByID(req.params.cid);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(category, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchCategoryByName(req, res) {
        try {
            
            if (!req.params.name) {
                return res.ApiResponse.error(428, 'The Category name is required');
            }
            const { page, limit } = req.query;
            const {success, categories, error } = await this.fetchCategoryService.fetchCategoryByName(req.params.name, page, limit);

            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(categories, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}