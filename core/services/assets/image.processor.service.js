import Jimp from "jimp";
import app from "../../../config/app.js";
export class ImageProcessorService {
    constructor(image) {
        if (image.base64) {
            this.url = this.processImage(image);
        }
        this.processImage = this.processImage.bind(this);
    }
    async processImage(image) {
        try {
            const url = `/public/image/products/${image.pid}.${image.ext}`;
            const imageBuffer = Buffer.from(image.base64, 'base64');
            const img = await Jimp.read(imageBuffer);
            img.resize(256, 256).write(`.${url}`);
            return `${app.url}${url}`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}