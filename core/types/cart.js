export class Cart {
    constructor(cart) {
        for (let prop in cart) {
            this[prop] = cart[prop];
        }
    }
}