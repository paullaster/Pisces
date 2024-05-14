import { ProductRepository } from "../../core/app/product.interface.js";
import { Product } from "../../core/types/product.js";

export class SequelizeProductRepository extends ProductRepository {
    constructor(ProductModel) {
        super();
        this.dataSource = ProductModel;
        this.mapToProduct = this.mapToProduct.bind(this);
    }
    async getProductById(pid) {
        const product = await this.dataSource.findByPk(pid);
        return this.mapToProduct(product);
    }
    async getProductByName(title, offset = 0, limit =10) {
        const product = await this.dataSource.findAndCountAll({ where: { title },   offset, limit});
        return this.mapToProduct(product);
    }
    async getProducts(options = {}, offset = 0, limit =10) {
        const products = await this.dataSource.findAndCountAll({where: {
            ...options,
        }, offset, limit});
        return products.map(this.mapToProduct);
    }
    async create(product) {
        const newProduct = await this.dataSource.create(product);
        return this.mapToProduct(newProduct);
    }
    async update(product) {
        await this.dataSource.update(product, { where: { pid: product.pid } });
        return this.mapToProduct(product);
    }
    async delete(pid) {
        await this.dataSource.destroy({ where: { pid } });
    }
    mapToProduct(product) {
        return new Product(product['dataValues']);
    }
}