export class DeleteCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.deleteCategory = this.deleteCategory.bind(this);
    }
    async deleteCategory(cid) {
        try {
            return {success: true, category: await this.categoryRepository.delete(cid)};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}