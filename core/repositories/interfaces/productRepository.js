export class IProductRepository {
    findById(productId, queries) {
        throw new Error('findById() method must be implemented');
    }
    findAll(queries) {
        throw new Error('findAll() must be implemented');
    }
    save(product) {
        throw new Error(`save() must be implemented`);
    }
    delete(productId) {
        throw new Error('detele() method must be implemented');
    }
}