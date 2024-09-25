import { Cart } from "../../core/types/cart.js";
import { CartRepository } from "../../core/app/cart.interface.js";
import { where } from "sequelize";

export class SequilizeCartRepository extends CartRepository {
    constructor(CartModel) {
        super();
        this.dataSource = CartModel;
        this.mapToCart = this.mapToCart.bind(this);
        this.getUserCart = this.getUserCart.bind(this);
        this.update = this.update.bind(this);
    }
    async getUserCart(user, associatedModel = [], type = 'fetch', eagerLoad = false) {
        try {
            let cart;
            if (eagerLoad) {
                cart = await this.dataSource.findOne({
                    where: { userEmail: user },
                    // include: associatedModel,
                });
                const items = await associatedModel.findAll({ where: { cartCartId: cart['dataValues'].cartId }});
                cart['dataValues'].Items  = items;
            } else {
                cart = await this.dataSource.findOne({ where: { userEmail: user } });
            }
            if (type === 'fetch') {
                return this.mapToCart(cart);
            }
            return cart;
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async create(user, cartObj, model) {
        try {
            const userCart = await this.getUserCart(user, model, 'create', false);
            const newQuantity = 1;
            const item = {
                itemId: cartObj.item.itemId,
                name: cartObj.item.name,
                price: cartObj.item.price,
                color: cartObj.item.color,
                size: cartObj.item.size,
                image: cartObj.item.image,
                discount: cartObj.item.discount,
                productPid: cartObj.item.pid,
                quantity: newQuantity,
            }
            if (userCart) {
                const cartId = userCart['dataValues'].cartId;
                const itemExists = await model.findOne({where: {productPid: item.productPid, cartCartId: cartId}});
                if (itemExists) {
                    itemExists.dataValues.quantity += 1;
                    itemExists.dataValues.price = cartObj.item.price;
                    itemExists.dataValues.discount = cartObj.item.discount;
                    if (itemExists.dataValues.discount) {
                        itemExists.dataValues.price -= (itemExists.dataValues.price * itemExists.dataValues.discount) / 100;
                    }
                    itemExists.dataValues.totalPrice  = itemExists.dataValues.price * itemExists.dataValues.quantity;

                    await itemExists.save();
                    const items = await model.findAll({where: {cartCartId: cartId}});
                    userCart['dataValues'].Items = items
                    return this.mapToCart(userCart);
                } else {
                    if (item.discount) {
                        item.price -= (item.price * item.discount) / 100;
                    }
                    item.totalPrice  = item.price * item.quantity;
                    item.cartCartId = cartId;
                    await model.create(item);
                    const items = await model.findAll({where: {cartCartId: cartId}});
                    userCart['dataValues'].Items = items; 
                    return this.mapToCart(userCart);
                }
            } else {
                const cart = await this.dataSource.create({
                    userEmail: user,
                    cartId: cartObj.cartId,
                },
            );
                if (cart) {
                    if (item.discount) {
                        item.price -= (item.price * item.discount) / 100;
                    }
                    item.totalPrice  = item.price * item.quantity;
                    item.cartCartId = cart.dataValues.cartId;
                    await model.create(item);
                    const items = await model.findAll({where: {cartCartId: cart.dataValues.cartId}});
                    cart['dataValues'].Items = items;
                    return this.mapToCart(cart);
                }
                return {success: false, error: 'Error'};
            }
        } catch (error) {
            console.log(error)
            return { error: error.message, success: false };
        }
    }
    async update(cartItem, payload, model) {
        try {
            const { data, success, error } = await this.getUserCart(cartItem, model, 'fetch', true);
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
            const { success, error } = await this.getUserCart(id, model, 'fetch', true);
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
            cart = cart ? cart['dataValues'] : {}
            return { success: true, data: new Cart(cart) };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}