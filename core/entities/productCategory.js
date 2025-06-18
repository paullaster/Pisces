import { Category } from "./category.js";

export class ProductCategory {
    constructor(productCategoryId, productId, categoryId) {
        if (!productCategoryId) {
            throw new Error('Invalid product category');
        }
        this.productCategoryId = productCategoryId;
        this.productId = productId;
        this.categoryId = categoryId;
    }
    static createProductCategoryFromRawObject({ id, product, category }) {
        return new ProductCategory(id, product, category);
    }
    static createProductCategoryFromModel(model) {
        let category;
        if (model.Category) {
            const hydratedCategory = Category.createCategoryFromModel(model.Category);
            category = hydratedCategory;
        } else {
            category = new ProductCategory(model.id, model.productId, model.categoryId);
        }
        return category
    }
    toPersistenceObject() {
        return {
            id: this.productCategoryId,
            productId: this.productId,
            categoryId: this.categoryId,
        };
    }
}