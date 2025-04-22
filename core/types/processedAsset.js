export class ProcessedAsset {
    constructor({ imgId, imagableId, imagableType, mimetype, filePath }) {
        this.imgId = imgId;
        this.imagableId = imagableId;
        this.imagableType = imagableType;
        this.mimetype = mimetype;
        this.filePath = filePath;
    }
}