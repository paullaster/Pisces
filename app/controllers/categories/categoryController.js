import { CreateCategoryService } from "../../../core/services/category/create.category.service.js";

export class CategoryController {
    /**
     * 
     * @param {CreateCategoryService} createCategoryService 
     */
    constructor(createCategoryService, fetchCategoryService, updateCategoryService, deleteCategoryService) {
        this.createCategoryService = createCategoryService;
        this.fetchCategoryService = fetchCategoryService;
        this.updateCategoryService = updateCategoryService;
        this.deleteCategoryService = deleteCategoryService;
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createCategory(req, res) {
        try {
            const category = await this.createCategoryService.createCategory(req.body);
            return res.ApiResponse.success(category, 201, "Category created successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async fetchOne(req, res) {
        try {
            const category = await this.fetchCategoryService.findById(req.params.categoryId);
            return res.ApiResponse.success(category, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async findAll(req, res) {
        try {
            const categories = await this.fetchCategoryService.findAll(req.query);
            return res.ApiResponse.success(categories, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async update(req, res) {
        try {
            const category = await this.updateCategoryService.execute(req.params.categoryId, req.body);
            return res.ApiResponse.success(category, 200, "Update successfull.");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async delete(req, res) {
        try {
            const category = await this.deleteCategoryService.execute(req.params.categoryId);
            return res.ApiResponse.success(category, 204, "Delete successfull.");
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
}