export class Discount {
    constructor(discountId, title, code, amount, type, usageLimit, startPublishing, endPublishing, status, createdAt = new Date()) {
        if (
            !discountId
        ) {
            throw new Error('Invalid discount!');
        }
        this.discountId = discountId;
        this.title = title;
        this.code = code;
        this.amount = amount;
        this.type = type;
        this.usageLimit = usageLimit;
        this.startPublishing = startPublishing;
        this.endPublishing = endPublishing;
        this.status = status;
        this.createdAt = createdAt;
    }
    static createFromRawObject({ id, title, code, amount, type, usageLimit, startPublishing, endPublishing, status }) {
        return new Discount(id, title, code, amount, type, usageLimit, startPublishing, endPublishing, status);
    }

    static createFromModel(model) {
        return new Discount(
            model.id,
            model.title,
            model.code,
            model.amount,
            model.type,
            model.usageLimit,
            model.startPublishing,
            model.endPublishing,
            model.status,
            model.createdAt
        );
    }
    toPersistenceObject() {
        return {
            id: this.discountId,
            title: this.title,
            code: this.code,
            amount: this.amount,
            type: this.type,
            usageLimit: this.usageLimit,
            startPublishing: this.startPublishing,
            endPublishing: this.endPublishing,
            status: this.status,
            createdAt: this.createdAt
        }
    }

}