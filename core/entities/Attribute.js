import { AttributeValues } from "./AttributeValues.js";

export class Attribute {
    constructor(attributeId, name, values = []) {
        if (!attributeId) {
            throw new Error('Invalid attribute');
        }
        this.attributeId = attributeId;
        this.name = name;
        this.values = values;
    }
    static createFromORMModel(model) {
        if (model.AttributeValues) {
            return new Attribute(model.id, model.name, model.AttributeValues.map((value) => AttributeValues.createAttributeValuesFromORMModel(value)));
        }
        return new Attribute(model.id, model.name);
    }
    static createWithIdAndValueOnly(id, value) {
        return new Attribute(id, null, value);
    }
    addNewValue(value) {
        this.values.push(AttributeValues.createAttributeValuesFromRawObject(value));
    }

}