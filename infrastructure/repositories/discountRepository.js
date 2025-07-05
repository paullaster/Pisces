import { Discount } from "../../core/entities/Discount.js";
import { IDiscountRepository } from "../../core/repositories/interfaces/discountRepository.js";

export class SequelizeDiscountRepository extends IDiscountRepository {
    constructor(sequelizeInstance, discountModel) {
        super();
        this.sequelize = sequelizeInstance;
        this.discountModel = discountModel;
    }
    async findById(discountId, query) {
        const t = await this.sequelize.transaction();
        try {
            let discount;
            discount = await this.discountModel.findByPk(discountId, { transaction: t });
            if (!discount) {
                return { success: false, error: 'Discount with this Id was not found' };
            }
            discount = discount.toJSON();
            await t.commit();
            return { success: true, data: this.mapToDiscount(discount) };
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message };
        }
    }
    async findAll(query) {
        const t = await this.sequelize.transaction();
        try {
            let discounts;
            discounts = await this.discountModel.findAndCountAll({ ...query, transaction: t });
            if (discounts.count > 0) {
                discounts.rows = await Promise.all(discounts.rows.map(async (row) => await this.mapToDiscount(row.toJSON())));
            }
            await t.commit();
            return discounts;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async save(discount, query) {
        const t = await this.sequelize.transaction();
        try {

            if (!(discount instanceof Discount)) {
                return { success: false, error: "Must be an instance of Discount", data: discount };
            }
            const discountData = discount.toPersistenceObject();
            const discountExist = await this.discountModel.findByPk(discount.discountId, { transaction: t });
            if (discountExist) {
                await this.discountModel.update(discountData, { transaction: t });
            } else {
                await this.discountModel.create(discountData, { transaction: t });
            }
            await t.commit();
            return { success: true, data: discount };
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message, data: error.stack };
        }
    }
    async delete(discountId) {
        const t = await this.sequelize.transaction();
        try {
            await this.discountModel.destroy({ where: { id: discountId }, transaction: t });
            await t.commit();
        } catch (error) {
            await t.rollback();
            return { success: false, error: error.message };
        }
    }
    async mapToDiscount(discount) {
        return await Discount.createFromModel(discount);
    }
}