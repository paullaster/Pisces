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
        return new VariantAttribute(model.variantAttributeId, model.variantId, model.valueId);
    }
    toPersistenceObject() {
        return {
            variantAttributeId: this.id,
            variantId: this.variant,
            valueId: this.value,
        };
    }
}