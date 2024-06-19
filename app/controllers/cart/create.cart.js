export class CreateCartController {
    constructor(createCartService) {
        this.createCartService = createCartService;
        this.createCart = this.createCart.bind(this);
    }
    async createCart(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing item body');
            }
            const { success, cart, error } = await this.createCartService.createCart(req.params.userId, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(cart, 201, "Cart created");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}