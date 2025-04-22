import app from '../../../config/app.js';
import { FileProcessor } from '../../../data/interfaces/file.processor.js';
import { SequelizeAssetRepository } from '../../../data/interfaces/sequelize.assets.repository.js';


export class CreateAssetService {
    /**
     * @param {Object} dependencies
     * @param {SequelizeAssetRepository} dependencies.assetsRepository
     * @param {FileProcessor} dependencies.fileProcessor
     */
    constructor({ assetsRepository, fileProcessor }) {
        this.assetsRepository = assetsRepository;
        this.fileProcessor = fileProcessor;
        this.handle = this.handle.bind(this);
    }

    /**
     * @param {Object} files - File uploads
     * @param {Object} body - Metadata
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async handle(files, body) {
        if (!files || !body) {
            return { success: false, error: 'Invalid arguments' };
        }

        try {
            const processingResults = await this.processFiles(files, body);

            const hasErrors = processingResults.some((result) => !result.success);
            if (hasErrors) {
                const error = processingResults.find((result) => result.error)?.error || 'One or more files failed to process';
                return { success: false, error };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 
     * @param {*} files 
     * @param {*} body 
     * @returns 
     */
    async processFiles(files, body) {
        const tasks = [];

        for (const fileKey in files) {
            for (const file of files[fileKey]) {
                tasks.push(this.processSingleFile(file, body));
            }
        }

        // Limit concurrency to prevent resource exhaustion
        const BATCH_SIZE = 5;
        const results = [];
        for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
            const batch = tasks.slice(i, i + BATCH_SIZE);
            results.push(...(await Promise.all(batch)));
        }

        return results;
    }

    /**
     * 
     * @param {*} file 
     * @param {*} body 
     * @returns 
     */
    async processSingleFile(file, body) {
        let processedAsset;

        try {
            // Process file and create asset
            processedAsset = await this.fileProcessor.processFile(file, body);
            const { success, error } = await this.assetsRepository.create({
                imgId: processedAsset.imgId,
                imagableId: processedAsset.imagableId,
                imagableType: processedAsset.imagableType,
                mimetype: processedAsset.mimetype,
            });

            if (!success) {
                await this.fileProcessor.cleanup(processedAsset.filePath);
                return { success: false, error: error || 'Failed to save asset' };
            }

            return { success: true };
        } catch (error) {
            if (processedAsset?.filePath) {
                await this.fileProcessor.cleanup(processedAsset.filePath);
            }
            return { success: false, error: error.message };
        }
    }
}