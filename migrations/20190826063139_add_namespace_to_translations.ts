import Knex from "knex";

exports.up = (knex: Knex) => knex.schema.table("translation", (table) => {
  table.string("namespace").notNullable().defaultTo("common");
  table.dropPrimary();
  table.primary(["key", "language", "namespace"]);
});

exports.down = (knex: Knex) => knex.schema.table("translation", (table) => {
  table.dropPrimary();
  table.primary(["key", "language"]);
  table.dropColumn("namespace");
});
