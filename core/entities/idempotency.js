export class Idempotency {
    constructor(idempotencyId, status, createdAt = new Date()) {
        if (!idempotencyId || !status || !createdAt) {
            throw new Error('Invalid idempotency');
        }
        this.idempotencyId = idempotencyId;
        this.status = status;
        this.createdAt = createdAt;
    }
    delete() {

    }
}