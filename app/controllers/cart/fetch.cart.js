export class FetchCartController {
    constructor(fetchCartService) {
        this.fetchCartService = fetchCartService;
        this.fetchCart = this.fetchCart.bind(this);
        this.fetchUserCartItems = this.fetchUserCartItems.bind(this);
        this.fetchCartMiddleware = this.fetchCartMiddleware.bind(this);
    }
    async fetchCart(req, res) {
        try {
            const { success, cart, error } = await this.fetchCartService.fetchCart(req.user.userId, req.model);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(cart, 200, "Cart fetched");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchCartMiddleware(req, res, next) {
        try {
            const { success, cart, error } = await this.fetchCartService.fetchCart(req.transaction.checkoutId, req.cartModels);
            if (!success) {
                return res.ApiResponse.error(500, error);
            } else {
                req.cart = cart;
                next();
            }
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