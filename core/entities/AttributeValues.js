export class AttributeValues {
    constructor(valueId, attributeId, value,) {
        if (!valueId || !attributeId || !value) {
            throw new Error('Invalid attribute value');
        }
        this.valueId = valueId;
        this.attributeId = attributeId;
        this.value = value;
    }
}