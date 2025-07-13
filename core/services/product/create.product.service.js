import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Product } from "../../entities/product.js";
export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(product) {
        try {
            if (!product || safeTypeChecker(product) !== 'Object' || !Object.keys(product).length) {
                throw new Error('Invalid request payload');
            }

            const productId = RandomCodeGenerator(6, 'prod');
            const newProduct = Product.createProductFromRawObject({
                productId,
                name: product.name,
                description: product.description,
                recipeTips: product.recipeTips,
            });
            if (product.categories && product.categories.length) {
                for (const c of product.categories) {
                    const id = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                    newProduct.addCategoryFromRawObject(id, c.category);
                }
            }
            if (product.variants && product.variants.length) {
                for (const v of product.variants) {
                    const id = `${RandomCodeGenerator(3, 'v')}_${Date.now()}`;
                    const { name, sku, price, quantity, attributes } = v;
                    newProduct.addVariantFromRawObject({
                        id,
                        name,
                        sku,
                        price, quantity,
                        attributes: attributes.map((attr) => {
                            const attrId = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                            return {
                                id: attrId,
                                ...attr
                            }
                        }),
                    });
                }
            }
            if (product.discounts && product.discounts.length) {
                for (const d of product.discounts) {
                    const id = `${RandomCodeGenerator(3, '_')}_${Date.now()}`;
                    newProduct.addDiscountFromRawObject(id, d.discount);
                }
            }
            return await this.productRepository.save(newProduct);
        } catch (error) {
            throw error;
        }
    }
}