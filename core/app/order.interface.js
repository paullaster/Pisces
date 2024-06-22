/**
 * @abstract
 * @param { id }
 * @returns { Promise<Order | null> }
 */
export class OrderRepository {
    /**
     * @abstract
     * @param { id }
     * @returns { Promise<Order | null> }
     */
    async getOrderById(id) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Order }
     * @returns { Promise<Order | null> }
     */
    async create(Order) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { Order }
     * @returns { Promise<Order | null> }
     */
    async update(Order) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { id }
     * @returns { Promise<Order | null> }
     */
    async delete(id) {
        throw new Error('Not implemented');
    }
}