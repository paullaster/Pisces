export class FetchCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async findById(categoryId) {
        try {
            if (!categoryId) {
                throw new Error('Category ID is required');
            }
            const category = await this.categoryRepository.findById(categoryId);
            return category;
        } catch (error) {
            throw error;
        }
    }
    async findAll(query) {
        try {
            const categories = await this.categoryRepository.findAll(query);
            return categories;
        } catch (error) {
            throw error;
        }
    }
}