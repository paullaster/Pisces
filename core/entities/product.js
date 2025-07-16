import { Category } from "./category.js";
import { Discount } from "./Discount.js";
import { Image } from "./Image.js";
import { Variant } from "./Variants.js";

export class Product {
    constructor(productId, name, description, recipeTips, createdAt = new Date()) {
        if
            (!productId ||
            !name ||
            !description
        ) {
            throw new Error('Invalid product');
        }
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.recipeTips = recipeTips;
        this.createdAt = createdAt;
        this.categories = [];
        this.images = [];
        this.variants = [];
        this.discounts = [];
        this.updatedAt = null;
        this.deletedAt = null;
    }
    static applyDiscounts(price, discounts) {
        let finalPrice = parseFloat(price);
        const now = new Date();

        const activeDiscounts = discounts.filter(discount => {
            if (!(discount instanceof Discount)) return false;
            const isPublished = discount.status === 'Published';
            const isDateValid = now >= new Date(discount.startPublishing) && now <= new Date(discount.endPublishing);
            return isPublished && isDateValid;
        });

        activeDiscounts.sort((a, b) => {
            if (a.type === 'Fixed' && b.type !== 'Fixed') return -1;
            if (a.type !== 'Fixed' && b.type === 'Fixed') return 1;
            return 0;
        });

        for (const discount of activeDiscounts) {
            const discountAmount = parseFloat(discount.amount);
            if (discount.type === 'Percentage') {
                finalPrice -= finalPrice * (discountAmount / 100);
            } else if (discount.type === 'Fixed') {
                finalPrice -= discountAmount;
            }
        }

        return parseFloat(Math.max(0, finalPrice).toFixed(2));
    }
    static async createProuctFromORMModel(model, hydrate = false) {
        const product = new Product(
            model.pid,
            model.name,
            model.description,
            model.recipeTips,
            model.createdAt,
        );
        product.updatedAt = model.updatedAt;
        product.deletedAt = model.deletedAt;
        if (model.Images) {
            for (const image of model.Images) {
                product.addProductImage(image)
            }
        }
        if (hydrate) {
            if (model.ProductCategories) {
                for (const categoryModel of model.ProductCategories) {
                    await product.hydrateCategoryFromModel(categoryModel);
                }
            }
            if (model.ProductDiscounts) {
                for (const discount of model.ProductDiscounts) {
                    await product.hydrateDiscountFromModel(discount);
                }
            }
        } else {
            if (model.ProductCategories) {
                for (const categoryModel of model.ProductCategories) {
                    await product.addCategoryFromModel(categoryModel);
                }
            }
            if (model.ProductDiscounts) {
                for (const discount of model.ProductDiscounts) {
                    await product.addDiscountFromModel(discount);
                }
            }
        }
        if (model.ProductVariants) {
            for (const variantModel of model.ProductVariants) {
                await product.addVariantFromModel(variantModel, hydrate)
            }
        }
        return product;
    }

    static createProductFromRawObject({ productId, name, description, recipeTips }) {
        return new Product(productId, name, description, recipeTips);
    }
    updateProduct({ name, price, description, recipeTips }) {
        this.name = name;
        this.description = description;
        this.recipeTips = recipeTips;
    }
    addProductImage(model) {
        const image = Image.createImageFromModel(model);
        this.images.push(image);
    }
    async addCategoryFromModel(model) {
        const category = {
            productCategoryId: model.id,
            productId: model.productId,
            categoryId: model.categoryId,
        };
        this.categories.push(category);
    }
    async hydrateCategoryFromModel(model) {
        if (model.Category) {
            const hydratedCategory = await Category.createCategoryFromModel(model.Category);
            this.categories.push(hydratedCategory);
        }
    }
    async hydrateDiscountFromModel(model) {
        if (model.Discount) {
            const discount = await Discount.createFromModel(model.Discount);
            this.discounts.push(discount);
        }
    }
    addCategoryFromRawObject(id, category) {
        const newProdCategory = {
            productCategoryId: id,
            productId: this.productId,
            categoryId: category,
        };
        this.categories.push(newProdCategory);
    }
    async addVariantFromModel(model, hydrate = false) {
        const newProductVariant = await Variant.createFromModel(model, this.discounts, hydrate);
        this.variants.push(newProductVariant);
    }
    addVariantFromRawObject({ id, name, sku, price, quantity, attributes }) {
        const newProductVariant = Variant.createProductVariantFromRawObject({ id, product: this.productId, name, sku, price, quantity, attributes });
        this.variants.push(newProductVariant);
    }
    addDiscountFromRawObject(id, discount) {
        const newDiscount = {
            id: id,
            product: this.productId,
            discount: discount,
        }
        this.discounts.push(newDiscount);
    }
    async addDiscountFromModel(model) {
        const newDiscount = {
            id: model.id,
            product: model.productId,
            discount: model.discountId,
        }
        this.discounts.push(newDiscount);
    }
    toPersistenceObject() {
        return {
            pid: this.productId,
            name: this.name,
            description: this.description,
            recipeTips: this.recipeTips,
            createdAt: this.createdAt,
        }
    }
    productCategoryToPersistenceObject(category) {
        return {
            id: category.productCategoryId,
            productId: category.productId,
            categoryId: category.categoryId,
        };
    }
    productDiscountToPersistenceObject(discount) {
        return {
            id: discount.id,
            productId: discount.product,
            discountId: discount.discount,
        }
    }
}