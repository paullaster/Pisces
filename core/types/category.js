export class Category {
    constructor(category) {
        for (let prop in category) {
            this[prop] = category[prop];
        }
    }
}