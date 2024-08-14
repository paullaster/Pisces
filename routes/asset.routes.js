import express from 'express';
import { CreateAssetscontroller } from '../app/controllers/assets/create.assets.controller.js';
import { CreateAssetService } from '../core/services/assets/create.assets.service.js';
import { SequelizeAssetRepository } from '../data/interfaces/sequelize.assets.repository.js';
import Image from '../data/integrations/database/models/images.js';
import { file } from '../app/middleware/multer.js';


const assetRoutes = express.Router();

assetRoutes.post('/image', file.fields([{name: 'image'}, {name: 'ph'}]), new CreateAssetscontroller(new CreateAssetService(new SequelizeAssetRepository(Image))).createAsset);

export { assetRoutes};