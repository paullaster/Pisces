export class AttributeValues {
    constructor(valueId, attributeId, value,) {
        if (!valueId || !attributeId) {
            throw new Error('Invalid attribute value');
        }
        this.valueId = valueId;
        this.attributeId = attributeId;
        this.value = value;
    }
    static createAttributeValuesFromRawObject({ id, attribute, value }) {
        return new AttributeValues(id, attribute, value);
    }
    static createAttributeValuesFromORMModel(model) {
        return new AttributeValues(model.id, model.attributeId, model.value);
    }
    static createWithIdOnly(id, attribute) {
        return new AttributeValues(id, attribute);
    }
}