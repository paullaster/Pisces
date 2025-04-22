import express from 'express';
import { CreateAssetscontroller } from '../app/controllers/assets/create.assets.controller.js';
import { CreateAssetService } from '../core/services/assets/create.assets.service.js';
import { SequelizeAssetRepository } from '../data/interfaces/sequelize.assets.repository.js';
import { models } from '../data/integrations/database/models/index.js';
import { file } from '../app/middleware/multer.js';
import { FileProcessor } from '../data/interfaces/file.processor.js';
import app from '../config/app.js';

const { Image } = models;
const assetRoutes = express.Router();

// Example instantiation (in a dependency injection container or factory)
const fileProcessor = new FileProcessor({ removeBgApiKey: String(app.removebg) });
const assetService = new CreateAssetService({
    assetsRepository: new SequelizeAssetRepository(Image),
    fileProcessor,
});

assetRoutes.post('/image', file.fields([{ name: 'image' }, { name: 'ph' }]), new CreateAssetscontroller(assetService).createAsset);

export { assetRoutes };