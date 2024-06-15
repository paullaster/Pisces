import { Category } from "../../core/types/category.js";
import { CategoryRepository } from "../../core/app/category.interface.js";

export class SequelizeCategoryRepository extends CategoryRepository {
    constructor(CategoryModel) {
        super();
        this.dataSource = CategoryModel;
        this.mapToCategory = this.mapToCategory.bind(this);
    }
    async getCategoryById(cid, type = 'fetch') {
        try {
            const category = await this.dataSource.findByPk(cid);
            if( type === 'create' && category) {
                return { error: 'Category already exist', success: false };
            }
            if (type === 'create' && !category) {
                return { success: true };
            }
            if (type !== 'create' && !category) {
                return { error: 'Category does not exist', success: false };
            }
            return this.mapToCategory(category);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getCategorys(options = {}, offset = 0, limit =10) {
        try {
            const category = await this.dataSource.findAndCountAll({
                where: options,
                offset: Number(offset),
                limit: Number(limit)
            });
            if (!category) {
                return { error: 'No category at the moment!', success: false };
            }
            return { success: true, data: category };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(category) {
        try {
            const {success, error } =  await this.getCategoryById(category.cid, 'create');
            if (!success) {
                return { error, success };
            }
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
    async delete(cid) {
        try {
            await this.dataSource.destroy({ where: { cid } });
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToCategory(category) {
        return { success: true, data: new Category(category['dataValues']) };
    }
}