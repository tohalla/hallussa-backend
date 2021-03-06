import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.createTable("organisation_preferences", (table) => {
    table.integer("organisation")
      .references("organisation.id")
      .notNullable()
      .onDelete("CASCADE")
      .primary();
    table.boolean("qr_codes").notNullable().defaultTo(true);
    table.boolean("allow_resolving_events")
      .notNullable()
      .defaultTo(true);
  });

exports.down = (knex: Knex) => knex.schema.dropTable("organisation_preferences");
