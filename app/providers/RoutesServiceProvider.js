import appRouter from "../../routes.js";
import express from "express";

const routeServiceProvider = express.Router();

routeServiceProvider.use("/api", appRouter);

export default routeServiceProvider;