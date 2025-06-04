import { Attribute } from "../../core/entities/Attribute.js";
import { IAttributeRepository } from "../../core/repositories/interfaces/attributeRepository.js";

export class SequelizeAttributeRepository extends IAttributeRepository {
    constructor(attributeModel, attributeValueModel) {
        super();
        this.attributeModel = attributeModel;
        this.attributeValueModel = attributeValueModel;
    }
    async findById(attributeId, { eager, ...rest }) {
        try {
            if (!attributeId) {
                return { success: false, error: 'Invalid attribute ID' };
            }
            let attribute;
            if (eager) {
                attribute = await this.attributeModel.findByPk(attributeId, {
                    include: this.attributeValueModel,
                });
            } else {

                attribute = await this.attributeModel.findByPk(attributeId);
            }
            if (!attribute) {
                return { success: false, error: 'Attribute not found!' };
            }
            attribute = attribute.toJSON();
            const data = Attribute.createFromORMModel(attribute);
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message };
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
        try {
            const attributeData = {
                id: attribute.attributeId,
                name: attribute.name,
            };
            const attributeExist = await this.attributeModel.findByPk(attributeData.id);
            if (attributeExist) {
                await this.attributeModel.update(attributeData, { where: { id: attribute.attributeId } });
            } else {
                await this.attributeModel.create(attributeData);
            }
            if (attribute.values) {
                attribute.values.forEach(async (value) => {
                    const valueData = {
                        id: value.valueId,
                        attributeId: value.attributeId,
                        value: value.value
                    };
                    const valueExist = await this.attributeValueModel.findByPk(value.valueId);
                    if (valueExist) {
                        await this.attributeValueModel.update(valueData, { where: { id: value.valueId } });
                    } else {
                        await this.attributeValueModel.create(valueData);
                    }
                })
            }
            return { success: true, data: attribute };
        } catch (error) {
            return { success: false, error: error.message };
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