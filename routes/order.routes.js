import express from 'express';
import { validateUserToken } from '../app/middleware/validate.token.js';
import { itemModelMiddleware } from '../app/middleware/pass.item.model.js';
import { eagerLoadUserOrdersAndRelated } from '../app/middleware/nest.user.order.items.js';
import { FetchOrderController } from '../app/controllers/orders/fetch.order.js';
import { FetchUserAssociationController } from '../app/controllers/users/fetch.user.associations.js';
import { FetchOrderService } from '../core/services/order/fetch.order.service.js';
import { FetchUserAssociationService } from '../core/services/user/fetch.user.association.service.js';
import { SequilizeOrderRepository } from '../data/interfaces/sequilize.order.repository.js';
import { SequelizeUserRespository } from '../data/interfaces/sequelize.user.repository.js';
import Order from '../data/integrations/database/models/order.js';
import User from '../data/integrations/database/models/users.js';

// Repository
const orderRepository = new SequilizeOrderRepository(Order);
const userRepository = new SequelizeUserRespository(User);

// Services
const fetchOrderService = new FetchOrderService(orderRepository);
const fetchUserAssociationService = new FetchUserAssociationService(userRepository);

// Controller
const fetchOrderController = new FetchOrderController(fetchOrderService);
const fetchUserAssociation = new FetchUserAssociationController(fetchUserAssociationService);

// Routes
const orderRoutes = express.Router();


orderRoutes.get('/', validateUserToken, itemModelMiddleware, fetchOrderController.fetchOrders);
orderRoutes.get('/:userId', validateUserToken, eagerLoadUserOrdersAndRelated, fetchUserAssociation.fetchUserAssociation);
orderRoutes.get('/:orderId', validateUserToken,);
orderRoutes.put('/:orderId', validateUserToken,);
orderRoutes.delete('/:orderId', validateUserToken,);

export { orderRoutes };