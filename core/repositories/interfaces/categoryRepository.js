export class ICategoryRepository {
    findById(categoryId, queries) {
        throw new Error('findById() method must be implemented');
    }
    findAll(queries) {
        throw new Error('findAll() must be implemented');
    }
    save(category) {
        throw new Error(`save() must be implemented`);
    }
    delete(categoryId) {
        throw new Error('detele() method must be implemented');
    }
}