export class AttributeController {
    constructor(createAttributeUseCase, updateAttributeUseCase, fetchAttributeUseCase, deleteAttributeUseCase, deleteAttributeValueUseCase) {
        this.createAttributeUseCase = createAttributeUseCase;
        this.updateAttributeUseCase = updateAttributeUseCase;
        this.fetchAttributeUseCase = fetchAttributeUseCase;
        this.deleteAttributeUseCase = deleteAttributeUseCase;
        this.deleteAttributeValueUseCase = deleteAttributeValueUseCase;
    }
    async create(req, res) {
        try {
            const attribute = await this.createAttributeUseCase.execute(req.body);
            return res.ApiResponse.success(attribute, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async update(req, res) {
        try {
            const data = await this.updateAttributeUseCase.execute(req.params.attributeId, req.body);
            return res.ApiResponse.success(data, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async findOne(req, res) {
        try {
            const { success, data, error } = await this.fetchAttributeUseCase.findById(req.params.attributeId, req.query);
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
            const { success, data, error } = await this.fetchAttributeUseCase.findAll(req.query);
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
            await this.deleteAttributeUseCase.execute(req.params.attributeId);
            return res.ApiResponse.success({}, 204);
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
    async deleteAttributeValue(req, res) {
        try {
            await this.deleteAttributeValueUseCase.execute(req.params.attributeId, req.body);
            return res.ApiResponse.success({}, 204);
        } catch (error) {
            return res.ApiResponse.error(500, error.message, error.stack);
        }
    }
}