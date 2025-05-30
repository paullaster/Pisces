const { default: app } = require("./app");

module.exports = {
    "development": {
        dialect: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: app.timezone,
        dialectOptions: {
            timezone: app.timezone,
        }
    },
    "test": {
        dialect: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: app.timezone,
        dialectOptions: {
            timezone: app.timezone,
        }
    },
    "production": {
        dialect: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timezone: app.timezone,
        dialectOptions: {
            timezone: app.timezone,
        }
    }
}
