export class DeleteDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute(discountId) {
        try {
            if (!discountId) {
                return { success: false, error: 'Invalid discount ID' };
            }
            await this.discountRepository.delete(discountId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}