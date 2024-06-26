import express from "express";
import cors from "cors";
import routeServiceProvider from "./app/providers/RoutesServiceProvider.js";
import { ApiResponder } from "./app/middleware/api.responder.js";
import path from "path";
import { fileURLToPath } from "url";

const app = new express();


// Middlewares


app.use(express.json({limit: '4096mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(ApiResponder);
app.use('/pisces', routeServiceProvider);

// Static files middleware
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
app.use('/public', express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  });