import express from 'express';
import { CreateAssetscontroller } from '../app/controllers/assets/create.assets.controller.js';
import { CreateAssetService } from '../core/services/assets/create.assets.service.js';
import { SequelizeAssetRepository } from '../data/interfaces/sequelize.assets.repository.js';
import { models } from '../data/integrations/database/models/index.js';
import { file } from '../app/middleware/multer.js';

const { Image } = models;
const assetRoutes = express.Router();

assetRoutes.post('/image', file.fields([{ name: 'image' }, { name: 'ph' }]), new CreateAssetscontroller(new CreateAssetService(new SequelizeAssetRepository(Image))).createAsset);

export { assetRoutes };