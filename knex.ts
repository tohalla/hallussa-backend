import { config } from "dotenv";
import { ConnectionConfig } from "knex";
import path from "path";
import { assocPath } from "ramda";

config({path: path.resolve(__dirname, ".env")});

if (!(
  process.env.POSTGRES_DB &&
  process.env.POSTGRES_HOST &&
  process.env.POSTGRES_PASSWORD &&
  process.env.POSTGRES_USER
)) {
  throw new Error("Define environment variables for postgres. Make sure to run migrations using compiled knex file.");
}
const connection: ConnectionConfig = {
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
};

export const knex = {
  client: "postgres",
  connection,
  migrations: {
    stub: "migrationTemplate.ts",
    tableName: "migration",
  },
};

// migrations are currently not run from container on development
export const development = assocPath(["connection", "host"], "localhost", knex);

export const production = knex;
