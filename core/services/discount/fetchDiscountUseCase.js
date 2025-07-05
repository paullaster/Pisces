export class FetchDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async findById(discountId, { ...rest }) {
        try {
            if (!discountId) {
                return { success: false, error: 'Invalid discount ID' };
            }
            const discount = await this.discountRepository.findById(discountId);
            return discount;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findAll(query) {
        try {
            const discounts = await this.discountRepository.findAll(query);
            return discounts;
        } catch (error) {
            throw error
        }
    }
}