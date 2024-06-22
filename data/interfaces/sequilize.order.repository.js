import { Order } from "../../core/types/order.js";
import { CartRepository } from "../../core/app/cart.interface.js";

export class SequilizeOrderRepository extends CartRepository {
    constructor(OrderModel) {
        super();
        this.dataSource = OrderModel;
        this.mapToOrder = this.mapToOrder.bind(this);
        this.getOrderById = this.getOrderById.bind(this);
        this.update = this.update.bind(this);
    }
    async getOrderById(orderId,  associatedModel = [], type = 'fetch', eagerLoad = false) {
        try {
            let order;
            if (eagerLoad) {
                order = await this.dataSource.findByPk(orderId, {
                    include: associatedModel,
                });
            }else {
                order = await this.dataSource.findByPk(orderId);
            }
            if (type === 'create' && order) {
                return { error: 'Order already exist', success: false };
            }
            if (type === 'create' &&!order) {
                return { success: true };
            }
            if (type!== 'create' &&!order) {
                return { error: 'Order does not exist', success: false };
            }
            return this.mapToOrder(order);
        }catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(cart) {
        try {
            const { success, error } = await this.getOrderById(cart.cartId, 'create');
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
    async update(cartItem, payload) {
        try {
            const {data, success, error}  = await this.getOrderById(cartItem, 'fetch', true);
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
            return this.mapToOrder(updatedCart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async delete(item) {
        try {
            const {data, success, error } = await this.getOrderById(item, 'fetch', true);
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
    mapToOrder(order) {
        try {
            return { success: true, data: new Order(order['dataValues'])};
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}