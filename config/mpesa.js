import app from "./app.js"

export default {
    express_api_url: process.env.MPESA_EXPRESS_API_URL,
    authorization_url: process.env.MPESA_AUTHORIZATION_URL,
    consumer_key: process.env.MPESA_CONSUMER_KEY,
    consumer_secret: process.env.MPESA_CONSUMER_SECRET,
    business_shortcode: process.env.MPESA_BUSSINESS_SHORTCODE,
    mpesa_passkey: process.env.MPESA_PASSKEY,
    mpesa_callback: `${app.url}/pay/callback`,
    transactiontype: process.env.MPESA_TRANSACTIONTYPE
}