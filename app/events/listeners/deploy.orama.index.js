import { eventEmmitter } from "../index.js";
import orama from "../../../infrastructure/config/orama.js";
import { SearchController } from "../../controllers/search/search.controller.js";
import { SearchService } from "../../../core/services/search/search.service.js";
import { OramaCloud } from "../../../data/integrations/searchEngines/orama.cloud.js";

eventEmmitter.on("deployOramaIndex", async () => {
    console.log("deployOramaIndex emitted");
    const oramaCloud = new OramaCloud({ apiKey: orama.apiKey, indexId: orama.product_index_id });
    const searchService = new SearchService(oramaCloud);
    const searchController = new SearchController(searchService);
    const success = await searchController.insertSnapshot();
    console.log("Snapshot inserted successfully", success);

})