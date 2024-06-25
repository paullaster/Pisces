import { TransactionRepository } from "../../core/app/transaction.interface.js";
import { Transaction } from "../../core/types/transaction.js";
import { RandomCodeGenerator } from "../../common/generating_unique_codes.js";

export class SequelizeTransactionRepository extends TransactionRepository {
    constructor(TransactionModel) {
        super();
        this.dataSource = TransactionModel;
        this.mapTransaction = this.mapTransaction.bind(this);
    }
    async getTransById(transId, type = 'fetch') {
        try {
            const transaction = await this.dataSource.findByPk(transId);
            if (type === 'create' && transaction) {
                return { error: '', success: false };
            }
            if (type === 'create' && !transaction) {
                return { success: true };
            }
            if (type !== 'create' && !transaction) {
                return { error: '', success: false };
            }
            return this.mapTransaction(transaction);
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
            const { success:failed, data } = await this.getTransactionByUniqueProperty({checkoutId: transaction.checkoutId});
            if (failed) {
                await this.delete({transId: data.transId});
            }
            const { success } = await this.getTransById(transaction.transId, 'create');
            if (!success) {
                transaction.transId = RandomCodeGenerator(10);
            }
            const newTrans = await this.dataSource.create(transaction);
            return this.mapTransaction(newTrans);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async update(transaction, payload) {
        try {
            transaction.phoneNumber = payload.CallbackMetadata.Item[3].Value;
            transaction.checkoutId = payload.orderId;
            transaction.status = 'Settled';
            transaction.amount = payload.CallbackMetadata.Item[0].Value;
            transaction.transactionID = payload.CallbackMetadata.Item[1].Value;
            transaction.transactionDate = payload.CallbackMetadata.Item[2].Value; 
            transaction.transactionMessage = payload.ResultDesc;
            const tranToUpdate = await this.dataSource.findByPk(transaction.transId);

            for (let prop in tranToUpdate['dataValues']) {
                if (transaction[prop]) {
                    tranToUpdate[prop] = transaction[prop];
                }
            }
            return await tranToUpdate.save();
            
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
    mapTransaction(transaction) {
        try {
            return { success: true, data: new Transaction(transaction['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}