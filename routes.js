import express from 'express';
const appRouter = express.Router();
import { authRoutes } from './routes/auth.routes.js';
import { prodcutRoutes } from './routes/product.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { checkoutRoutes } from './routes/checkout.routes.js';
import { orderRoutes } from './routes/order.routes.js';
import { assetRoutes } from './routes/asset.routes.js';
import { setupsRouter } from './routes/setup.routes.js';
import { userRoutes } from './routes/user.routes.js';

appRouter.use('/v1/auth', authRoutes);
appRouter.use('/v1/categories', categoryRoutes);
appRouter.use('/v1/products', prodcutRoutes);
appRouter.use('/v1/cart', cartRoutes);
appRouter.use('/v1/checkout', checkoutRoutes);
appRouter.use('/v1/orders', orderRoutes);
appRouter.use('/v1/assets', assetRoutes);
appRouter.use('/v1/setups', setupsRouter);
appRouter.use('/v1/user', userRoutes);

export default appRouter;