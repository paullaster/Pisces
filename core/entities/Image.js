export class Image {
    constructor(imageId, imagableId, imagableType, mimetype, createdAt = new Date()) {
        if (!imageId || !imagableId || !imagableType || !mimetype || !createdAt) {
            throw new Error('Invalid image');
        }
        this.imgId = imageId;
        this.imagableId = imagableId;
        this.imagableType = imagableType;
        this.mimetype = mimetype;
        this.createdAt = createdAt;
    }
    static createImageFromRawObject({ id, relatedId, type, ext }) {
        const newImage = new Image(id, relatedId, type, ext);
        return newImage;
    }
    static createImageFromModel(model) {
        const newImage = new Image(model.imgId, model.imagableId, model.imagableType, model.mimetype, model.createdAt);
        return newImage;
    }
}