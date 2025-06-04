import { prepareImageUrl } from "../../../common/prepare.image.url.js";

export class FetchCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async findById(categoryId) {
        try {
            if (!categoryId) {
                return { success: false, error: 'Category ID is required' };
            }
            const category = await this.categoryRepository.findById(categoryId);
            return category;
        } catch (error) {
            return { success: false, error: error.message, data: error.stack }
        }
    }
    async findAll(query) {
        try {
            const categories = await this.categoryRepository.findAll();
            return categories;
        } catch (error) {
            return { success: false, error: error.message, data: error.stack }
        }
    }
}