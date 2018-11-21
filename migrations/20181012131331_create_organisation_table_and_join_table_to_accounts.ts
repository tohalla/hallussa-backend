import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("organisation", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.string("name", 64).notNullable();
    table.string("organisation_identifier", 64);
  });
  await knex.schema.createTable("organisation_account", (table) => {
    table
      .integer("account")
      .references("account.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table
      .boolean("is_admin")
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable("organisation_account");
  await knex.schema.dropTable("organisation");
};
