import * as fs from 'fs/promises';
import { randomID } from '../../common/crypto.random.js';
import sharp from 'sharp';
import { removeBackgroundFromImageBase64 } from 'remove.bg';
import { AssetProcessingError } from '../../core/types/assetProcessingErrors.js';
import { ProcessedAsset } from '../../core/types/processedAsset.js';

// File processor interface
export class FileProcessor {
    constructor({ removeBgApiKey, outputDir = 'public/image', maxDimensions = { width: 1920, height: 1920 } }) {
        this.removeBgApiKey = removeBgApiKey;
        this.outputDir = outputDir;
        this.maxDimensions = maxDimensions;
    }

    /**
     * 
     * @param {*} file 
     * @param {*} metadata 
     * @returns 
     */
    async processFile(file, metadata) {
        const imgId = randomID();
        const filePath = `${this.outputDir}/${imgId}`;

        try {
            // Remove background
            const { base64img } = await removeBackgroundFromImageBase64({
                base64img: file.buffer.toString('base64'),
                apiKey: this.removeBgApiKey,
                size: 'auto',
                type: 'auto',
            });
            // Process image
            const buffer = await sharp(Buffer.from(base64img, 'base64'))
                .resize({ ...this.maxDimensions, fit: 'fill' })
                .flatten({ background: { r: 255, g: 255, b: 255 } })
                .webp({ lossless: true })
                .toBuffer();

            // Write file
            await fs.writeFile(filePath, buffer);

            return new ProcessedAsset({
                imgId,
                filePath,
                mimetype: file.mimetype,
                imagableId: metadata.id,
                imagableType: metadata.type,
            });
        } catch (error) {
            throw new AssetProcessingError('Failed to process file', error);
        }
    }

    /**
     * 
     * @param {*} filePath 
     */
    async cleanup(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn(`Failed to delete file ${filePath}:`, error);
        }
    }
}