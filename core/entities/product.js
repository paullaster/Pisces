import { Category } from "./category.js";
import { Discount } from "./Discount.js";
import { Image } from "./Image.js";
import { Variant } from "./Variants.js";

export class Product {
    constructor(productId, name, price, description, recipeTips, createdAt = new Date()) {
        if
            (!productId ||
            !name ||
            !price ||
            !description
        ) {
            throw new Error('Invalid product');
        }
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.recipeTips = recipeTips;
        this.createdAt = createdAt;
        this.categories = [];
        this.images = [];
        this.variants = [];
        this.discounts = [];
        this.discountedPrice = 0,
            this.updatedAt = null;
        this.deletedAt = null;
        this.isAvailable = false;
    }
    static async createProuctFromORMModel(model, hydrate = false) {
        const product = new Product(
            model.pid,
            model.name,
            model.price,
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
        if (model.ProductVariants) {
            product.isAvailable = model.ProductVariants.some((variant) => {
                return variant.quantity > 0
            });
            for (const variantModel of model.ProductVariants) {
                await product.addVariantFromModel(variantModel, hydrate)
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
        return product;
    }
    static createProductFromRawObject({ productId, name, price, description, recipeTips }) {
        return new Product(productId, name, price, description, recipeTips);
    }
    updateProduct({ name, price, description, recipeTips }) {
        this.name = name;
        this.price = price;
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
        const newProductVariant = await Variant.createFromModel(model, hydrate);
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
    calculateDiscoutedPrice() {
        this.discoutedPrice = 0;
    }
    toPersistenceObject() {
        return {
            pid: this.productId,
            name: this.name,
            price: this.price,
            discountedPrice: this.discoutedPrice,
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