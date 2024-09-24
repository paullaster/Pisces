import { prepareImageUrl } from "../../../common/prepare.image.url.js";

export class FetchProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.fetchProductByID = this.fetchProductByID.bind(this);
        this.fetchProductByName = this.fetchProductByName.bind(this);
        this.fetchAllProducts = this.fetchAllProducts.bind(this);
    }
    async fetchProductByID(pid, model = []) {
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
            const {success, data, error } = await this.productRepository.getProductById(pid, 'fetch', true, model );
            if (!success) {
                return {success: false, error};
            }
            let product = {
                ...data,
                Images: data.Images.map( image =>{
                    image['dataValues'].url = prepareImageUrl(image.imgId, image.mimetype);
                    return image;
                }),
            }
            
            return {success: true, product};
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
            let products = data.rows.map(row => {
                row.Images= row.Images.map( image =>{
                    image['dataValues'].url = prepareImageUrl(image.imgId, image.mimetype);
                    return image;
                });
                return row;
            });
            products = {
                count: data.count,
                rows: products,
              }
            return {success: true, products };
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}