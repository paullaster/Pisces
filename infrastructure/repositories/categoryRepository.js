import { Category } from "../../core/entities/category.js";
import { ICategoryRepository } from "../../core/repositories/interfaces/categoryRepository.js";

export class SequelizeCategoryRepository extends ICategoryRepository {
    constructor(categoryModel) {
        super();
        this.categoryModel = categoryModel;
    }
    async findById(categoryId, { ...rest }) {
        try {
            let category;
            category = await this.categoryModel.findByPk(categoryId);
            if (!category) {
                return { success: false, error: 'category not found' };
            }
            category = category.toJSON();
            return { succes: true, data: this.mapToCategory(category) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async save(category) {
        try {
            const categoryData = {
                cid: category.categoryId,
                name: category.name,
                description: category.description,
                color: category.color,
                icon: category.icon,
                isActive: category.isActvie,
            };
            const productExist = await this.categoryModel.findByPk(category.categoryId);
            if (productExist) {
                await this.categoryModel.update(categoryData, { where: { cid: category.categoryId } });
            } else {
                await this.categoryModel.create(categoryData);
            }
            return { success: true, data: category }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    mapToCategory(category) {
        return Category.createCategoryFromModel(category);
    }
}