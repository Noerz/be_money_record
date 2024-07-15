const Sequelize = require("sequelize")
require("dotenv").config();
const db_name = process.env.DATABASE_NAME;
const db_username=process.env.DATABASE_USERNAME;
const db_password=process.env.DATABASE_PASSWORD;
const db_host = process.env.HOST
const db_dialect=process.env.DATABASE_DIALECT;

const db = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    dialect: db_dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = db;