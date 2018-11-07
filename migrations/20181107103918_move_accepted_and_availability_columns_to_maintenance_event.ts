import Knex from "knex";

exports.up = (knex: Knex) => Promise.all([
  knex.schema.table("maintenance_task", (table) =>
    table.dropColumns("is_accepted", "is_available")
  ),
  knex.schema.table("maintenance_event", (table) => {
    table
      .integer("assigned_to")
      .references("maintainer.id")
      .unsigned()
      .index();
  }),
]);

exports.down = (knex: Knex) => Promise.all([
  knex.schema.table("maintenance_task", (table) => {
    table
      .boolean("is_accepted")
      .notNullable()
      .defaultTo(false);
    table
      .boolean("is_available")
      .notNullable()
      .defaultTo(true);
  }),
  knex.schema.table("maintenance_event", (table) =>
    table.dropColumn("assigned_to")
  ),
]);
