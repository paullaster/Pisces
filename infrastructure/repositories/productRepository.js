import { Product } from "../../core/entities/product.js";
import { IProductRepository } from "../../core/repositories/interfaces/productRepository.js";

export class SequelizeProductRepository extends IProductRepository {
    constructor(sequelizeInstance, productModel, productCategoryModel, imageModel, variantModel, variantAttributeModel, productDiscountModel) {
        super();
        this.sequelizeInstance = sequelizeInstance;
        this.productModel = productModel;
        this.productCategoryModel = productCategoryModel;
        this.imageModel = imageModel;
        this.variantModel = variantModel;
        this.variantAttributeModel = variantAttributeModel;
        this.productDiscountModel = productDiscountModel;
    }
    async findById(productId, { ...rest }) {
        try {
            let product;
            product = await this.productModel.findByPk(productId);
            if (!product) {
                return { success: false, error: 'Product not found' };
            }
            product = product.toJSON();
            return { succes: true, data: this.mapToProduct(product) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async save(product) {
        const t = await this.sequelizeInstance.transaction();
        try {
            const productData = product.toPersistenceObject();
            const productExist = await this.productModel.findByPk(product.productId, { transaction: t });
            if (productExist) {
                await this.productModel.update(productData, { where: { pid: product.productId }, transaction: t });
            } else {
                await this.productModel.create(productData, { transaction: t });
            }
            if (product.variants.length) {
                let existingDBVariants = await this.variantModel.findAll({
                    where: {
                        variantId: product.productId,
                    },
                    include: this.variantAttributeModel,
                    transaction: t,
                });
                // const incomingVariantsIds = new Set(product.varaints.map((v) => v.varaintId));
                // const existingDBVariantsIds = new Set(existingDBVariants.map((v) => v.toJSON().variantId));
                const variantPromises = product.variants.map(async (incomingVariant) => {
                    let existingDBVariant;
                    if (existingDBVariants) {
                        existingDBVariant = existingDBVariants.find((v) => v.variantId === incomingVariant.varaintId);
                    }
                    if (existingDBVariant) {
                        await this.variantModel.update(incomingVariant.toPersistenceObject(), { where: { variantId: incomingVariant.variantId }, transaction: t });

                        await this.variantAttributeModel.destroy({ where: { variantId: incomingVariant.varaintId }, transaction: t });
                        if (incomingVariant.attributes && incomingVariant.attributes.length) {
                            const newVariantAttributes = incomingVariant.attributes.map((attr) => {
                                return attr.toPersistenceObject();
                            });
                            await this.variantAttributeModel.bulkCreate(newVariantAttributes, { transaction: t });
                        }
                    } else {
                        await this.variantModel.create(incomingVariant.toPersistenceObject(), { transaction: t });
                        if (incomingVariant.attributes && incomingVariant.attributes.length > 0) {
                            const newVariantAttributes = incomingVariant.attributes.map((attr) => {
                                return attr.toPersistenceObject();
                            });
                            await this.variantAttributeModel.bulkCreate(newVariantAttributes, { transaction: t });
                        }
                    }
                });
                await Promise.all(variantPromises);
            }
            if (product.categories.length) {
                await this.productCategoryModel.destroy({ where: { productId: product.productId }, transaction: t });
                const productCategoryPromises = product.categories.map((c) => {
                    return c.toPersistenceObject();
                });
                await this.productCategoryModel.bulkCreate(productCategoryPromises, { transaction: t });
            }
            if (product.discounts.length) {
                await this.productDiscountModel.destroy({ where: { productId: product.productId }, transaction: t });
                const productDiscountProimses = product.discounts.map((d) => {
                    return d.toPersistenceObject();
                });
                await this.productDiscountModel.bulkCreate(productDiscountProimses, { transaction: t });
            }
            await t.commit();
            return { success: true, data: product }
        } catch (error) {
            console.log(error.message, error.stack)
            await t.rollback();
            return { success: false, error: error.message };
        }
    }
    mapToProduct(product) {
        return Product.createProuctFromORMModel(product);
    }
}