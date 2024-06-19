/**
 * @abstract
 * @param { id }
 * @returns { Promise<Cart | null> }
 */
export class CartRespository {
    /**
     * @abstract
     * @param { id }
     * @returns { Promise<Cart | null> }
     */
    async getCartById(id) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Cart }
     * @returns { Promise<Cart | null> }
     */
    async create(cart) {
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