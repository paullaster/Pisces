/**
 * @class ProductRepository
 * @abstract
 */

export class ProductRepository {
    /**
     * @param {string}
     * @abstract
     * @returns { <Product | null}
     */
    async getProductById(pid) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {{}} [options={}] 
     * @abstract
     * @returns { <Products | null}
     */
    async getProducts(options = {}) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {string}
     * @abstract
     * @returns { <Product | null}
     */
    async getProductByName(title) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {Product}
     * @abstract
     * @returns { <Product | null}
     */
    async create(product) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {Product}
     * @abstract
     * @returns { <Product | null}
     */
    async update(product) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {string}
     * @abstract
     * @returns { <Product | null}
     */
    async delete(pid) { 
        throw new Error('Not implemented');
    }
}