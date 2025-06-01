export class IIdempotencyRepository {
    async findById(idempotencyId) {
        throw new Error("Method 'findById()' must be implemented.");
    }
    async save(entry) {
        // Can be used for both create and update.
        throw new Error("Method 'save()' must be implemented.");
    }
    async delete(userId) { throw new Error("Method 'delete()' must be implemented."); }
}