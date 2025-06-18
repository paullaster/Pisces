import { Attribute } from "./Attribute.js";
import { AttributeValues } from "./AttributeValues.js";

export class VariantAttribute {
    constructor(id, variant, value) {
        if (!id) {
            throw new Error('Invalid variant attribute');
        }
        this.id = id;
        this.variant = variant;
        this.value = value;
    }
    static createFromRawObject(id, varaint, value) {
        return new VariantAttribute(id, varaint, value);
    }
    static createFromModel(model) {
        let variantAttribute;
        if (model.AttributeValue) {
            variantAttribute = AttributeValues.createAttributeValuesFromORMModel(model.AttributeValue);
        } else {
            variantAttribute = new VariantAttribute(model.variantAttributeId, model.variantId, model.valueId);
        }
        return variantAttribute;
    }
    hydrateAttributeFromModel(model) {
        const rawAttributeValue = model;
        const rawAttribute = model.Attribute;
        delete model.Attribute;
        return {
            ...Attribute.createFromORMModel(rawAttribute),
            value: {
                ...AttributeValues.createAttributeValuesFromORMModel(rawAttributeValue),
            }
        }
    }
    toPersistenceObject() {
        return {
            variantAttributeId: this.id,
            variantId: this.variant,
            valueId: this.value,
        };
    }
}