import { Order } from "../../core/types/order.js";
import { OrderRepository } from "../../core/app/order.interface.js";

export class SequilizeOrderRepository extends OrderRepository {
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
    async create(order, model) {
        try {
            const { success, error } = await this.getOrderById(order.orderId, 'create');
            if (!success) {
                return { success: false, error };
            }
            const { items, ...rest} = order;
            // Create a new order
            const newOrder = await this.dataSource.create(rest);

            // Create associated items
            const createSuffix = `create${model}`;
            items.forEach(async(item) => {
                await newOrder[createSuffix](item);
            });

            return this.mapToCart(newOrder);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async update(order, payload) {
        try {
            const {data, success, error}  = await this.getOrderById(order, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const orderItem = await this.dataSource.findByPk(order);
            data['orderStatus'] = payload['orderStatus']
            const {items, ...rest } = data;
            const updatedCart = await orderItem.update(rest);
            return this.mapToOrder(updatedCart);
        }catch(error) {
            return { error: error.message, success: false };
        }
    }
    async delete(order, model) {
        try {
            const {data, success, error } = await this.getOrderById(order, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const deletedOrder = await this.dataSource.destroy({
                where: {
                    orderId: order,
                }
            });
            const removeSuffix = `remove${model}s`
            data[removeSuffix](data.items);
            return { success: true, data: deletedOrder };
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