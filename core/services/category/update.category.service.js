import { safeTypeChecker } from "../../../common/safeTypeChecker.js";

export class UpdateCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute(category, payload) {
        try {
            if (!category || !payload || safeTypeChecker(payload) !== 'Object') {
                throw new Error('Invalid update request');
            }
            const c = await this.categoryRepository.save(category, payload);
            return c;
        } catch (error) {
            throw error;
        }
    }
}