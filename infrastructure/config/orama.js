export default {
    apiKey: process.env.ORAMA_PRIVATE_API_KEY,
    publicApiKey: process.env.ORAMA_PUBLIC_API_KEY,
    endpoint: process.env.ORAMA_ENDPOINT || 'http://localhost:3500',
    product_index_id:  process.env.ORAMA_INDEX_ID,
}