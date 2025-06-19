export class DeleteCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(cid) {
        try {
            if (cid) {
                throw new Error('Missing resouce id');
            }
            return await this.categoryRepository.delete(cid);
        } catch (error) {
            throw error;
        }
    }
}