import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.schema.createTable("language", (table) => {
    table.string("locale", 5).primary();
    table.string("name", 128).notNullable();
    table.string("language_code", 3).comment("ISO 639-2 Code");
    table.string("language_short_code", 2).comment("ISO 639-1 Code");
  });
  await knex.schema.createTable("translation", (table) => {
    table.text("key").notNullable().comment("Translation key");
    table.text("translation").comment("Translation");
    table
      .string("language", 5)
      .references("locale").inTable("translation.language")
      .index();
    table.primary(["key", "language"]);
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable("translation");
  await knex.schema.dropTable("language");
};
