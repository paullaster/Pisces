export default {
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    description: process.env.APP_DESCRIPTION,
    author: process.env.APP_AUTHOR,
    url: process.env.APP_URL,
    license: process.env.APP_LICENSE,
    key: process.env.APP_KEY,
    environment: process.env.APP_ENV,
    timezone: process.env.APP_TIMEZONE || '+03:00',
    defaultCurrency: process.env.DEFUALT_CURRENCY,
    webUrl: process.env.WEB_URL,
    removebg: process.env.REMOVE_BG_API_KEY,
    pwdRounds: process.env.PWD_ROUNDS,
    cartUrl: `${process.env.APP_URL}${process.env.CART_URL}`,

};