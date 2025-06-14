import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";

export class UpdateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(productId, payload) {
        try {
            if (!productId || !payload || safeTypeChecker(payload) !== 'Object') throw new Error('Invalid update request.');
            const product = await this.productRepository.findById(productId, { eager: true });
            if (!product) throw new Error('Invalid product ' + productId);
            const {
                variants,
                categories,
                discounts, ...props } = payload;
            product.updateProduct({ ...props });
            if (categories) {
                categories.forEach((c) => {
                    const id = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                    product.addCategoryFromRawObject(id, c.category);
                });
            }
            if (variants) {
                variants.forEach((variant) => {
                    const id = `${RandomCodeGenerator(3, 'v')
                        }_${Date.now()}`;
                    const { attributes, ...prop } = variant;
                    product.addVariantFromRawObject({
                        id,
                        ...prop,
                        attributes: attributes.map((attr) => {
                            const attrId = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                            return {
                                id: attrId,
                                ...attr
                            }
                        }),
                    });
                });
            }
            if (discounts) {
                discounts.forEach((d) => {
                    const id = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                    product.addDiscountFromRawObject(id, d.discount);
                });
            }
            return await this.productRepository.save(product);
        } catch (error) {
            throw error;
        }
    }
}