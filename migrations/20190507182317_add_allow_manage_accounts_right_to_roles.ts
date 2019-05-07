import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.table("user_role", (table) =>
    table.boolean("allow_manage_users").defaultTo(false)
  );
  return knex.raw(
    "UPDATE user_role SET allow_manage_users = TRUE WHERE name = 'administrator' AND organisation IS NULL"
  );
};

exports.down = (knex: Knex) =>
  knex.schema.table("user_role", (table) => table.dropColumn("allow_manage_users"));
