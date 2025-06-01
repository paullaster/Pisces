export class Variant {
    constructor(variantId, productId, name, sku, price, quantity, attributes = []) {
        if (!variantId || !productId || !name || sku || typeof price !== 'number' || price < 0 || typeof quantity !== 'number' || quantity < 0) {
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
}