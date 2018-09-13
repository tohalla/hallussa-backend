require('dotenv').config({path: '../.env'});

const connection = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

console.log(process.env.POSTGRES_USER,)

const pool = {
  min: 2,
  max: 10,
};

const knex = {
  client: "postgres",
  connection,
  pool,
  migrations: {
    tableName: "migration",
    stub: "migrationTemplate.js"
  },
};

module.exports = {
  development: knex,
  staging: knex,
  production: knex,
  pg: {pool, connection},
  defaultSchema: "hallussa",
};
