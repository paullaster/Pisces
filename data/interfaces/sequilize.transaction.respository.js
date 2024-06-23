import { TransactionRepository } from "../../core/app/transaction.interface.js";
import { Product } from "../../core/types/product.js";

export class SequelizeProductRepository extends TransactionRepository {
    constructor(TransactionModel) {
        super();
        this.dataSource = TransactionModel;
        this.mapTransaction = this.mapTransaction.bind(this);
    }
    async getTransById(transId, type = 'fetch') {
        try {
            const product = await this.dataSource.findByPk(transId);
            if (type === 'create' && product) {
                return { error: '', success: false };
            }
            if (type === 'create' && !product) {
                return { success: true };
            }
            if (type !== 'create' && !product) {
                return { error: '', success: false };
            }
            return this.mapTransaction(product);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getTransactionByUniqueProperty(query){
        try {
            const transaction = await this.dataSource.findOne({
                where: {
                    ...query,
                },
            });
            if (!transaction) {
                return { error: 'This transaction does no exist!', success: false };
            }
            return this.mapTransaction(transaction);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getTrans(options = {}, offset = 0, limit = 10) {
        try {
            const products = await this.dataSource.findAndCountAll({
                where: options,
                offset: Number(offset), 
                limit: Number(limit),
            });
            if (!products) {
                return { error: '', success: false };
            }
            return { success: true, data: products };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(transaction) {
        try {
            const { success, error } = await this.getTransById(transaction.transId, 'create');
            if (!success) {
                return { success, error };
            }
            const newTrans = await this.dataSource.create(transaction);
            return this.mapTransaction(newTrans);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async update(transaction, payload) {
        try {
            for (const key in transaction) {
                if (payload[key]) {
                    transaction[key] = payload[key];
                }
            }
            await transaction.update(transaction);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(query) {
        try {
            return {succuess: true, data: await this.dataSource.destroy({ where: { ...query } }), };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapTransaction(product) {
        try {
            return { success: true, data: new Product(product['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}