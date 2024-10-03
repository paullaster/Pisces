export class UpdateCartController {
    constructor(updateCartService) {
        this.updateCartService = updateCartService;
        this.updateCart = this.updateCart.bind(this);
    }
    async updateCart(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'You missed record to update');
            }
            const { success, cart, error } = await this.updateCartService.updateCart(req.user.userId, req.params.cartItemId, req.body, req.model);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(cart, 207, "Cart updated ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}