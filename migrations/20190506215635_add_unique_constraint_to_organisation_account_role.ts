import Knex from "knex";

exports.up = (knex: Knex) =>
  knex.schema.table("organisation_account", (table) => {
    table.unique(["account", "organisation"]);
  });

exports.down = (knex: Knex) =>
  knex.schema.table("organisation_account", (table) => {
    table.dropUnique(["account", "organisation"]);
  });
