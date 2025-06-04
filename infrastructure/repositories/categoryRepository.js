import { Category } from "../../core/entities/category.js";
import { ICategoryRepository } from "../../core/repositories/interfaces/categoryRepository.js";

export class SequelizeCategoryRepository extends ICategoryRepository {
    constructor(sequelize, categoryModel) {
        super();
        this.sequelize = sequelize;
        this.categoryModel = categoryModel;
    }
    async findById(categoryId, { ...rest }) {
        const t = await this.sequelize.transaction();
        try {
            let category;
            category = await this.categoryModel.findByPk(categoryId, { transaction: t });
            if (!category) {
                return { success: false, error: 'category not found' };
            }
            category = category.toJSON();
            await t.commit();
            return { succes: true, data: this.mapToCategory(category) };
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message, data: error.stack };
        }
    }
    async findAll(query) {
        const t = await this.sequelize.transaction();
        try {
            let categories;
            categories = await this.categoryModel.findAndCountAll({ transaction: t });
            if (categories.count > 0) {
                categories.rows = categories.rows.map((row) => this.mapToCategory(row.toJSON()));
            }
            await t.commit();
            return { success: true, data: categories };
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message, data: error.stack };
        }
    }
    async save(category) {
        const t = await this.sequelize.transaction();
        try {
            if (!(category instanceof Category)) {
                return { success: false, error: ' Must be an instance of Category' };
            }
            const categoryData = category.toPersistenceObject();
            const productExist = await this.categoryModel.findByPk(category.categoryId, { transaction: t });
            if (productExist) {
                await this.categoryModel.update(categoryData, { where: { cid: category.categoryId }, transaction: t });
            } else {
                await this.categoryModel.create(categoryData, { transaction: t });
            }
            await t.commit();
            return { success: true, data: category }
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message, data: error.stack };
        }
    }
    mapToCategory(category) {
        return Category.createCategoryFromModel(category);
    }
}