import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.table("maintenance_event", (table) =>
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .onDelete("CASCADE")
      .index()
  );

exports.down = (knex: Knex) =>
  knex.schema.table("maintenance_event", (table) => table.dropColumn("organisation"));
