import { config } from "dotenv";

config({path: ".env"});

const connection = {
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
};

const knex = {
  client: "postgres",
  connection,
  migrations: {
    stub: "migrationTemplate.ts",
    tableName: "migration",
  },
};

export const development = knex;
export const production = knex;
