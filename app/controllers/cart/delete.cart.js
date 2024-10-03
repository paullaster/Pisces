export class DeleteCartController {
    constructor(deleteCartService) {
        this.deleteCartService = deleteCartService;
        this.deleteCart = this.deleteCart.bind(this);
        this.deleteCartMiddleware = this.deleteCartMiddleware.bind(this);
    }
    async deleteCart(req, res) {
        try {
            if (!req.params.cartItemId) {
                return res.ApiResponse.error(400, 'The cart ID is required');
            }
            const {success, cart, error } = await this.deleteCartService.deleteCart(req.user.userId, req.params.cartItemId, req.model);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(cart, 207, "Cart deleted ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async deleteCartMiddleware(req, res, next) {
        try {
            const {success, error } = await this.deleteCartService.deleteCart(req.cart.cartId, req.cartModels);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            next();
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}