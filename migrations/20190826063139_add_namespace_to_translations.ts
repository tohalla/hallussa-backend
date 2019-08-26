import Knex from "knex";

exports.up = (knex: Knex) => knex.schema.table("translation", (table) =>
  table.string("namespace").notNullable().defaultTo("common")
);

exports.down = (knex: Knex) => knex.schema.table("translation", (table) => table.dropColumn("namespace"));
