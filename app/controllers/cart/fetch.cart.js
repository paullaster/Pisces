export class FetchCartController {
    constructor(fetchCartService) {
        this.fetchCartService = fetchCartService;
        this.fetchCart = this.fetchCart.bind(this);
        this.fetchUserCartItems = this.fetchUserCartItems.bind(this);
    }
    async fetchCart(req, res) {
        try {
            const { success, cart, error } = await this.fetchCartService.fetchCart(req.params.userId);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(cart, 200, "Cart fetched");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchUserCartItems(req, res) {
        try {
            const { success, cart, error } = await this.fetchCartService.fetchUserCartItems(req.params.userId, { ...req.query });
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(cart, 200, "Cart fetched");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}