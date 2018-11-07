import Knex from "knex";

exports.up = (knex: Knex) => knex.schema.table("maintenance_event", (table) =>
  table.dateTime("resolved_at")
);

exports.down = (knex: Knex) => knex.schema.table("maintenance_event", (table) =>
  table.dropColumn("resolved_at")
);
