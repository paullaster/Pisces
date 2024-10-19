import { Router } from "express";
import { SearchController } from "../app/controllers/search/search.controller.js";
import { SearchService } from "../core/services/search/search.service.js";
import { OramaCloud } from "../data/integrations/searchEngines/orama.cloud.js";
import orama from "../config/orama.js";

const useSearchRoute = Router();
const oramaCloud = new OramaCloud({endpoint: orama.endpoint, publicApiKey: orama.publicApiKey});
const searchService = new SearchService(oramaCloud);
const searchController = new SearchController(searchService);

// Search
useSearchRoute.get("/orama", searchController.search);

export default useSearchRoute;