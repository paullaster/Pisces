export class FetchCartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.fetchCart = this.fetchCart.bind(this);
        this.fetchUserCartItems = this.fetchUserCartItems.bind(this);
    }
    async fetchCart(userId) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            const { success, error, data:cart } = await this.cartRepository.fetch(userId);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async fetchUserCartItems(userId, query) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            const filters = {
                ...query,
            };
            if (!Object.keys(filters).length) {
                filters.itemCheckoutStatus = 'New';
            }
            const { success, error, data:cart } = await this.cartRepository.fetch(userId, filters);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
}