import express from "express";
import cors from "cors";
import routeServiceProvider from "./app/providers/RoutesServiceProvider.js";
import { ApiResponder } from "./app/middleware/api.responder.js";

const app = new express();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(ApiResponder);
app.use('/pisces', routeServiceProvider);


const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });