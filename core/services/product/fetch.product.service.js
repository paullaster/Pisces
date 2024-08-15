import app from "../../../config/app.js";
import * as fs from "fs";

export class FetchProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.fetchProductByID = this.fetchProductByID.bind(this);
        this.fetchProductByName = this.fetchProductByName.bind(this);
        this.fetchAllProducts = this.fetchAllProducts.bind(this);
    }
    async fetchProductByID(pid) {
        try {
            if (!pid) {
                return {success: false, error: 'Product ID is required'};
            }
            if (typeof pid!=='string') {
                return {success: false, error: 'Product ID must be a string'};
            }
            if (pid.trim().length===0) {
                return {success: false, error: 'Product ID cannot be empty'};
            }
            const {success, data, error } = await this.productRepository.getProductById(pid);
            if (!success) {
                return {success: false, error};
            }
            return {success: true, product: data};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
    async fetchProductByName(name, offset = 0, limit = 10) {
        try {
            if (!name) {
                return {success: false, error: 'Product name is required'};
            }
            if (typeof name!=='string') {
                return {success: false, error: 'Product name must be a string'};
            }
            if (name.trim().length===0) {
                return {success: false, error: 'Product name cannot be empty'};
            }
            const {success, error, data } = await this.productRepository.getProductByName(name, offset, limit);
            if (!success) {
                return {success: false, error};
            }
            return {success: true, product: data};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
    async fetchAllProducts(options = {}, offset = 0, limit =10, eager = false, model = []) {
        try {
            const { success, error, data } = await this.productRepository.getProducts(options, offset, limit, eager, model);
            if(!success) {
                return {success: false, error};
            }
            data.rows.forEach(row => {
                row.Images.forEach(image =>{
                    // fs.readFileSync()
                    image['dataValues'].url = `${app.url}/public/image/${image.imgId}.${image.mimetype.split('/')[1]}`;
                });
            });
            return {success: true, products: data};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}