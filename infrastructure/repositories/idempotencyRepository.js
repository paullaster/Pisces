import { Idempotency } from "../../core/entities/idempotency.js";
import { IIdempotencyRepository } from "../../core/repositories/interfaces/idempotencyRepository.js";

export class SequelizeIdempotencyRepository extends IIdempotencyRepository {
    constructor(idempotencyModel) {
        super();
        this.idempotencyModel = idempotencyModel;
    }
    async findById(idempotencyId) {
        try {
            const key = await this.idempotencyModel.findByPk(idempotencyId);
            if (!key) {
                return { success: false, error: 'key not found' };
            }
            return { success: true, transaction: new Idempotency(key['dataValues'].key, key['dataValues'].status, key['dataValues'].createdAt) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async save(entry) {
        try {
            const idempotencyData = {
                key: entry.idempotencyId,
                status: entry.status,
                createdAt: entry.createdAt.toISOString(),
            };
            const existingModel = await this.idempotencyModel.findByPk(entry.idempotencyId);
            if (existingModel) {
                await this.idempotencyModel.update(idempotencyData, { where: { key: entry.idempotencyId } });
            } else {
                await this.idempotencyModel.create(idempotencyData);
            }
            return entry;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}