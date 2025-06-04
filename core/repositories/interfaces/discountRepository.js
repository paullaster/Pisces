export class IDiscountRepository {
    findById(discountId) {
        throw new Error('findById() metod must be implemented');
    }
    findAll() {
        throw new Error('findAll() method must be implemented');
    }
    save(discount) {
        throw new Error('save() must be implemented');
    }
    delete(discountId) {
        throw new Error('delete() method must be implemented');
    }
}