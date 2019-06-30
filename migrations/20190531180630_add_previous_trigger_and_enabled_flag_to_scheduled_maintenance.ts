import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.table("scheduled_maintenance", (table) => {
    table.boolean("enabled").defaultTo(true).notNullable();
    table.dateTime("previous_trigger");
  });

exports.down = (knex: Knex) =>
  knex.schema.table("scheduled_maintenance", (table) => {
    table.dropColumn("enabled");
    table.dropColumn("previous_trigger");
  });
