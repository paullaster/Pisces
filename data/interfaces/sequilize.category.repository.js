import { Category } from "../../core/types/category.js";
import { CategoryRepository } from "../../core/app/category.interface.js";

export class SequelizeCategoryRepository extends CategoryRepository {
    constructor(CategoryModel) {
        super();
        this.dataSource = CategoryModel;
        this.mapToCategory = this.mapToCategory.bind(this);
    }
    async getCategoryById(id) {
        try {
            const category = await this.dataSource.findByPk(id);
            return this.mapToCategory(category);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getCategoryByName(name) {
        try {
            const category = await this.dataSource.findOne({ where: { name } });
            return this.mapToCategory(category);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(category) {
        try {
            const newCategory = await this.dataSource.create(category);
            return this.mapToCategory(newCategory);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async update(category, payload) {
        try {
            const {data, success, error } = await this.getCategoryById(category);
            if (!success) {
                return { success: false, error };
            }
            for (const key in data) {
                if (payload[key]) {
                    data[key] = payload[key];
                }
            }
            const item = await this.dataSource.findByPk(category);
            const updatedCategory = await item.update(data);

            if (!updatedCategory) {
                return { success: false, error: 'Can not find this category' };
            }
            return this.mapToCategory(updatedCategory);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(id) {
        try {
            await this.dataSource.destroy({ where: { id } });
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToCategory(category) {
        return { success: true, data: new Category(category['dataValues']) };
    }
}