import Knex from "knex";

exports.up = (knex: Knex) => Promise.all(
  ["maintainer", "organisation", "account"].map((t) => knex.schema.table(t, (table) =>
    table.string("language", 5)
      .references("locale").inTable("language")
      .onDelete("SET NULL")
      .index()
  ))
);

exports.down = (knex: Knex) => Promise.all(
  ["maintainer", "organisation", "account"].map((t) => knex.schema.table(t, (table) =>
    table.dropColumn("language")
  ))
);
