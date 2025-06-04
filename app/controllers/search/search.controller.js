import { FetchProductService } from "../../../core/services/product/fetch.product.service.js";
import Product from "../../../data/integrations/database/models/product.js";
import { SequelizeProductRepository } from "../../../data/interfaces/sequelize.product.repository.js";
import { models } from "../../../data/integrations/database/models/index.js";

const { Image } = models;
export class SearchController {
    /**
     * 
     * @param {*} searchService 
     */
    constructor(searchService) {
        this.searchService = searchService;
        this.search = this.search.bind(this);
        this.insertSnapshot = this.insertSnapshot.bind(this);
    }

    async search(req, res) {
        try {
            if (!req.query.q) {
                return res.ApiResponse.error(400, 'Missing search query');
            }
            const { success, results, error } = await this.searchService.search({ term: req.query.q, tolerance: 1, limit: 20, mode: 'fulltext' });
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(results, 200, 'Search results');
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async insertSnapshot() {
        try {
            const fetchProductService = new FetchProductService(new SequelizeProductRepository(Product));
            const { success, products, error } = await fetchProductService.fetchAllProducts({}, 0, 100000, true, [Image]);
            if (!success) {
                console.error('Failed 2 to fetch products re', error);
                return;
            }
            const snapshot = products.rows.map((row) => {
                return {
                    ...row,
                    id: row.pid,
                };
            });
            const insertsnapshot = await this.searchService.insertSnapshot(snapshot);
            if (!insertsnapshot.success) {
                console.error('Failed 3 to insert snapshot', insertsnapshot.error);
            }
        } catch (error) {
            console.error('Failed to insert snapshot try catch:', error);
        }
    }
}