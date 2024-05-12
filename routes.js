import express from 'express';
const appRouter = express.Router();
import { userRoutes } from './routes/auth.routes.js';

appRouter.use('/v1/auth', userRoutes);

export default appRouter;