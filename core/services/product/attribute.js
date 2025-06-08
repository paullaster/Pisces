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
                throw new Error('Invalid Request');
            }
            const id = RandomCodeGenerator(8);
            let newAttribute = Attribute.createFromRawObject(id, payload.name);
            if (payload.values) {
                payload.values.forEach((value) => { newAttribute.addValueFromRawObject(`${RandomCodeGenerator(3)}_${Date.now()}`, value.value) });
            }
            return await this.attributeRepository.save(newAttribute);
        } catch (error) {
            throw error;
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
                throw new Error('Invalid Request');
            }
            const attribute = await this.attributeRepository.findById(attributeId, { eager: true });
            if (!attribute) {
                throw new Error('Invalid attribute ' + attributeId);
            }
            attribute.updateAttribute(payload.name);
            if (payload.values) {
                payload.values.forEach((value) => attribute.addValueFromRawObject(`${RandomCodeGenerator(3)}_${Date.now()}`, value.value));
            }
            return await this.attributeRepository.save(attribute);
        } catch (error) {
            throw error;
        }
    }
}

export class DeleteAttributeValueUseCase {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async execute(attributeId, payload) {
        try {
            if (!attributeId || safeTypeChecker(payload) !== 'Object') {
                throw new Error('Invalid Request');
            }
            const attribute = await this.attributeRepository.findById(attributeId, { eager: true });
            if (!attribute) {
                throw new Error('Invalid attribute ' + attributeId);
            }
            if (payload.archivedValues) {
                payload.archivedValues.forEach((value) => attribute.archiveAttributeValue(value.id));
            }
            return await this.attributeRepository.save(attribute);
        } catch (error) {
            throw error;
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
                throw new Error('Invalid Request');
            }
            return await this.attributeRepository.findById(attributeId, query);
        } catch (error) {
            throw error;
        }
    }
    async findAll(query = {}) {
        try {
            return await this.attributeRepository.findAll(query);
        } catch (error) {
            throw error;
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
                throw new Error('Invalid Request');
            }
            return await this.attributeRepository.delete(attributeId);
        } catch (error) {
            throw error;
        }
    }
}