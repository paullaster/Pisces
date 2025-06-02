export class Product {
    discoutedPrice;
    constructor(productId, name, price, description, recipeTips, createdAt = new Date(), categories = [], variants = [], discounts = [], images = []) {
        if
            (!productId
        ) {
            throw new Error('Invalid product');
        }
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.recipeTips = recipeTips;
        this.createdAt = createdAt;
        this.categories = categories;
        this.images = images;
        this.variants = variants;
        this.discounts = discounts;
    }
    static createProuctFromORMModel(model) {

    }
    static createProductFromRawObject({ productId, name, price, description, recipeTips }) {
        return new Product(productId, name, price, description, recipeTips);
    }
    calculateDiscoutedPrice() {
        this.discoutedPrice = 0;
    }
    toPersistenceObject() {
        return {
            pid: this.productId,
            name: this.name,
            price: this.price,
            discountedPrice: this.discoutedPrice,
            description: this.description,
            recipeTips: this.recipeTips,
            createdAt: this.createdAt,
        }
    }
}