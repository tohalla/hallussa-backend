import Knex from "knex";
import path from "path";

import seedFile from "knex-seed-file";

export const seed = async (knex: Knex) => {
  await knex("language").del();

  const seedFileOptions = {
    columnSeparator: ";",
  };

  await seedFile(
    knex,
    path.resolve(__dirname, "translation", "language.csv"),
    "language",
    seedFileOptions
  );

  return Promise.all([
    ["translation", "en.csv"],
  ].map(([table, fileName]) => seedFile(
    knex,
    path.resolve(__dirname, "translation", fileName),
    table,
    seedFileOptions
  )));
};
