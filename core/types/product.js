 export class Product {
    constructor(product) {
        for (let prop in product) {
            this[prop] = product[prop];
        }
    }
}