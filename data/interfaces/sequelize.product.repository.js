import { ProductRepository } from "../../core/app/product.interface.js";
import { Product } from "../../core/entities/product.js";

export class SequelizeProductRepository extends ProductRepository {
    constructor(ProductModel) {
        super();
        this.dataSource = ProductModel;
        this.mapToProduct = this.mapToProduct.bind(this);
    }
    async getProductById(pid, type = 'fetch', eager = false, model = []) {
        try {
            let product = await this.dataSource.findByPk(pid);
            if (eager) {
                product = await product.reload({ include: model });
            }
            if (type === 'create' && product) {
                return { error: 'Product already exist', success: false };
            }
            if (type === 'create' && !product) {
                return { success: true };
            }
            if (type !== 'create' && !product) {
                return { error: 'Product does not exist', success: false };
            }
            return this.mapToProduct(product);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getProductByName(name, offset = 0, limit = 10, eager = false, model = []) {
        try {
            let products;
            if (eager) {
                products = await this.dataSource.findAndCountAll({ where: { name }, offset: Number(offset), limit: Number(limit), include: model });
            } else {
                products = await this.dataSource.findAndCountAll({ where: { name }, offset: Number(offset), limit: Number(limit) });
            }
            if (!products) {
                return { error: 'Product not found', success: false };
            }
            return { success: true, data: products };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getProducts(options = {}, offset = 0, limit = 10, eager = false, model = []) {
        try {
            let products;
            if (eager) {
                products = await this.dataSource.findAndCountAll({
                    where: options,
                    offset: Number(offset),
                    limit: Number(limit),
                    include: model,
                });
            } else {
                products = await this.dataSource.findAndCountAll({
                    where: options,
                    offset: Number(offset),
                    limit: Number(limit),
                });
            }
            if (!products) {
                return { error: 'No products at the moment', success: false };
            }
            return { success: true, data: { count: products.count, rows: products.rows.map(product => this.mapToProduct(product)?.data) } };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(product) {
        try {
            const { success, error } = await this.getProductById(product.pid, 'create');
            if (!success) {
                return { success, error };
            }
            const newProduct = await this.dataSource.create(product);
            return this.mapToProduct(newProduct);
        } catch (error) {
            console.log(error);
            return { error: error.message, success: false };
        }
    }
    async update(product, payload) {
        try {
            const { data, success, error } = await this.getProductById(product);
            if (!success) {
                return { success: false, error };
            }
            for (const key in data) {
                if (payload[key]) {
                    data[key] = payload[key];
                }
            }
            const item = await this.dataSource.findByPk(product);
            const updatedProduct = await item.update(data);

            if (!updatedProduct) {
                return { success: false, error: 'Can not find this product' };
            }
            return this.mapToProduct(updatedProduct);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(pid) {
        try {
            return { succuess: true, data: await this.dataSource.destroy({ where: { pid } }), };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToProduct(product) {
        try {
            return { success: true, data: new Product(product['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}