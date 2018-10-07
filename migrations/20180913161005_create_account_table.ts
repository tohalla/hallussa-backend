import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.createTable("account", (table) => {
    table.increments();
    table.timestamp("created_at").notNullable().defaultTo("now()");
    table.timestamp("updated_at");
    table.string("email", 255).unique().notNullable();
    table.string("first_name", 64).notNullable();
    table.string("last_name", 64).notNullable();
    table.text("password").notNullable();
  });

exports.down = (knex: Knex) =>
  knex.schema.dropTable("account");
