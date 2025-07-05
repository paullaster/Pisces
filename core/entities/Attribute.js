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
    static async createFromRawObject(id, name, values = []) {
        const attr = new Attribute(id, name);
        if (values.length) {
            for (const value of values) {
                await attr.addValueFromRawObject(value);
            }
        }
        return attr;
    }
    static async createFromORMModel(model) {
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
    async addValueFromRawObject(id, value) {
        this.values.push(await AttributeValues.createAttributeValuesFromRawObject(id, this.attributeId, value));
    }
    async addValueFromModel(value) {
        this.values.push(await AttributeValues.createAttributeValuesFromORMModel(value));
    }
    updateAttribute(name = '') {
        if (name) {
            this.name = name;
        }
    }
    async archiveAttributeValue(id) {
        this.archivedValues.push(await AttributeValues.createAttributeValuesFromRawObject(id, this.attributeId));
    }
}