import { Category } from "../../core/entities/category.js";
import { CategoryRepository } from "../../core/app/category.interface.js";

export class SequelizeCategoryRepository extends CategoryRepository {
    /**
     * 
     * @param {*} CategoryModel 
     */
    constructor(CategoryModel) {
        super();
        this.dataSource = CategoryModel;
        this.mapToCategory = this.mapToCategory.bind(this);
    }
    /**
     * 
     * @param {*} cid 
     * @param {*} type 
     * @param {*} eager 
     * @param {*} model 
     * @returns 
     */
    async getCategoryById(cid, type = 'fetch', eager = false, model = []) {
        try {
            let category = await this.dataSource.findByPk(cid);
            if (eager) {
                category = await category.reload({ include: model });
            }
            if (type === 'create' && category) {
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
    /**
     * 
     * @param {*} options 
     * @param {*} offset 
     * @param {*} limit 
     * @param {*} eager 
     * @param {*} model 
     * @returns 
     */
    async getCategorys(options = {}, offset = 0, limit = 10, eager = false, model = []) {
        try {
            let categories;
            if (eager) {
                categories = await this.dataSource.findAndCountAll({
                    where: options,
                    offset: Number(offset),
                    limit: Number(limit),
                    include: model,
                });
            } else {
                categories = await this.dataSource.findAndCountAll({
                    where: options,
                    offset: Number(offset),
                    limit: Number(limit)
                });
            }
            if (!categories) {
                return { error: 'No category at the moment!', success: false };
            }
            return { success: true, data: { count: categories.count, rows: categories.rows.map(category => this.mapToCategory(category)?.data) } };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} category 
     * @returns 
     */
    async create(category) {
        try {
            const { success, error } = await this.getCategoryById(category.cid, 'create');
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
            const { data, success, error } = await this.getCategoryById(category);
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