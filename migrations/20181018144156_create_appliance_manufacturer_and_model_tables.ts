import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("manufacturer", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .onDelete("CASCADE")
      .index();
    table.string("name", 64).notNullable();
  });
  await knex.schema.createTable("model", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table
      .integer("manufacturer")
      .references("manufacturer.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table.string("name", 64).notNullable();
  });
  await knex.schema.createTable("appliance", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.string("name", 64).notNullable();
    table
      .uuid("hash")
      .unique()
      .notNullable()
      .defaultTo(
        knex.raw("md5(random()::text || clock_timestamp()::text)::uuid")
      );
    table
      .integer("model")
      .references("model.id")
      .unsigned()
      .onDelete("SET NULL")
      .index();
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable("appliance");
  await knex.schema.dropTable("model");
  await knex.schema.dropTable("manufacturer");
};
