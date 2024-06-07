/**
 * @class CategoryRepository
 * @abstract
 * 
 */
export class CategoryRepository {
    /**
     * @abstract
     * @param { id } 
     * @returns { Promise<Category | null>}
     */
    async getCategoryById(id) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { name } 
     * @returns { Promise<Category | null>}
     */
    async getCategoryByName(name) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Category} 
     * @returns { Promise<Category | null>}
     */
    async create(category) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Category} 
     * @returns { Promise<Category | null>}
     */
    async update(category) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { id } 
     * @returns { Promise<Category | null>}
     */
    async delete(id) {
        throw new Error('Not implemented');
    }
}