export class Order {
    constructor(order) {
        for (let prop in order) {
            this[prop] = order[prop];
        }
    }
}