import { Cart } from "../../core/types/cart.js";
import { CartRepository } from "../../core/app/cart.interface.js";

export class SequilizeCartRepository extends CartRepository {
    constructor(CartModel) {
        super();
        this.dataSource = CartModel;
        this.mapToCart = this.mapToCart.bind(this);
        this.getCartById = this.getCartById.bind(this);
        this.update = this.update.bind(this);
    }
    async getCartById(cartId, associatedModel = [], type = 'fetch', eagerLoad = false) {
        try {
            let cart;
            if (eagerLoad) {
                cart = await this.dataSource.findByPk(cartId, {
                    include: associatedModel,
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
    async create(cart) {
        try {
            const { success, error } = await this.getCartById(cart.cartId, 'create');
            if (!success) {
                return { success: false, error };
            }
            const  userHasNewCart = await this.dataSource.findAndCountAll({
                where: {
                    userId: cart.userId,
                    cartCheckoutStatus: 'New',
                },
            });
            const { items, ...rest} = cart;
            if (userHasNewCart.count > 0) {
                const payload = {
                    items,
                }
                return await this.update(userHasNewCart.rows[0]['dataValues']['cartId'], payload);
            }
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
    async update(cartItem, payload, model) {
        try {
            const {data, success, error}  = await this.getCartById(cartItem, model, 'fetch', true);
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
            const createSuffix = `set${model}s`;
            await cart[createSuffix](data.items);
            return this.mapToCart(cart);
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