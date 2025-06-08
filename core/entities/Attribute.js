import { AttributeValues } from "./AttributeValues.js";

export class Attribute {
    constructor(attributeId, name, values = []) {
        if (!attributeId && !name) {
            throw new Error('Invalid attribute');
        }
        this.attributeId = attributeId;
        this.name = name;
        this.values = values;
        this.archivedValues = [];
    }
    static createFromRawObject(id, name, values = []) {
        const attr = new Attribute(id, name);
        if (values.length) {
            for (const value of values) {
                attr.addValueFromRawObject(value);
            }
        }
        return attr;
    }
    static createFromORMModel(model) {
        const attr = new Attribute(model.id, model.name);
        if (model.AttributeValues) {
            for (const value of model.AttributeValues) {
                attr.addValueFromModel(value);
            }
        }
        return attr;
    }
    static createWithIdAndValueOnly(id, value) {
        return new Attribute(id, null, value);
    }
    toPersistenceObject() {
        return {
            id: this.attributeId,
            name: this.name,
        };
    }
    addValueFromRawObject(id, value) {
        this.values.push(AttributeValues.createAttributeValuesFromRawObject(id, this.attributeId, value));
    }
    addValueFromModel(value) {
        this.values.push(AttributeValues.createAttributeValuesFromORMModel(value));
    }
    updateAttribute(name = '') {
        if (name) {
            this.name = name;
        }
    }
    archiveAttributeValue(id) {
        this.archivedValues.push(AttributeValues.createAttributeValuesFromRawObject(id, this.attributeId));
    }
}