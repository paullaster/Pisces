export class Product {
    constructor(productId, name, price, discoutedPrice, description, recipeTips, createdAt = new Date(), images = [], variants = [], categories = [], discounts = []) {
        if
            (!productId ||
            !name ||
            typeof price !== 'number' ||
            price < 0 ||
            typeof discoutedPrice !== 'number' ||
            !description ||
            !createdAt ||
            !images ||
            !images.length ||
            !variants ||
            !variants.length ||
            !categories ||
            !categories.length
        ) {
            throw new Error('Invalid product');
        }
        this.pid = productId;
        this.name = name;
        this.price = price;
        this.discountedPrice = discoutedPrice;
        this.description = description;
        this.recipeTips = recipeTips;
        this.createdAt = createdAt;
        this.images = images;
        this.variants = variants;
        this.categories = categories;
        this.discounts = discounts;
    }
}