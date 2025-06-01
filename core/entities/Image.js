export class Iamge {
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
}