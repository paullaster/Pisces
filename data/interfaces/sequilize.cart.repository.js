import { Cart } from "../../core/types/cart.js";
import { CartRepository } from "../../core/app/cart.interface.js";
import Product from "../integrations/database/models/product.js";

export class SequilizeCartRepository extends CartRepository {
    constructor(CartModel, CartItemModel) {
        super();
        this.dataSource = CartModel;
        this.cartItemModel = CartItemModel;
        this.mapToCart = this.mapToCart.bind(this);
        this.getUserCart = this.getUserCart.bind(this);
        this.update = this.update.bind(this);
        this.updateCartShippingRate = this.updateCartShippingRate.bind(this);
    }
    async getUserCart(user, type = 'fetch', eagerLoad = false) {
        try {
            let cart;
            if (eagerLoad) {
                cart = await this.dataSource.findOne({
                    where: { userId: user },
                    include: [this.cartItemModel],
                });
            } else {
                cart = await this.dataSource.findOne({ where: { userId: user } });
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
            let getProduct = await Product.findByPk(cartObj.item.pid);
            model = model[0].model;
            getProduct = getProduct['dataValues'];
            const item = {
                itemId: cartObj.item.itemId,
                name: cartObj.item.name,
                price: getProduct.price,
                color: cartObj.item.color,
                size: cartObj.item.size,
                image: cartObj.item.image,
                discount: getProduct.discount,
                productPid: cartObj.item.pid,
                quantity: cartObj.item.quantity,
            }
            if (userCart) {
                const cartId = userCart['dataValues'].cartId;
                const itemExists = await model.findOne({ where: { productPid: item.productPid, cartId: cartId } });
                if (itemExists) {
                    itemExists.quantity += 1;
                    itemExists.price = getProduct.price;
                    itemExists.discount = getProduct.discount;
                    if (itemExists.discount) {
                        itemExists.price -= (itemExists.price * itemExists.discount) / 100;
                    }
                    itemExists.totalPrice = itemExists.price * itemExists.quantity;
                    await itemExists.save();
                    const items = await model.findAll({ where: { cartId: cartId } });
                    userCart['dataValues'].Items = items
                    return this.mapToCart(userCart);
                } else {
                    if (item.discount) {
                        item.price -= (item.price * item.discount) / 100;
                    }
                    item.totalPrice = item.price * item.quantity;
                    item.cartId = cartId;
                    await model.create(item);
                    const items = await model.findAll({ where: { cartId: cartId } });
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
                    item.totalPrice = item.price * item.quantity;
                    item.cartId = cart.dataValues.cartId;
                    await model.create(item);
                    const items = await model.findAll({ where: { cartId: cart.dataValues.cartId } });
                    cart['dataValues'].Items = items;
                    return this.mapToCart(cart);
                }
                return { success: false, error: 'Error' };
            }
        } catch (error) {
            console.log(error)
            return { error: error.message, success: false };
        }
    }
    async update(user, cartItem, payload, model = []) {
        try {
            const userCart = await this.getUserCart(user, model, '', false);
            if (!userCart) {
                return { success: false, error: "You do not have cart to update!" };
            }
            const item = await model[0].model.findByPk(cartItem);
            if (!item) {
                return { success: false, error: "Item not found!" };
            }
            switch (payload.quantity) {
                case -1:
                    if (item['dataValues'].quantity === 1) {
                        await this.delete(user, item['dataValues'].itemId, model);
                        return await this.getUserCart(user, model, 'fetch', true);
                    } else {
                        item.quantity = item['dataValues'].quantity - 1;
                        item.totalPrice = (item['dataValues'].price * item.quantity);
                        await item.save();
                    }
                    break;
                case 1:
                    item.quantity = item['dataValues'].quantity + 1;
                    item.totalPrice = (item['dataValues'].price * item.quantity);
                    await item.save();
                    break;
                default:
                    return { success: false, error: "Invalid Cart Item quantity!" };
            }
            return await this.getUserCart(user, model, 'fetch', true);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async updateCartShippingRate(user, obj) {
        try {
            const cart = await this.dataSource.findOne({ userId: user, status: 'New' });
            if (!cart) {
                return { success: false, error: "User do not have active cart to update!" };
            }
            cart.shippingRate = obj.shippingRate;
            await cart.save();
            return { success: true, data: cart };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }
    async delete(user, item, model) {
        try {
            const userCart = await this.getUserCart(user, model, '', false);
            if (!userCart) {
                return { success: false, error: "User do not have active cart to update!" };
            }
            const cartItems = await model[0].model.findAll({
                where: {
                    cartId: userCart['dataValues'].cartId,
                }
            });
            if (!cartItems || cartItems.length === 0) {
                const deletedCart = await this.dataSource.destroy({
                    where: {
                        cartId: userCart['dataValues'].cartId,
                    }
                });
                return { success: true, data: deletedCart };
            }
            if (cartItems.length === 1) {
                const sameItemInDeleteReq = cartItems[0].dataValues.itemId === item;
                if (sameItemInDeleteReq) {
                    await cartItems[0].destroy()
                    const deletedCart = await this.dataSource.destroy({
                        where: {
                            cartId: userCart['dataValues'].cartId,
                        }
                    });
                    return { success: true, data: deletedCart };
                } else {
                    return { success: false, error: 'Invalid item' };
                }
            } else {
                const itemToDelete = cartItems.find(it => it['dataValues'].itemId === item);
                if (!itemToDelete) {
                    return { success: false, error: "Item not found in cart!" };
                }
                await itemToDelete.destroy();
                return await this.getUserCart(user, model, 'fetch', true);
            }

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