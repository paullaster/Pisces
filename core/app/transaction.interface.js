/**
 * @class TransactionRepository
 * @abstract
 */

export class TransactionRepository {
    /**
     * @param {string}
     * @abstract
     * @returns { <Transaction | null}
     */
    async getTransById(transId) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {{}} [options={}] 
     * @abstract
     * @returns { <Transaction | null}
     */
    async getTrans(options = {}) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {string}
     * @abstract
     * @returns { <Transaction | null}
   
    /**
     * @param {Product}
     * @abstract
     * @returns { <Transaction | null}
     */
    async create(transaction) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {Transaction}
     * @abstract
     * @returns { <Transaction | null}
     */
    async update(transaction) { 
        throw new Error('Not implemented');
    }
    /**
     * @param {query}
     * @abstract
     * @returns { <Transaction | null}
     */
    async delete(query) { 
        throw new Error('Not implemented');
    }
}