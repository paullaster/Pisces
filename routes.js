import express from 'express';
const appRouter = express.Router();
import { userRoutes } from './routes/auth.routes.js';
import { prodcutRoutes } from './routes/product.routes.js';

appRouter.use('/v1/auth', userRoutes);
appRouter.use('/v1/products', prodcutRoutes);

export default appRouter;