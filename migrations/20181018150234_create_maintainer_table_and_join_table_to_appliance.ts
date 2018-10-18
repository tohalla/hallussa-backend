import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("maintainer", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.string("first_name", 64).notNullable();
    table.string("last_name", 64).notNullable();
    table.string("email", 256).notNullable();
    table.string("phone", 18);
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
  });
  await knex.schema.createTable("appliance_maintainer", (table) => {
    table
      .integer("maintainer")
      .references("maintainer.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table
      .integer("appliance")
      .references("appliance.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable("appliance_maintainer");
  await knex.schema.dropTable("maintainer");
};
