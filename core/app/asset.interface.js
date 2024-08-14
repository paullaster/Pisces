/**
 * @abstract
 * @param { id }
 * @returns { Promise<Cart | null> }
 */
export class AssetRepository {
    /**
     * @abstract
     * @param { id }
     * @param {model}  
     * @param {type} 
     * @param {eager}
     * @returns { Promise<Cart | null> }
     */
    async getAssetById(id, model, type, eager) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { asset }
     * @param { model }
     * @param { bulk }
     * @returns { Promise<Cart | null> }
     */
    async create(asset, model, bulk) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { asset }
     * @returns { Promise<Asset | null> }
     */
    async update(asset) {
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