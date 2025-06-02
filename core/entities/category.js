export class Category {
    constructor(categoryId, name, description, color, icon, isActive, slug, parentCategoryId) {
        if (!categoryId) {
            throw new Error('Invalid Category');
        }
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.color = color;
        this.icon = icon;
        this.isActive = isActive;
    }
    static createCategoryFromModel(model) {
        return new Category(model.cid, model.name, model.description, model.color, model.icon, model.isActive);
    }
    static createCategoryFromRawObject({ categoryId, name, description, color, icon, isActive }) {
        return new Category(categoryId, name, description, color, icon, isActive);
    }
}