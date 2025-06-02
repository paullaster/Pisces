import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Category } from "../../entities/category.js";

export class CreateCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async createCategory(payload) {
        try {
            if (!payload || safeTypeChecker(payload) !== 'Object' || !Object.keys(payload).length) {
                return { success: false, error: 'Invalid cateogry data' };
            }
            const categoryId = RandomCodeGenerator(10, 'cat');
            const newCategory = Category.createCategoryFromRawObject(
                {
                    categoryId,
                    name: payload.name,
                    description: payload.description,
                    color: payload.color,
                    icon: payload.icon,
                    isActive: payload.isActive
                }
            );
            const { success, error, data } = await this.categoryRepository.save(newCategory);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}