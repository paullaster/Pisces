export class ProductDiscount {
    constructor(id, product, discount) {
        if (!id) {
            throw new Error('Invalid product discount');
        }
        this.id = id;
        this.product = product;
        this.discount = discount;
    }
    static createFromRawObject(id, product, discount) {
        return new ProductDiscount(id, product, discount);
    }
    static createFromModel(model) {
        return new ProductDiscount(model.id, model.productId, model.discountId);
    }
    toPersistenceObject() {
        return {
            id: this.id,
            productId: this.product,
            discountId: this.discount,
        }
    };
}