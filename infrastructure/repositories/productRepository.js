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
    async findById(productId, query) {
        const t = await this.sequelizeInstance.transaction();
        try {
            let product;
            const { eager, ...filters } = query;

            if (eager) {
                product = await this.productModel.findByPk(productId, {
                    ...filters,
                    include: [this.productCategoryModel, this.productDiscountModel, { model: this.variantModel, include: [this.variantAttributeModel] }],
                    transaction: t
                });

            } else {
                product = await this.productModel.findByPk(productId, {
                    ...filters,
                    transaction: t
                });
            }
            if (!product) {
                throw new Error('Product not found!');
            }
            await t.commit();
            return Product.createProuctFromORMModel(product.toJSON());
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async save(product) {
        const t = await this.sequelizeInstance.transaction();
        try {
            if (!(product instanceof Product)) {
                throw new Error('Must of of type Product', product);
            }
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
                        productId: product.productId,
                    },
                    include: this.variantAttributeModel,
                    transaction: t,
                });
                // const incomingVariantsIds = new Set(product.varaints.map((v) => v.varaintId));
                // const existingDBVariantsIds = new Set(existingDBVariants.map((v) => v.toJSON().variantId));
                const variantPromises = product.variants.map(async (incomingVariant) => {
                    let existingDBVariant;
                    if (existingDBVariants) {
                        existingDBVariant = existingDBVariants.find((v) => v.toJSON().variantId === incomingVariant.variantId);
                    }
                    if (existingDBVariant) {
                        await this.variantModel.update(incomingVariant.toPersistenceObject(), { where: { variantId: incomingVariant.variantId }, transaction: t });

                        await this.variantAttributeModel.destroy({ where: { variantId: incomingVariant.variantId }, transaction: t });
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
            return product
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async findAll(query) {
        const t = await this.sequelizeInstance.transaction();
        try {
            let products;
            const { eager, ...filters } = query;
            if (eager) {
                products = await this.productModel.findAndCountAll({
                    ...filters,
                    include: [this.productCategoryModel, this.productDiscountModel, { model: this.variantModel, include: [this.variantAttributeModel] }],
                    transaction: t
                });
            } else {
                products = await this.productModel.findAndCountAll({
                    ...filters,
                    transaction: t
                });
            }
            if (products.count > 0) {
                products.rows = products.rows.map((row) => Product.createProuctFromORMModel(row.toJSON()));
            }
            await t.commit();
            return products;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    mapToProduct(product) {
        return Product.createProuctFromORMModel(product);
    }
}