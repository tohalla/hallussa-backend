import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("scheduled_maintenance", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.specificType("interval", "smallint")
      .notNullable()
      .unsigned()
      .index();
    table.text("description");
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
  await knex.schema.dropTable("scheduled_maintenance");
};
