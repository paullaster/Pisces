export class Attribute {
    constructor(attributeId, name, values = []) {
        if (!attributeId || !name) {
            throw new Error('Invalid attribute');
        }
        this.attributeId = attributeId;
        this.name = name;
        if (values !== undefined && values.length) {
            this.values = values;
        }
    }
}