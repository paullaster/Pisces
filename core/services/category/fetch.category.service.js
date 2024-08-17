import { prepareImageUrl } from "../../../common/prepare.image.url.js";

export class FetchCategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.fetchCategoryByID = this.fetchCategoryByID.bind(this);
        this.fetchAllCategories = this.fetchAllCategories.bind(this);
    }
    async fetchCategoryByID(cid) {
        try {
            if (!cid) {
                return { success: false, error: 'Category ID is required' };
            }
            if (typeof cid !== 'string') {
                return { success: false, error: 'Category ID must be a string' };
            }
            if (cid.trim().length === 0) {
                return { success: false, error: 'Category ID cannot be empty' };
            }
            const { success, data, error } = await this.categoryRepository.getCategoryById(cid);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, category: data };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    async fetchAllCategories(options = {}, offset = 0, limit = 10, eager = false, model = []) {
        try {
            const { success, error, data } = await this.categoryRepository.getCategorys(options, offset, limit, eager, model);
            if (!success) {
                return { success: false, error };
            }
            const categories = data.rows.map(row => {
                row.Images= row.Images.map( image =>{
                    image['dataValues'].url = prepareImageUrl(image.imgId, image.mimetype);
                    return image;
                });
                return row;
            });
            return { success, categories };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}