import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.table("appliance", (table) => table.text("location"));

exports.down = (knex: Knex) =>
  knex.schema.table("appliance", (table) => table.dropColumn("location"));
