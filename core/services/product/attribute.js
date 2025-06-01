import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Attribute } from "../../entities/Attribute.js";

export class CreateAttributeUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async execute(payload) {
        try {
            if (!payload || safeTypeChecker(payload) !== 'Object') {
                return { success: false, error: 'invalid request' }
            }
            const newAttribute = new Attribute(RandomCodeGenerator(8), payload.name);
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
            const newAttribute = new Attribute(attributeId, payload.name);
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
    async findById(attributeId) {
        try {
            if (!attributeId) {
                return { success: false, error: 'invalid request' }
            }
            return await this.attributeRepository.findById(attributeId);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findAll() {
        try {
            return await this.attributeRepository.findAll();
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