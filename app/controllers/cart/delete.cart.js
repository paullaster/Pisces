export class DeleteCartController {
    constructor(deleteCartService) {
        this.deleteCartService = deleteCartService;
        this.deleteCart = this.deleteCart.bind(this);
    }
    async deleteCart(req, res) {
        try {
            if (!req.params.cartItemId) {
                return res.ApiResponse.error(400, 'The cart ID is required');
            }
            const {success, cart, error } = await this.deleteCartService.deleteCart(req.params.userId, req.params.cartItemId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(cart, 207, "Cart deleted ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}