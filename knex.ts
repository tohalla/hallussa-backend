import { config } from "dotenv";
import { ConnectionConfig } from "knex";
import { knexSnakeCaseMappers } from "objection";
import { assocPath } from "ramda";

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
  ...knexSnakeCaseMappers(), // map camelCase to snake_case. eg. firstName -> first_name
};

// migrations are currently not run from container on development
export const development = assocPath(["connection", "host"], "localhost", knex);

export const production = knex;
