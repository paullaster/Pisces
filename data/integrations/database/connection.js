import { Sequelize } from "sequelize";
import db from "../../../config/db.js";
const {database, username, password, ...options} = db;
const sequelize = new Sequelize(database, username, password, options);

try {
    await sequelize.authenticate() 
    console.log('database connection has been established successfully.');
} catch (error) {
    console.log("Unable to connect to the database ", error);
}

export  {sequelize};