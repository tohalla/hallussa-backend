import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.renameTable("scheduled_maintenance", "repetitive_maintenance");
  await knex.schema.raw(
    "ALTER INDEX scheduled_maintenance_appliance_index RENAME TO repetitive_maintenance_appliance_index"
  );
  return knex.schema.createTable("scheduled_maintenance", (table) => {
    table.increments();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo("now()");
    table.timestamp("updated_at");
    table.timestamp("trigger_at").notNullable();
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
  await knex.schema.raw(
    "ALTER INDEX repetitive_maintenance_appliance_index RENAME TO scheduled_maintenance_appliance_index"
  );
  return knex.schema.renameTable("repetitive_maintenance", "scheduled_maintenance");
};
