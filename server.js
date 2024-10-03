import express from "express";
import cors from "cors";
import routeServiceProvider from "./app/providers/RoutesServiceProvider.js";
import { ApiResponder } from "./app/middleware/api.responder.js";
import path from "path";
import { fileURLToPath } from "url";
import "./app/events/listeners/send.customer.otp.js";
import "./app/events/index.js";
import "./data/integrations/database/associations.js";
import appConfig from "./config/app.js";
import expressIp from "express-ip";

const app = new express();


// Middlewares
app.use(express.json({ limit: '4096mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(ApiResponder);


// Static files middleware
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
app.use('/public', express.static(path.join(__dirname, 'public')));


// APP ROUTER PROVIDER
app.use('/pisces', routeServiceProvider);
app.use(expressIp().getIpInfoMiddleware)

// APP SETTINGS
app.set('name', 'noelsdeliveries app service');
app.set('version', appConfig.version);
app.set('description', appConfig.description);
app.set('author', appConfig.author);
app.set('url', appConfig.url);
app.set('license', appConfig.license);
app.set('key', appConfig.key);
process.NODE_ENV = appConfig.environment;
app.set('environment', process.NODE_ENV);
app.set('timezone', appConfig.timezone);
const port = process.env.APP_PORT || 3500;
app.set('PORT', port);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${app.get('PORT')}\n press Ctrl + C to stop \n Currently in ${app.get('environment')} mode \n Designed and Developed by ${app.get('author')}`)
});