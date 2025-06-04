import { safeTypeChecker } from "../../../common/safeTypeChecker.js";

export class UpdateDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute(discountId, discount) {
        try {
            if (!discountId || safeTypeChecker(discount) !== 'Object') {
                return { success: false, error: 'Invalid discount  or discount ID' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}