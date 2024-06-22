import express from "express";
import Cart from "../data/integrations/database/models/cart.js";
import Item from "../data/integrations/database/models/items.js";
import { SequilizeCartRepository } from "../data/interfaces/sequilize.cart.repository.js";
import { CreateCartController } from "../app/controllers/cart/create.cart.js";
import { CreateCartService } from "../core/services/cart/create.cart.service.js";
import { FetchCartController } from "../app/controllers/cart/fetch.cart.js";
import { FetchCartService } from "../core/services/cart/fetch.cart.service.js";
import { UpdateCartController } from "../app/controllers/cart/update.cart.js";
import { UpdateCartService } from "../core/services/cart/update.cart.service.js";
import { DeleteCartController } from "../app/controllers/cart/delete.cart.js";
import { DeleteCartService } from "../core/services/cart/delete.cart.service.js";


const cartRoutes = express.Router();
// CREATE CART ITEM
const cartRepository = new SequilizeCartRepository(Cart);
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
cartRoutes.get('/', fetchCartController.fetchCart);
cartRoutes.get('/:userId', fetchCartController.fetchUserCartItems);
cartRoutes.post('/', createCartController.createCart);
cartRoutes.put('/:cartItemId', updateCartController.updateCart);
cartRoutes.delete('/:cartItemId', deleteCartController.deleteCart);


export { cartRoutes };