export class UpdateCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.updateCategoryRespository = this.updateCategoryRespository.bind(this);
    }
    async updateCategoryRespository(category, payload) {
        try {
            const { success, error, data } = await this.categoryRepository.update(category, payload);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}