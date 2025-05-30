import app from './app'
const payment = {
    NCBA: {
        baseUrl: process.env.NCBA_BASE_URL,
        username: process.env.NCBA_USERNAME,
        password: process.env.NCBA_PASSWORD,
        secret: process.env.NCBA_SECRET,
        paybillNo: process.env.NCBA_PAYBILL_NUMBER,
        accountNo: process.env.NCBA_ACCOUNT_NUMBER,
        transactionType: process.env.NCBA_TRANSACTION_TYPE,
        notificationUrl: `${app.url}/pisces/api/v1/ncba/checkout/callback`
    }
}
export const getPaymentConfig = (provider) => payment[provider]