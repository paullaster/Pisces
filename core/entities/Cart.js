export class Cart {
    constructor(cartId, userId, items = [],) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = items;
    }
    addItem() { }
    removeItem() { }
    clearCart() { }
}