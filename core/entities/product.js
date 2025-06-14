import { Image } from "./Image.js";
import { ProductCategory } from "./productCategory.js";
import { ProductDiscount } from "./ProductDiscount.js";
import { Variant } from "./Variants.js";

export class Product {
    discoutedPrice;
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
    }
    static createProuctFromORMModel(model) {
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
            model.Images.forEach((image) => product.addProductImage(image));
        }
        if (model.ProductCategories) {
            model.ProductCategories.forEach((categoryModel) => product.addCategoryFromModel(categoryModel));
        }
        if (model.ProductVariants) {
            model.ProductVariants.forEach((variantModel) => product.addVariantFromModel(variantModel));
        }
        if (model.ProductDiscounts) {
            model.ProductDiscounts.forEach((discount) => product.addDiscountFromModel(discount));
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
    addCategoryFromModel(model) {
        const category = ProductCategory.createProductCategoryFromModel(model);
        this.categories.push(category);
    }
    addCategoryFromRawObject(id, category) {
        const newProdCategory = ProductCategory.createProductCategoryFromRawObject({ id, product: this.productId, category });
        this.categories.push(newProdCategory);
    }
    addVariantFromModel(model) {
        const newProductVariant = Variant.createFromModel(model);
        this.variants.push(newProductVariant);
    }
    addVariantFromRawObject({ id, name, sku, price, quantity, attributes }) {
        const newProductVariant = Variant.createProductVariantFromRawObject({ id, product: this.productId, name, sku, price, quantity, attributes });
        this.variants.push(newProductVariant);
    }
    addDiscountFromRawObject(id, discount) {
        const newDiscount = ProductDiscount.createFromRawObject(id, this.productId, discount);
        this.discounts.push(newDiscount);
    }
    addDiscountFromModel(model) {
        const newDiscount = ProductDiscount.createFromModel(model);
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
}