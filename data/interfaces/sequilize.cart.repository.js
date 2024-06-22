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
    async getCartById(cartId, type = 'fetch', eagerLoad = false) {
        try {
            let cart;
            if (eagerLoad) {
                cart = await this.dataSource.findByPk(cartId, {
                    where: {
                        cartId
                    },
                    include: this.relatedModels,
                });
            }else {
                cart = await this.dataSource.findByPk(cartId);
            }
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
    async create(cart) {
        try {
            const { success, error } = await this.getCartById(cart.cartId, 'create');
            if (!success) {
                return { success: false, error };
            }
            const { items, ...rest} = cart;
            // Create a new cart
            const newCart = await this.dataSource.create(rest);

            // Create associated items
            items.forEach(async(item) => {
                await newCart.createItem(item);
            });

            return this.mapToCart(newCart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async update(cartItem, payload) {
        try {
            const {data, success, error}  = await this.getCartById(cartItem, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const cart = await this.dataSource.findByPk(cartItem);
            payload.items.forEach(item => {
                const itemToUpdate = data.items.findIndex(dataItem => dataItem.itemId === item.itemId);
                if (itemToUpdate!== -1) {
                    data.items[itemToUpdate] = item;
                }
            });
            const {items, ...rest } = data;
            const updatedCart = await cart.update(rest);
            await updatedCart.setItems(items);
            return this.mapToCart(updatedCart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async delete(item) {
        try {
            const {data, success, error } = await this.getCartById(item, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const deletedCart = await this.dataSource.destroy({
                where: {
                    cartId: item,
                }
            });
            data.removeItems(data.items);
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