import { Router } from "express";
import { SetupController } from "../app/controllers/setups/setup.controller.js";
import { CountriesSetupService } from "../core/services/setups/country.setup.service.js";
import { CountryRespository } from "../data/interfaces/country.respository.js";

const setupsRouter = Router();

setupsRouter.get('/countries', new SetupController( new CountriesSetupService(new CountryRespository('https://restcountries.com/v3.1/all?fields=name,flag,cca2,cca3'))).getCountries)

export {setupsRouter}