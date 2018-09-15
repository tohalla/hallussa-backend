import { config } from "dotenv";
import { ConnectionConfig } from "Knex";

config({path: ".env"});

if (!(
  process.env.POSTGRES_DB &&
  process.env.POSTGRES_HOST &&
  process.env.POSTGRES_PASSWORD &&
  process.env.POSTGRES_USER
)) {
  throw new Error("define environment variables for psotgres");
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

export const development = knex;
export const production = knex;
