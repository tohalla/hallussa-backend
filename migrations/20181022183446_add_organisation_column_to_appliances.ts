import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.table("appliance", (table) =>
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .onDelete("CASCADE")
      .index()
  );

exports.down = (knex: Knex) =>
  knex.schema.table("appliance", (table) => table.dropColumn("organisation"));
