import express from "express";
import { SequilizeCartRepository } from "../data/interfaces/sequilize.cart.repository.js";
import { CreateCartController } from "../app/controllers/cart/create.cart.js";
import { CreateCartService } from "../core/services/cart/create.cart.service.js";
import { FetchCartController } from "../app/controllers/cart/fetch.cart.js";
import { FetchCartService } from "../core/services/cart/fetch.cart.service.js";
import { UpdateCartController } from "../app/controllers/cart/update.cart.js";
import { UpdateCartService } from "../core/services/cart/update.cart.service.js";
import { DeleteCartController } from "../app/controllers/cart/delete.cart.js";
import { DeleteCartService } from "../core/services/cart/delete.cart.service.js";
import { validateUserToken } from "../app/middleware/validate.token.js";
import { models } from "../data/integrations/database/models/index.js";

const { Cart, CartItem } = models;

const cartRoutes = express.Router();
// CREATE CART ITEM
const cartRepository = new SequilizeCartRepository(Cart, CartItem);
const createCartService = new CreateCartService(cartRepository);
const createCartController = new CreateCartController(createCartService);

// FETCH CART ITEM
const fetchCartService = new FetchCartService(cartRepository);
const fetchCartController = new FetchCartController(fetchCartService);

// UPDATE CART ITEM
const updateCartService = new UpdateCartService(cartRepository);
const updateCartController = new UpdateCartController(updateCartService);

// DELETE CART ITEM
const deleteCartService = new DeleteCartService(cartRepository);
const deleteCartController = new DeleteCartController(deleteCartService);


// ROUTES   --------------------------------
cartRoutes.get('/', validateUserToken, fetchCartController.fetchCart);
cartRoutes.post('/', validateUserToken, createCartController.createCart);
cartRoutes.patch('/:cartItemId', validateUserToken, updateCartController.updateCart);
cartRoutes.delete('/:cartItemId', validateUserToken, deleteCartController.deleteCart);


export { cartRoutes };