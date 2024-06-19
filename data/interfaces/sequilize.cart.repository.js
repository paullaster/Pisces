export class SequilizeCartRepository extends CartRespository {
    constructor(CartModel) {
        super();
        this.dataSource = CartModel;
        this.mapToCart = this.mapToCart.bind(this);
    }
    async getCartById(cid, type = 'fetch') {
        try {
            const cart = await this.dataSource.findByPk(cid);
        }catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(cart) {
        try {
            const newCart = await this.dataSource.create(cart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async update(cart) {
        try {
            const updatedCart = await this.dataSource.update(cart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async delete(item) {
        try {
            const deletedCart = await this.dataSource.destroy({
                where: {
                    cartId: item,
                }
            });
        }catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToCart(cart) {
        try {
            
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}