import { Category } from "../../core/entities/category.js";
import { ICategoryRepository } from "../../core/repositories/interfaces/categoryRepository.js";

export class SequelizeCategoryRepository extends ICategoryRepository {
    constructor(sequelize, categoryModel) {
        super();
        this.sequelize = sequelize;
        this.categoryModel = categoryModel;
    }
    async findById(categoryId) {
        const t = await this.sequelize.transaction();
        try {
            let category;
            category = await this.categoryModel.findByPk(categoryId, { transaction: t });
            if (!category) {
                throw new Error('category not found');
            }
            category = category.toJSON();
            category = await this.mapToCategory(category);
            await t.commit();
            return category;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async findAll(query) {
        const t = await this.sequelize.transaction();
        try {
            let categories;
            categories = await this.categoryModel.findAndCountAll({ ...query, transaction: t });
            if (categories.count > 0) {
                categories.rows = (await Promise.allSettled(categories.rows.map(async (row) => await this.mapToCategory(row.toJSON()))))
                    .filter((result) => result['status'] === 'fulfilled').map((fulfilled) => fulfilled['value']);
            }
            await t.commit();
            return categories;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async save(category) {
        const t = await this.sequelize.transaction();
        try {
            if (!(category instanceof Category)) {
                throw new Error('Must be an instance of Category');
            }
            const categoryData = category.toPersistenceObject();
            const productExist = await this.categoryModel.findByPk(category.categoryId, { transaction: t });
            if (productExist) {
                await this.categoryModel.update(categoryData, { where: { cid: category.categoryId }, transaction: t });
            } else {
                await this.categoryModel.create(categoryData, { transaction: t });
            }
            await t.commit();
            return category;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async mapToCategory(category) {
        return await Category.createCategoryFromModel(category);
    }
}