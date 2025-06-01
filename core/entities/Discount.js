export class Discount {
    constructor(discountId, title, code, amount, type, usageLimit, startPublishing, endPublishing, status, createdAt = new Date()) {
        if (
            !discountId ||
            !title ||
            !code ||
            !amount ||
            !type ||
            !usageLimit ||
            !startPublishing ||
            !endPublishing ||
            !status ||
            !createdAt
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
}