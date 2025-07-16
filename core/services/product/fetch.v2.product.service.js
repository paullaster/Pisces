import sanitizeHtml from 'sanitize-html';
import { prepareImageUrl } from '../../../common/prepare.image.url.js';

/**
 * A pure, decoupled helper function for calculating sale information.
 * This can be easily unit-tested in isolation.
 * @param {object} variant - The product variant.
 * @param {Array<object>} productDiscounts - The raw ProductDiscount join table objects.
 * @returns {{onSale: boolean, discountedPrice: number|null, discountIds: Array<string>}}
 */
function determineSaleInfo(variant, productDiscounts) {
    if (!productDiscounts || productDiscounts.length === 0) {
        return { onSale: false, discountedPrice: null, discountIds: [] };
    }

    const now = new Date();
    let discountedPrice = variant.price;
    const appliedDiscountIds = [];
    // Filter for active discounts applicable to the product
    const applicableDiscounts = productDiscounts
        .map(pd => pd.Discount) // Get the actual Discount object
        .filter(d => {
            if (!d || d.status !== 'Published') return false;
            const startDate = new Date(d.startPublishing);
            const endDate = new Date(d.endPublishing);
            return now >= startDate && now <= endDate;
        });

    if (applicableDiscounts.length === 0) {
        return { onSale: false, discountedPrice: null, discountIds: [] };
    }

    applicableDiscounts.sort((a, b) => {
        if (a.type === 'Fixed' && b.type !== 'Fixed') return -1;
        if (a.type !== 'Fixed' && b.type === 'Fixed') return 1;
        return 0;
    });

    for (const discount of applicableDiscounts) {
        const discountAmount = parseFloat(discount.amount);
        if (discount.type === 'Percentage') {
            discountedPrice -= discountedPrice * (discountAmount / 100);
        } else if (discount.type === 'Fixed') {
            discountedPrice -= discountAmount;
        }
        appliedDiscountIds.push(discount.id);
    }

    // Ensure price doesn't go below zero
    discountedPrice = Math.max(0, discountedPrice);

    return {
        onSale: true,
        discountedPrice: parseFloat(discountedPrice.toFixed(2)),
        discountIds: appliedDiscountIds,
    };
}


export class FetchV2ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Main execution method for the service.
     * Fetches raw product data and transforms it into the V2 API structure.
     * @param {object} query - The query parameters from the request (e.g., limit, offset).
     * @returns {Promise<{meta: object, data: Array, linked: object}>}
     */
    async execute(query) {
        const { count, rows: rawProducts } = await this.productRepository.fetchAllForV2(query);

        const linked = {
            categories: {},
            discounts: {},
            images: {},
            attributes: {},
        };
        const data = [];

        for (const rawProduct of rawProducts) {
            const sanitizedRecipeTips = sanitizeHtml(rawProduct.recipeTips || '', {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'video', 'source', 'section']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'title', 'scrolling'],
                    video: ['src', 'controls', 'width', 'height', 'autoplay', 'preload', 'poster'],
                    source: ['src', 'type'],
                    a: ['href', 'name', 'target'],
                },
                allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'www.tiktok.com', 'www.instagram.com', 'www.facebook.com']
            });

            for (const pc of rawProduct.ProductCategories || []) {
                const cat = pc.Category;
                if (cat && cat.categoryId && !linked.categories[cat.categoryId]) {
                    linked.categories[cat.categoryId] = { name: cat.name, description: cat.description };
                }
            }

            for (const pd of rawProduct.ProductDiscounts || []) {
                const disc = pd.Discount;
                if (disc && disc.discountId && !linked.discounts[disc.discountId]) {
                    linked.discounts[disc.discountId] = { title: disc.title, type: disc.type, description: disc.description };
                }
            }

            for (const img of rawProduct.Images || []) {
                if (img && img.imgId && !linked.images[img.imgId]) {
                    linked.images[img.imgId] = {
                        url: prepareImageUrl(img.imgId, img.mimetype),
                        altText: `Image of ${rawProduct.name}`
                    };
                }
            }

            const processedVariants = (rawProduct.ProductVariants || []).map(variant => {
                const simplifiedAttributes = (variant.VariantAttributes || []).map(va => {
                    console.log(va);
                    if (!va.AttributeValue || !va.AttributeValue.Attribute) return null;
                    const attr = va.AttributeValue.Attribute;
                    if (attr && attr.id && !linked.attributes[attr.id]) {
                        linked.attributes[attr.id] = { name: attr.name };
                    }
                    return {
                        attributeId: attr.id,
                        value: va.AttributeValue.value,
                    };
                }).filter(Boolean);

                return {
                    variantId: variant.variantId,
                    name: variant.name,
                    price: variant.price,
                    quantity: variant.quantity,
                    isAvailable: variant.quantity > 1,
                    attributes: simplifiedAttributes,
                    saleInfo: determineSaleInfo(variant, rawProduct.ProductDiscounts),
                };
            });

            data.push({
                productId: rawProduct.pid, // Corrected from productId to pid
                name: rawProduct.name,
                description: rawProduct.description,
                recipeTips: sanitizedRecipeTips,
                categoryIds: (rawProduct.ProductCategories || []).map(pc => pc.categoryId),
                imageIds: (rawProduct.Images || []).map(i => i.imgId),
                variants: processedVariants,
            });
        }

        const meta = {
            total: count,
            limit: parseInt(query.limit, 10) || count,
            offset: parseInt(query.offset, 10) || 0,
            timestamp: new Date().toISOString(),
        };

        return { meta, data, linked };
    }
}
