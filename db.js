require('dotenv').config()
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,DATABASE_URL } = process.env

const knex = require('knex')({
  client: 'postgres',
  connection: DATABASE_URL ? DATABASE_URL : {
    host : DB_HOST,
    port : DB_PORT,
    user : DB_USER,
    password : DB_PASSWORD,
    database : DB_NAME
  }
});

module.exports = knex