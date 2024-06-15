import express from 'express';
const appRouter = express.Router();
import { userRoutes } from './routes/auth.routes.js';
import { prodcutRoutes } from './routes/product.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';

appRouter.use('/v1/auth', userRoutes);
appRouter.use('/v1/products', prodcutRoutes);
appRouter.use('/v1/categories', categoryRoutes);


export default appRouter;