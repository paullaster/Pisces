import { ProductCategory } from "./productCategory.js";

export class Product {
    discoutedPrice;
    constructor(productId, name, price, description, recipeTips, createdAt = new Date(), categories = [], variants = [], discounts = [], images = []) {
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
        this.categories = categories;
        this.images = images;
        this.variants = variants;
        this.discounts = discounts;
        this.discountedPrice = 0,
            this.updatedAt = "";
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
        if (model.ProductCategories) {
            model.ProductCategories.forEach((categoryModel) => product.addCategoryFromModel(categoryModel));
        }
        if (model.ProductVariants) {
            model.ProductVariants.forEach((variantModel) => product.addCategoryFromModel(variantModel));
        }
        return product;
    }
    static createProductFromRawObject({ productId, name, price, description, recipeTips }) {
        return new Product(productId, name, price, description, recipeTips);
    }
    addCategoryFromModel(model) {
        const category = ProductCategory.createProductCategoryFromModel(model);
        this.categories.push(category);
    }
    addVariantFromModel(model) {

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