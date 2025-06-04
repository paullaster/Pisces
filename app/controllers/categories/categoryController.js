import { CreateCategoryService } from "../../../core/services/category/create.category.service.js";

export class CategoryController {
    /**
     * 
     * @param {CreateCategoryService} createCategoryService 
     */
    constructor(createCategoryService, fetchCategoryService) {
        this.createCategoryService = createCategoryService;
        this.fetchCategoryService = fetchCategoryService;
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createCategory(req, res) {
        try {
            const { success, data, error } = await this.createCategoryService.createCategory(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 201, "Category created successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async fetchOne(req, res) {
        try {
            const { success, data, error } = await this.fetchCategoryService.findById(req.params.categoryId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async findAll(req, res) {
        try {
            const { success, data, error } = await this.fetchCategoryService.findAll(req.query);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(data, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
}