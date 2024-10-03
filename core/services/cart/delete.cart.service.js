export class DeleteCartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.deleteCart = this.deleteCart.bind(this);
    }
    async deleteCart(user, cartItemId, model = []) {
        try {
            if (!cartItemId) {
                return { success: false, error: "Invalid cart item!" };
            }
            const { success, error, data:cart } = await this.cartRepository.delete(user, cartItemId, model);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}