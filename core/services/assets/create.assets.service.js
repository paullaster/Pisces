import * as fs from 'fs'
import { randomID } from "../../../common/crypto.random.js";
import sharp from 'sharp';
import { removeBackgroundFromImageBase64 } from 'remove.bg';
import app from '../../../config/app.js';
export class CreateAssetService {
    constructor(AssetsRepository) {
        this.assetsRepository = AssetsRepository;
        this.handle = this.handle.bind(this);
    }
    async handle(files, body) {
        try {
            if (!files || !body) return { success: false, error: 'Invalid arguments' };

            for (const file in files) {
                for (const item of files[file]) {
                    const fileName = randomID();
                    const localFileName = `public/image/${fileName}`;
                    const result = await removeBackgroundFromImageBase64({
                        base64img: item.buffer.toString('base64'),
                        apiKey: app.removebg,
                        size: "auto",
                        type: "auto",
                        quality: 100,
                    });
                    const newImgBuffer = Buffer.from(result.base64img, 'base64');
                    const buffer = await sharp(newImgBuffer)
                        .resize({ width: 1920, height: 1920, fit: 'fill' })
                        .flatten({ background: { r: 255, g: 255, b: 255 } })
                        .webp({ lossless: true })
                        .toBuffer();
                    fs.writeFile(localFileName, buffer, async (err, dt) => {
                        if (err) return { success: false, error: err };
                        const { success, error } = await this.assetsRepository.create(
                            {
                                imgId: fileName,
                                imagableId: body.id,
                                imagableType: body.type,
                                mimetype: item.mimetype
                            }
                        )
                        if (!success) {
                            fs.unlink(localFileName, (err, dt) => {
                                if (err) console.error(err);
                                console.log(`Deleted file: ${localFileName}`);
                            })
                            console.log(error)
                            throw new Error("Could not insert into assets respository");
                        }
                    });
                }
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}