import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Attribute } from "../../entities/Attribute.js";
import { AttributeValues } from "../../entities/AttributeValues.js";

export class CreateAttributeUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async execute(payload) {
        try {
            if (!payload || safeTypeChecker(payload) !== 'Object') {
                return { success: false, error: 'invalid request' }
            }
            const id = RandomCodeGenerator(8);
            let newAttribute;
            if (payload.values) {
                newAttribute = new Attribute(id, payload.name,
                    payload.values.map((value) => AttributeValues.createAttributeValuesFromRawObject({ id: `${RandomCodeGenerator(4)}_${Date.now()}`, attribute: id, value: value.value, },))
                );

            } else {

                newAttribute = new Attribute(id, payload.name,);
            }
            return await this.attributeRepository.save(newAttribute);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export class UpdateAttributeUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async execute(attributeId, payload) {
        try {
            if (!attributeId || safeTypeChecker(payload) !== 'Object') {
                return { success: false, error: 'invalid request' }
            }
            let newAttribute;
            if (payload.values) {
                newAttribute = new Attribute(attributeId, payload.name,
                    payload.values.map((value) => {
                        if (value.valueId) {
                            return AttributeValues.createAttributeValuesFromRawObject({ id: value.valueId, attribute: attributeId, value: value.value, },)
                        } else {
                            return AttributeValues.createAttributeValuesFromRawObject({ id: `${RandomCodeGenerator(4)}_${Date.now()}`, attribute: attributeId, value: value.value, },)
                        }
                    })
                );

            } else {

                newAttribute = new Attribute(attributeId, payload.name);
            }
            return await this.attributeRepository.save(newAttribute);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
export class FetchAttributeUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async findById(attributeId, query = {}) {
        try {
            if (!attributeId) {
                return { success: false, error: 'invalid request' }
            }
            return await this.attributeRepository.findById(attributeId, query);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findAll(query = {}) {
        try {
            return await this.attributeRepository.findAll(query);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export class DeleteAttributeUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async execute(attributeId) {
        try {
            if (!attributeId) {
                return { success: false, error: 'invalid request' }
            }
            return await this.attributeRepository.delete(attributeId);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}