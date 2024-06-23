/**
 * @abstract
 * @param { id }
 * @returns { Promise<Cart | null> }
 */
export class CartRepository {
    /**
     * @abstract
     * @param { id }
     * @param {model}  
     * @param {type} 
     * @param {eager}
     * @returns { Promise<Cart | null> }
     */
    async getCartById(id, model, type, eager) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { cart }
     * @param { model }
     * @returns { Promise<Cart | null> }
     */
    async create(cart, model) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Cart }
     * @returns { Promise<Cart | null> }
     */
    async update(cart) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { id }
     * @returns { Promise<Cart | null> }
     */
    async delete(id) {
        throw new Error('Not implemented');
    }
}