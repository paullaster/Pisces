import app from './app.js'
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
    },
    KCB: {
        baseUrl: process.env.KCB_BASE_URL,
        username: process.env.KCB_USERNAME,
        password: process.env.KCB_PASSWORD,
        secret: process.env.KCB_SECRET,
        paybillNo: process.env.KCB_PAYBILL_NUMBER,
        accountNo: process.env.KCB_ACCOUNT_NUMBER,
        transactionType: process.env.KCB_TRANSACTION_TYPE,
        notificationUrl: `${app.url}/pisces/api/v1/kcb/checkout/callback`
    }
}
export const getPaymentConfig = (provider) => payment[provider]