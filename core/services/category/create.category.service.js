class CreateCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.createCategory = this.createCategory.bind(this);
    }
    async createCategory(payload) {
        try {
            return {success: true, data: await this.categoryRepository.create(payload)};
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}