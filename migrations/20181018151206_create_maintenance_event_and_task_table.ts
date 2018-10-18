import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("maintenance_event", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.text("description");
    table
      .integer("appliance")
      .references("appliance.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
  });
  await knex.schema.createTable("maintenance_task", (table) => {
    table
      .uuid("hash")
      .primary()
      .defaultTo(
        knex.raw("md5(random()::text || clock_timestamp()::text)::uuid")
      );
    table.timestamp("updated_at");
    table
      .integer("maintainer")
      .references("maintainer.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table
      .integer("maintenance_event")
      .references("maintenance_event.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table
      .boolean("is_accepted")
      .notNullable()
      .defaultTo(false);
    table
      .boolean("is_available")
      .notNullable()
      .defaultTo(true);
    table.text("description");
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable("maintenance_task");
  await knex.schema.dropTable("maintenance_event");
};
