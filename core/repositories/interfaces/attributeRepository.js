export class IAttributeRepository {
    findById(attributeId) {
        throw new Error('Must implement findById() method');
    }
    findAll() {
        throw new Error('Must implement findAll() method');
    }
    save(attribute) {
        throw new Error('Must implement save() method');
    }
    delete(attributeId) {
        throw new Error('Must implement this method');
    }
}