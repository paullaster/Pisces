import { Attribute } from "./Attribute.js";
import { AttributeValues } from "./AttributeValues.js";

export class Variant {
    constructor(variantId, productId, name, sku, price, quantity, attributes = []) {
        if (!variantId || !this.checkIfValidIntOrFloat(price) || !this.ensureNonZero(price) || !this.checkIfValidIntOrFloat(quantity) || !this.ensureNonZero(quantity)) {
            throw new Error('Invalid product variant');
        }
        this.variantId = variantId;
        this.productId = productId;
        this.name = name;
        this.sku = sku;
        this.price = parseFloat(price);
        this.quantity = parseInt(quantity);
        this.attributes = attributes;
        this.deletedAt = null;
    }
    static createProductVariantFromRawObject({ id, product, name, sku, price, quantity, attributes }) {
        const newVariant = new Variant(id, product, name, sku, price, quantity);
        if (attributes) {
            for (const attribute of attributes) {
                const newvariantAttribute = {
                    id: attribute.id,
                    variant: newVariant.variantId,
                    value: attribute.value,
                }
                newVariant.attributes.push(newvariantAttribute);
            }
        }
        return newVariant;
    }
    static async createFromModel(model, hydrate = false) {
        const variant = new Variant(model.variantId, model.productId, model.name, model.sku, model.price, model.quantity);
        variant.deletedAt = model.deletedAt;

        if (model.VariantAttributes) {
            if (hydrate) {
                for (const attrModel of model.VariantAttributes) {
                    await variant.hydrateAttributeFromModel(attrModel);
                }
            } else {
                for (const attrModel of model.VariantAttributes) {
                    await variant.addVariantAttributesFromModel(attrModel);
                }
            }
        }
        return variant
    }
    checkIfValidIntOrFloat(input) {
        const reg = /^[+-]?\d+(\.\d+)?$/;
        return reg.test(input);
    }
    ensureNonZero(value) {
        return Number(value) > 0;
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
    variantAttributeToPersistenceObject(attribute) {
        const valueId = attribute.values && attribute.values.length > 0 ? attribute.values[0].id : null;
        if (!valueId) {
            throw new Error('Cannot convert hydrated attribute to persistence object: missing value ID');
        }
        return {
            variantAttributeId: attribute.id,
            variantId: attribute.variant,
            valueId: attribute.value,
        };
    }
    async addVariantAttributesFromModel(model) {
        const attribute = {
            id: model.variantAttributeId,
            variant: model.variantId,
            value: model.valueId,
        }
        this.attributes.push(attribute);
    }
    async hydrateAttributeFromModel(model) {
        const rawAttributeValue = model.AttributeValue;
        if (!rawAttributeValue) {
            console.warn('Missing AttributeValue in variant attribute model:', model);
            return;
        }
        const rawAttribute = rawAttributeValue.Attribute;
        if (!rawAttribute) {
            console.warn('Missing Attribute in AttributeValue:', rawAttributeValue);
            return;
        }
        delete rawAttributeValue.Attribute;
        const attr = await Attribute.createFromORMModel(rawAttribute);
        attr.addValueFromModel(rawAttributeValue);
        this.attributes.push(attr);
    }
}