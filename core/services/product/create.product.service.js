import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { safeTypeChecker } from "../../../common/safeTypeChecker.js";
import { Product } from "../../entities/product.js";
import { ProductCategory } from "../../entities/productCategory.js";
import { ProductDiscount } from "../../entities/ProductDiscount.js";
import { VariantAttribute } from "../../entities/VariantAttribute.js";
import { Variant } from "../../entities/Variants.js";
export class CreateProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(product) {
        try {
            if (!product || safeTypeChecker(product) !== 'Object' || !Object.keys(product).length) {
                return { success: false, error: 'Invalid product' };
            }

            const productId = RandomCodeGenerator(10, 'pd');
            const newProduct = Product.createProductFromRawObject({
                productId,
                name: product.name,
                price: product.price,
                description: product.description,
                recipeTips: product.recipeTips,
            });
            if (product.categories && product.categories.length) {
                newProduct.categories = product.categories.map((category) => {
                    const id = RandomCodeGenerator(5, 'pc');
                    return ProductCategory.createProductCategoryFromRawObject({ id, product: productId, category });
                });
            }
            if (product.variants && product.variants.length) {
                newProduct.variants = product.variants.map((variant) => {
                    const id = `${RandomCodeGenerator(3, 'v')}_${Date.now()}`;
                    const { name, sku, price, quantity } = variant;
                    const newVariant = {
                        id, product: productId, name, price, quantity, sku,
                        attributes: variant.attributes.map((att) => {
                            const vaId = `${RandomCodeGenerator(2, 'va')}_${Date.now()}`;
                            return VariantAttribute.createFromRawObject(vaId, id, att.value);
                        }),
                    };
                    return Variant.createProductVariantFromRawObject(newVariant);
                });
            }
            if (product.discounts && product.discounts.length) {
                newProduct.discounts = product.discounts.map((discount) => {
                    const id = `${RandomCodeGenerator(3, 'pd')}_${Date.now()}`;
                    return ProductDiscount.createFromRawObject(id, productId, discount);
                });
            }
            return await this.productRepository.save(newProduct);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}