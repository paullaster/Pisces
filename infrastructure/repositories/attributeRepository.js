import { Attribute } from "../../core/entities/Attribute.js";
import { IAttributeRepository } from "../../core/repositories/interfaces/attributeRepository.js";

export class SequelizeAttributeRepository extends IAttributeRepository {
    constructor(sequelize, attributeModel, attributeValueModel) {
        super();
        this.sequelize = sequelize;
        this.attributeModel = attributeModel;
        this.attributeValueModel = attributeValueModel;
    }
    async findById(attributeId, { eager, ...rest }) {
        const t = await this.sequelize.transaction();
        try {
            if (!attributeId) {
                throw new Error('Invalid attribute ID ' + attributeId);
            }
            let attribute;
            if (eager) {
                attribute = await this.attributeModel.findByPk(attributeId, {
                    include: this.attributeValueModel,
                    transaction: t,
                });
            } else {

                attribute = await this.attributeModel.findByPk(attributeId, { transaction: t });
            }
            if (!attribute) {
                throw new Error('Attribute not found! ' + attributeId);
            }
            attribute = attribute.toJSON();
            const data = Attribute.createFromORMModel(attribute);
            await t.commit();
            return data
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async findAll({ eager, ...rest }) {
        try {
            let attributes;
            if (eager) {
                attributes = await this.attributeModel.findAndCountAll({ include: this.attributeValueModel });
            } else {

                attributes = await this.attributeModel.findAndCountAll();
            }
            if (!attributes) {
                return { success: false, error: 'Attributes not found' };
            }
            return { success: true, data: { count: attributes.count, rows: attributes.rows.map((row) => Attribute.createFromORMModel(row.toJSON())) } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async save(attribute) {
        const t = await this.sequelize.transaction();
        try {
            const attributeData = attribute.toPersistenceObject();
            const attributeExist = await this.attributeModel.findByPk(attribute.attributeId, { transaction: t });
            if (attributeExist) {
                await this.attributeModel.update(attributeData, { where: { id: attribute.attributeId }, transaction: t });
            } else {
                await this.attributeModel.create(attributeData, { transaction: t });
            }
            if (attribute.values.length) {
                let existingDBAttributeValues = await this.attributeValueModel.findAll({ where: { attributeId: attribute.attributeId }, transaction: t });
                const attributeValuesPromises = attribute.values.map(async (incomingValues) => {
                    let existingAttributeValue;
                    if (existingDBAttributeValues) {
                        existingAttributeValue = existingDBAttributeValues.find((v) => {
                            const objectV = v.toJSON();
                            return objectV.id === incomingValues.valueId;
                        });
                    }
                    if (existingAttributeValue) {
                        await this.attributeValueModel.update(incomingValues.toPersistenceObject(), { where: { id: incomingValues.valueId }, transaction: t });
                    } else {
                        await this.attributeValueModel.create(incomingValues.toPersistenceObject(), { transaction: t });
                    }

                });
                await Promise.all(attributeValuesPromises);
            }
            if (attribute.archivedValues.length) {
                const valuesToDeletePromises = attribute.archivedValues.map(async (valueToDelete) => {
                    await this.attributeValueModel.destroy({ where: { id: valueToDelete.valueId }, transaction: t });
                });
                await Promise.all(valuesToDeletePromises);
            }
            await t.commit();
            return attribute;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async delete(attributeId) {
        try {
            await this.attributeModel.destroy({ where: { id: attributeId } });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}