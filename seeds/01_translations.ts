import Knex from "knex";
import path from "path";

import seedFile from "knex-seed-file";

export const seed = async (knex: Knex) => {
  await knex("language").del();
  return seedFile(
    knex,
    path.resolve(__dirname, "translation", "language.csv"),
    "language",
    {
      columnSeparator: ";",
      handleInsert: (inserts: any, tableName: string) => knex.raw(
        knex(tableName).insert(inserts).toString().replace("?", "\\?") +
        " ON CONFLICT DO NOTHING"
      ),
    }
  );
};
