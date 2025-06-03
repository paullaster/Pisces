export class DiscountController {
    constructor(createDiscountUseCase, updateDiscountUseCase, fetchDiscountUseCase, deleteDiscountUseCase) {
        this.createDiscountUseCase = createDiscountUseCase;
        this.updateDiscountUseCase = updateDiscountUseCase;
        this.fetchDiscountUseCase = fetchDiscountUseCase;
        this.deleteDiscountUseCase = deleteDiscountUseCase;
    }
    async create(req, res) {
        try {
            const { success, data, error } = await this.createDiscountUseCase.execute(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error, data);
            }
            return res.ApiResponse.success(data, 201, "Discount created successfully!");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async update(req, res) {
        try {
            const { data, success, error } = await this.updateDiscountUseCase.execute(req.params.discountId, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error, data);
            }
            return res.ApiResponse.success(data, 200, "Discount updated successfully!");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async findById(req, res) {
        try {
            const { data, success, error } = await this.fetchDiscountUseCase.findById(req.params.discountId, req.query);
            if (!success) {
                return res.ApiResponse.error(400, error, data);
            }
            return res.ApiResponse.success(data, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async findAll(req, res) {
        try {
            const { data, success, error } = await this.fetchDiscountUseCase.findAll(req.query);
            if (!success) {
                return res.ApiResponse.error(400, error, data);
            }
            return res.ApiResponse.success(data, 200, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async delete(req, res) {
        try {
            const { data, success, error } = await this.deleteDiscountUseCase.execute(req.params.discountId);
            if (!success) {
                return res.ApiResponse.error(400, error, data);
            }
            return res.ApiResponse.success(data, 204, "Success");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}