import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Discount } from "../../entities/Discount.js";

export class CreateDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute(discount) {
        try {
            if (!discount || safeTypeChecker(discount) !== 'Object') {
                return { success: false, error: 'Invalid discount' };
            }
            const id = `${RandomCodeGenerator(3)}_${Date.now()}`;
            const { title, code, amount, type, usageLimit, startPublishing, endPublishing, status } = discount;
            const newDiscount = Discount.createFromRawObject({
                id,
                code,
                amount,
                title,
                startPublishing,
                endPublishing,
                status,
                usageLimit,
                type
            });
            console.log(newDiscount instanceof Discount)
            const createdDiscount = await this.discountRepository.save(newDiscount);
            return createdDiscount;
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}