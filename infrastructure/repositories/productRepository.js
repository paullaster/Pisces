import { Product } from "../../core/entities/product.js";
import { IProductRepository } from "../../core/repositories/interfaces/productRepository.js";

export class SequelizeProductRepository extends IProductRepository {
    constructor(
        sequelizeInstance,
        productModel,
        productCategoryModel,
        imageModel,
        variantModel,
        variantAttributeModel,
        productDiscountModel,
        categoriesModel,
        discountModel,
        attributeValueModel,
        attributeModel
    ) {
        super();
        this.sequelizeInstance = sequelizeInstance;
        this.productModel = productModel;
        this.productCategoryModel = productCategoryModel;
        this.imageModel = imageModel;
        this.variantModel = variantModel;
        this.variantAttributeModel = variantAttributeModel;
        this.productDiscountModel = productDiscountModel;
        this.categoriesModel = categoriesModel;
        this.discountModel = discountModel;
        this.attributeValueModel = attributeValueModel;
        this.attributeModel = attributeModel;
    }
    async findById(productId, query) {
        try {
            let product;
            const { eager, ...filters } = query;

            if (eager) {
                product = await this.productModel.findByPk(productId, {
                    ...filters,
                    include: [
                        this.imageModel,
                        {
                            model: this.productCategoryModel,
                            include: [{
                                model: this.categoriesModel
                            }]
                        },
                        {
                            model: this.productDiscountModel,
                            include: [this.discountModel],
                        },
                        {
                            model: this.variantModel,
                            include: [
                                {
                                    model: this.variantAttributeModel,
                                    include: [{
                                        model: this.attributeValueModel,
                                        include: [this.attributeModel]
                                    }]
                                }
                            ]
                        }],
                });

            } else {
                product = await this.productModel.findByPk(productId, {
                    ...filters,
                    include: this.imageModel,
                });
            }
            if (!product) {
                throw new Error('Product not found!');
            }
            const domainProduct = await Product.createProuctFromORMModel(product.toJSON(), true);
            return domainProduct;
        } catch (error) {
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
                                return incomingVariant.variantAttributeToPersistenceObject(attr);
                            });
                            await this.variantAttributeModel.bulkCreate(newVariantAttributes, { transaction: t });
                        }
                    } else {
                        await this.variantModel.create(incomingVariant.toPersistenceObject(), { transaction: t });
                        if (incomingVariant.attributes && incomingVariant.attributes.length > 0) {
                            const newVariantAttributes = incomingVariant.attributes.map((attr) => {
                                return incomingVariant.variantAttributeToPersistenceObject(attr);
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
                    return product.productCategoryToPersistenceObject(c);
                });
                await this.productCategoryModel.bulkCreate(productCategoryPromises, { transaction: t });
            }
            if (product.discounts.length) {
                await this.productDiscountModel.destroy({ where: { productId: product.productId }, transaction: t });
                const productDiscountProimses = product.discounts.map((d) => {
                    return product.productDiscountToPersistenceObject(d);
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
        try {
            let products;
            const { eager, ...filters } = query;
            if (eager) {
                products = await this.productModel.findAndCountAll({
                    ...filters,
                    include: [
                        this.imageModel,
                        {
                            model: this.productCategoryModel,
                            include: [{
                                model: this.categoriesModel
                            }]
                        },
                        {
                            model: this.productDiscountModel,
                            include: [this.discountModel],
                        },
                        {
                            model: this.variantModel,
                            include: [
                                {
                                    model: this.variantAttributeModel,
                                    include: [{
                                        model: this.attributeValueModel,
                                        include: [this.attributeModel]
                                    }]
                                }
                            ]
                        }],
                    distinct: true
                });
            } else {
                products = await this.productModel.findAndCountAll({
                    ...filters,
                    include: this.imageModel,
                    distinct: true,
                });
            }
            if (products.count > 0) {
                products.rows = (await Promise.allSettled(products.rows.map(async (row) => await Product.createProuctFromORMModel(row.toJSON(), true))))
                    .filter((result) => result.status === 'fulfilled')
                    .map((result) => result.value);
            }
            return products;
        } catch (error) {
            throw error;
        }
    }
    async fetchAllForV2(query) {
        try {
            const products = await this.productModel.findAndCountAll({
                ...query,
                include: [
                    { model: this.imageModel },
                    {
                        model: this.productCategoryModel,
                        include: [{ model: this.categoriesModel }]

                    },
                    {
                        model: this.productDiscountModel,
                        include: [{ model: this.discountModel }],
                    },
                    {
                        model: this.variantModel,
                        include: [
                            {
                                model: this.variantAttributeModel,
                                include: [{
                                    model: this.attributeValueModel,
                                    include: [{ model: this.attributeModel }]

                                }]

                            }
                        ]
                    }
                ],
                distinct: true,

            });


            const rawProductData = products.rows.map(p => p.toJSON());

            return {
                count: products.count,
                rows: rawProductData
            };

        } catch (error) {
            console.error("Error in fetchAllForV2:", error);
            throw error;

        }
    }
    mapToProduct(product) {
        return Product.createProuctFromORMModel(product);
    }
}