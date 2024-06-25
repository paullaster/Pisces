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
            } else {
                cart = await this.dataSource.findByPk(cartId);
            }
            if (type === 'create' && cart) {
                return { error: 'Cart already exist', success: false };
            }
            if (type === 'create' && !cart) {
                return { success: true };
            }
            if (type !== 'create' && !cart) {
                return { error: 'Cart does not exist', success: false };
            }
            return this.mapToCart(cart);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(cart, model) {
        try {
            const { success, error } = await this.getCartById(cart.cartId, [], 'create');
            if (!success) {
                return { success: false, error };
            }
            const userHasNewCart = await this.dataSource.findAndCountAll({
                where: {
                    userId: cart.userId,
                    cartCheckoutStatus: 'New',
                },
            });
            const { item, ...rest } = cart;
            if (userHasNewCart.count > 0) {
                const payload = {
                    item,
                }
                return await this.update(userHasNewCart.rows[0]['dataValues']['cartId'], payload, model);
            }
            // Create a new cart
            const newCart = await this.dataSource.create(rest);

            // Create associated items
            const createSuffix = `create${model.name}`;
            await newCart[createSuffix](item);

            return this.mapToCart(newCart);
        } catch (error) {
            console.log(error.message);
            await this.delete(cart.cartId);
            return { error: error.message, success: false };
        }
    }
    async update(cartItem, payload, model) {
        try {
            const { data, success, error } = await this.getCartById(cartItem, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const cart = await this.dataSource.findByPk(cartItem);
            const itemToUpdate = data.Items.findIndex(dataItem => dataItem['dataValues'].productId === payload.item.productId);
            if (itemToUpdate !== -1) {
                data.Items[itemToUpdate]['dataValues'].price = payload.item.price;
                data.Items[itemToUpdate]['dataValues'].quantity = payload.item.quantity;
                data.Items[itemToUpdate]['dataValues'].color = payload.item.color;
                data.Items[itemToUpdate]['dataValues'].size = payload.item.size;

            }
            const passedModel = await model.findByPk(data.Items[itemToUpdate]['dataValues'].itemId); 
            await passedModel.update(data.Items[itemToUpdate]['dataValues']);
            return this.mapToCart(cart);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(id, model) {
        try {
            const { data, success, error } = await this.getCartById(id, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const deletedCart = await this.dataSource.destroy({
                where: {
                    cartId: id,
                }
            });
            return { success: true, data: deletedCart };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    mapToCart(cart) {
        try {
            return { success: true, data: new Cart(cart['dataValues']) };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}