import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { JoiSanitizer } from "../../middleware/joisanitizer.js";

export class AttributeController {
    constructor(createAttributeUseCase, updateAttributeUseCase, fetchAttributeUseCase, deleteAttributeUseCase) {
        this.createAttributeUseCase = createAttributeUseCase;
        this.updateAttributeUseCase = updateAttributeUseCase;
        this.fetchAttributeUseCase = fetchAttributeUseCase;
        this.deleteAttributeUseCase = deleteAttributeUseCase;
    }
    async create(req, res) {
        try {
            const validator = new JoiSanitizer();
            const validAttr = validator.validateAttribute(req.payload);
            if (validAttr.error) {
                return res.ApiResponse.error(400, validAttr.error.details[0].message);
            }
            const { success, data, error } = await this.createAttributeUseCase.execute(req.body);
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async update(req, res) {
        try {
            if (safeTypeChecker(req.body) !== 'Object') {
                return res.ApiResponse.error(400, 'Invalid body');
            }
            const { success, data, error } = await this.updateAttributeUseCase.execute(req.params.attributeId, req.body);
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async findOne(req, res) {
        try {
            const { success, data, error } = await this.fetchAttributeUseCase.findById(req.params.attributeId);
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async findAll(req, res) {
        try {
            const { success, data, error } = await this.fetchAttributeUseCase.findAll();
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async delete(req, res) {
        try {
            const { success, data, error } = await this.deleteAttributeUseCase.execute(req.params.attributeId);
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}