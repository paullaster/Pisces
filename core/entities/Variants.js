export class Variant {
    constructor(variantId, productId, name, sku, price, quantity, attributes = []) {
        if (!variantId || typeof price !== 'number' || price < 0 || typeof quantity !== 'number' || quantity < 0) {
            throw new Error('Invalid product variant');
        }
        this.variantId = variantId;
        this.productId = productId;
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.quantity = quantity;
        this.attributes = attributes;
    }
    static createProductVariantFromRawObject({ id, product, name, sku, price, quantity, attributes }) {
        return new Variant(id, product, name, sku, price, quantity, attributes);
    }
    toPersistenceObject() {
        return {
            variantId: this.variantId,
            productId: this.productId,
            name: this.name,
            sku: this.sku,
            price: this.price,
            quantity: this.quantity
        };
    }
}