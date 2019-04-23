import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("user_role", (table) => {
    table.increments();
    table.string("name", 64).notNullable();
    table
      .integer("organisation")
      .references("organisation.id")
      .unsigned()
      .onDelete("CASCADE")
      .index();
    table.boolean("allow_create_appliance").defaultTo(false);
    table.boolean("allow_update_appliance").defaultTo(false);
    table.boolean("allow_delete_appliance").defaultTo(false);
    table.boolean("allow_create_maintainer").defaultTo(false);
    table.boolean("allow_update_maintainer").defaultTo(false);
    table.boolean("allow_delete_maintainer").defaultTo(false);
    table.boolean("allow_update_organisation").defaultTo(false);
    table.boolean("allow_delete_organisation").defaultTo(false);
    table.boolean("allow_manage_roles").defaultTo(false);
    table.boolean("allow_manage_maintenance_task").defaultTo(false);
    table.unique(["name", "organisation"]);
  });
  await knex.schema.table("organisation_account", (table) => {
    table
      .integer("user_role")
      .references("user_role.id")
      .unsigned()
      .notNullable()
      .onDelete("CASCADE")
      .index();
    table.dropColumn("is_admin");
  });
  await knex("user_role").insert([
    {
      name: "administrator",

      allowCreateAppliance: true,
      allowCreateMaintainer: true,
      allowDeleteAppliance: true,
      allowDeleteMaintainer: true,
      allowDeleteOrganisation: true,
      allowManageMaintenanceTask: true,
      allowManageRoles: true,
      allowUpdateAppliance: true,
      allowUpdateMaintainer: true,
      allowUpdateOrganisation: true,
    },
    {
      name: "moderator",

      allowCreateAppliance: true,
      allowCreateMaintainer: true,
      allowDeleteAppliance: true,
      allowDeleteMaintainer: true,
      allowManageMaintenanceTask: true,
      allowManageRoles: true,
      allowUpdateAppliance: true,
      allowUpdateMaintainer: true,
    },
    {
      allowManageMaintenanceTask: true,
      name: "maintainer",
    },
  ]);
};

exports.down = async (knex: Knex) => {
  await knex.schema.table("organisation_account", (table) => {
    table.dropColumn("user_role");
    table
      .boolean("is_admin")
      .notNullable()
      .defaultTo(false);
  });
  await knex.schema.dropTable("user_role");
};
