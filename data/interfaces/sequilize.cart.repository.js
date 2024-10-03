import { Cart } from "../../core/types/cart.js";
import { CartRepository } from "../../core/app/cart.interface.js";
import Product from "../integrations/database/models/product.js";

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
                    where: { userEmail: user, cartCheckoutStatus: 'New' },
                    // include: associatedModel,
                });
                if (cart) {
                    const items = await associatedModel.findAll({ where: { cartCartId: cart['dataValues'].cartId } });
                    cart['dataValues'].Items = items;
                }
            } else {
                cart = await this.dataSource.findOne({ where: { userEmail: user, cartCheckoutStatus: 'New' } });
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
                const itemExists = await model.findOne({ where: { productPid: item.productPid, cartCartId: cartId } });
                if (itemExists) {
                    itemExists.quantity += 1;
                    itemExists.price = getProduct.price;
                    itemExists.discount = getProduct.discount;
                    if (itemExists.discount) {
                        itemExists.price -= (itemExists.price * itemExists.discount) / 100;
                    }
                    itemExists.totalPrice = itemExists.price * itemExists.quantity;
                    await itemExists.save();
                    const items = await model.findAll({ where: { cartCartId: cartId } });
                    userCart['dataValues'].Items = items
                    return this.mapToCart(userCart);
                } else {
                    if (item.discount) {
                        item.price -= (item.price * item.discount) / 100;
                    }
                    item.totalPrice = item.price * item.quantity;
                    item.cartCartId = cartId;
                    await model.create(item);
                    const items = await model.findAll({ where: { cartCartId: cartId } });
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
                    item.cartCartId = cart.dataValues.cartId;
                    await model.create(item);
                    const items = await model.findAll({ where: { cartCartId: cart.dataValues.cartId } });
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
            const item = await model.findByPk(cartItem);
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
    async delete(user, item, model) {
        try {
            const userCart = await this.getUserCart(user, model, '', false);
            if (!userCart) {
                return { success: false, error: "User do not have active cart to update!" };
            }
            const cartItems = await model.findAll({
                where: {
                    cartCartId: userCart['dataValues'].cartId,
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