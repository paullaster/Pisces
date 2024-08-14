export class Assets {
    constructor(asset) {
        for (let prop in asset) {
            this[prop] = asset[prop];
        }
    }
}