require('dotenv').config({path: '../.env'});

const connection = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

const knex = {
  client: "postgres",
  connection,
  pool,
  migrations: {
    tableName: "migration",
    stub: "migrations/migrationTemplate.js"
  },
};

module.exports = {
  development: knex,
  staging: knex,
  production: knex,
  defaultSchema: "hallussa",
};
