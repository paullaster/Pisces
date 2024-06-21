import { Cart } from "../../core/types/cart.js";
import { CartRepository } from "../../core/app/cart.interface.js";

export class SequilizeCartRepository extends CartRepository {
    constructor(CartModel, relatedModels = []) {
        super();
        this.dataSource = CartModel;
        this.relatedModels = relatedModels;
        this.mapToCart = this.mapToCart.bind(this);
        this.getCartById = this.getCartById.bind(this);
    }
    async getCartById(cartId, type = 'fetch') {
        try {
            const cart = await this.dataSource.findOne({
                where: {
                    cartId
                },
                include: this.relatedModels,
            });
            if (type === 'create' && cart) {
                return { error: 'Cart already exist', success: false };
            }
            if (type === 'create' &&!cart) {
                return { success: true };
            }
            if (type!== 'create' &&!cart) {
                return { error: 'Cart does not exist', success: false };
            }
            return this.mapToCart(cart);
        }catch (error) {
            return { error: error.message, success: false };
        }
    }
    async getUserCartItems(user) {
        try {
            const userCart = await this.dataSource.findAll({
                where: {
                    userId: user,
                    status: 'New',
                }
            });
            if (!userCart) {
                return { success: false, error: 'Cart does not exist' };
            }
            return this.mapToCart(userCart);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(cartItem) {
        try {
            const { success, error } = await this.getCartById(cartItem, 'create');
            if (!success) {
                return { success: false, error };
            }
            const newCart = await this.dataSource.create(cartItem);
            return this.mapToCart(newCart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async update(cartItem, payload) {
        try {
            const { success, error}  = await this.getCartById(cartItem);
            if (!success) {
                return { success: false, error };
            }
            const data = {};
            for (const key in data) {
                if (payload[key]) {
                    data[key] = payload[key];
                }
            }
            const cart = await this.dataSource.findByPk(cartItem);
            const updatedCart = await cart.update(data);
            if (!updatedCart) {
                return { success: false, error: 'Can not find this cart' };
            }
            return this.mapToCart(updatedCart);
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
            return { success: true, data: deletedCart };
        }catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToCart(cart) {
        try {
            return { success: true, data: new Cart(cart['dataValues'])};
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}