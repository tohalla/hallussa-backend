require('dotenv').config({path: '../.env'});

const connection = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

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
