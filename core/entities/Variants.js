import { VariantAttribute } from "./VariantAttribute.js";

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
        this.deletedAt = null;
    }
    static createProductVariantFromRawObject({ id, product, name, sku, price, quantity, attributes }) {
        const newVariant = new Variant(id, product, name, sku, price, quantity);
        if (attributes) {
            attributes.forEach((attribute) => {
                console.log('variant attribute: ', attribute.id, newVariant.variantId, attribute.value)
                const newvariantAttribute = VariantAttribute.createFromRawObject(attribute.id, newVariant.variantId, attribute.value);
                newVariant.attributes.push(newvariantAttribute);
            })
        }
        return newVariant;
    }
    static createFromModel(model) {
        const variant = new Variant(model.variantId, model.productId, model.name, model.sku, Number(model.price), Number(model.quantity));
        variant.deletedAt = model.deletedAt;
        if (model.VariantAttributes) {
            model.VariantAttributes.forEach((attrModel) => variant.addVariantAttributesFromModel(attrModel));
        }
        return variant
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
    addVariantAttributesFromModel(model) {
        const attribute = VariantAttribute.createFromModel(model);
        this.attributes.push(attribute);
    }
}