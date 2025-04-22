export class Assets {
    /**
     * 
     * @param {*} asset 
     */
    constructor(asset) {
        for (let prop in asset) {
            this[prop] = asset[prop];
        }
    }
}