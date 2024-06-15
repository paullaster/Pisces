export class CreateCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.createCategory = this.createCategory.bind(this);
    }
    async createCategory(payload) {
        try {
            if (!payload) {
                return {success: false, error: 'Category cannot be empty'};
            }
            if (typeof payload!=='object') {
                return {success: false, error: 'Category must be a key value pair of category information'};
            }
            if (Object.keys(payload).length===0) {
                return {success: false, error: 'Category cannot be empty'};
            }
            const {success, error, data } = await this.categoryRepository.create(payload);
            return {success, error,  data};
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}