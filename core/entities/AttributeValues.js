export class AttributeValues {
    constructor(valueId, attributeId, value,) {
        if (!valueId || !attributeId) {
            throw new Error('Invalid attribute value');
        }
        this.valueId = valueId;
        this.attributeId = attributeId;
        this.value = value;
    }
    static async createAttributeValuesFromRawObject(id, attribute, value) {
        return new AttributeValues(id, attribute, value);
    }
    static async createAttributeValuesFromORMModel(model) {
        return new AttributeValues(model.id, model.attributeId, model.value);;
    }
    static createWithIdOnly(id, attribute) {
        return new AttributeValues(id, attribute);
    }
    toPersistenceObject() {
        return {
            id: this.valueId,
            attributeId: this.attributeId,
            value: this.value,
        };
    }
}