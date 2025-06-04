import { TransactionRepository } from "../../core/app/transaction.interface.js";
import { Transaction } from "../../core/types/transaction.js";
import { RandomCodeGenerator } from "../../common/generating_unique_codes.js";

export class SequelizeTransactionRepository extends TransactionRepository {
    constructor(TransactionModel, FailedTransactionModel = null) {
        super();
        this.dataSource = TransactionModel;
        this.failedTransactionModel = FailedTransactionModel;
        this.mapTransaction = this.mapTransaction.bind(this);
        this.getTrans = this.getTrans.bind(this);
        this.getTransactionByUniqueProperty = this.getTransactionByUniqueProperty.bind(this);
        this.create = this.create.bind(this);
        this.createFailedTransaction = this.createFailedTransaction.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

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
    async getTransactionByUniqueProperty(query, options = {}) {
        try {
            const transaction = await this.dataSource.findOne({
                where: {
                    ...query,
                },
                ...options,
            });
            if (!transaction) {
                return { error: 'Transaction not found.', success: false };
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
            const newTrans = await this.dataSource.create(transaction);
            return this.mapTransaction(newTrans);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async update(payload) {
        try {
            const transaction = await this.dataSource.findOne({
                where: {
                    merchantRequestID: payload.merchantRequestID,
                    checkoutRequestID: payload.checkoutRequestID,
                }
            });
            if (!transaction) {
                switch (payload.ResultCode) {
                    case '0':
                        transaction.status = 'Completed';
                        break;
                    case 0:
                        transaction.status = 'Completed';
                        break;
                    default:
                        transaction.status = 'Failed';
                        break;
                }
                if (transaction.status === 'Completed') {
                    transaction.transactionMessage = payload.ResultDesc;
                    transaction.phoneNumber = payload.CallbackMetadata.Item[4].Value;
                    transaction.amount = payload.CallbackMetadata.Item[0].Value;
                    transaction.transactionID = payload.CallbackMetadata.Item[1].Value;
                    transaction.transactionDate = payload.CallbackMetadata.Item[3].Value;
                    transaction.transId = RandomCodeGenerator(10);
                    transaction.checkoutId = RandomCodeGenerator(12, 'CT');
                    transaction.paymentMethod = 'Mpesa';
                    transaction.checkoutRequestID = payload.checkoutRequestID,
                        transaction.merchantRequestID = payload.merchantRequestID;
                    return await transaction.save();
                } else {
                    return transaction;
                }
            }
            switch (payload.ResultCode) {
                case '0':
                    transaction.status = 'Completed';
                    break;
                case 0:
                    transaction.status = 'Completed';
                    break;
                default:
                    transaction.status = 'Failed';
                    break;

            }
            switch (transaction.status) {
                case 'Completed':
                    transaction.transactionMessage = payload.ResultDesc;
                    transaction.phoneNumber = payload.CallbackMetadata.Item[4].Value;
                    transaction.amount = payload.CallbackMetadata.Item[0].Value;
                    transaction.transactionID = payload.CallbackMetadata.Item[1].Value;
                    transaction.transactionDate = payload.CallbackMetadata.Item[3].Value;
                    return await transaction.save();
                case 'Failed':
                    transaction.transactionMessage = 'Transaction failed';
                    const t = {
                        checkoutId: transaction['dataValues'].checkoutId,
                        merchantRequestID: payload.merchantRequestID,
                        checkoutRequestID: payload.checkoutRequestID,
                        phoneNumber: transaction['dataValues'].phoneNumber,
                        amount: transaction['dataValues'].amount,
                        transId: transaction['dataValues'].transId,
                        status: transaction.status,
                        transactionMessage: transaction.transactionMessage,
                        transactionDate: new Date(),
                    }

                    return await this.createFailedTransaction(t);
                default:
                    transaction.transactionMessage = 'Transaction status unknown';
                    const unkwn = {
                        checkoutId: transaction['dataValues'].checkoutId,
                        merchantRequestID: payload.merchantRequestID,
                        checkoutRequestID: payload.checkoutRequestID,
                        phoneNumber: transaction['dataValues'].phoneNumber,
                        amount: transaction['dataValues'].amount,
                        transId: transaction['dataValues'].transId,
                        status: transaction.status,
                        transactionMessage: transaction.transactionMessage,
                        transactionDate: new Date(),
                    }

                    return await this.createFailedTransaction(unkwn);
            }

        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async createFailedTransaction(transaction) {
        try {
            const failedTransaction = await this.failedTransactionModel.create(transaction);
            return this.mapTransaction(failedTransaction);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(query) {
        try {
            return { succuess: true, data: await this.dataSource.destroy({ where: { ...query } }), };
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