import { Attribute } from "../../core/entities/Attribute.js";
import { IAttributeRepository } from "../../core/repositories/interfaces/attributeRepository.js";

export class SequelizeAttributeRepository extends IAttributeRepository {
    constructor(attributeModel, attributeValueModel) {
        super();
        this.attributeModel = attributeModel;
        this.attributeValueModel = attributeValueModel;
    }
    async findById(attributeId, eager = false) {
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
            let data;
            if (eager) {
                data = new Attribute(attribute.id, attribute.name)
            } else {
                data = new Attribute(attribute.id, attribute.name)
            }
            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findAll() {
        try {
            const attributes = await this.attributeModel.findAndCountAll();
            if (!attributes) {
                return { success: false, error: 'Attributes not found' };
            }
            return { success: true, data: { count: attributes.count, rows: attributes.rows.map((row) => new Attribute(row.toJSON().id, row.toJSON().name)) } }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async save(attribute) {
        try {
            const attributeData = {
                id: attribute.attributeId,
                name: attribute.name,
            }
            const attributeExist = await this.attributeModel.findByPk(attributeData.id);
            if (attributeExist) {
                await this.attributeModel.update(attributeData, { where: { id: attribute.attributeId } });
            } else {
                await this.attributeModel.create(attributeData);
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