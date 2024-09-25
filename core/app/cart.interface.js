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
    async getUserCart(user, model, type, eager) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { cart }
     * @param { user }
     * @returns { Promise<Cart | null> }
     */
    async create(user, cart) {
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
     * @param { model}
     * @returns { Promise<Cart | null> }
     */
    async delete(id, model) {
        throw new Error('Not implemented');
    }
}