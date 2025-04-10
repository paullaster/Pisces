import { Router } from "express";
import { MapController } from "../app/controllers/maps/maps.controller.js";
import { MapService } from "../core/services/map/map.service.js";
import { MapServiceProvider } from "../app/providers/mapServiceProvider.js";
import mapservice from "../config/mapservice.js";
import { validateUserToken } from "../app/middleware/validate.token.js";

const mapRoutes = Router();
const provider = mapservice.MAP_SERVICE
const mapProvider = new MapServiceProvider(provider, mapservice[provider]);
const mapService = new MapService(mapProvider);
const mapController = new MapController(mapService);


mapRoutes.post("/duration-distance-matrix", validateUserToken, mapController.durationDistanceMatrix);
mapRoutes.get("/reverse-geocode", validateUserToken, mapController.reverseGeocoding)

export { mapRoutes }