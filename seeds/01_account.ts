import Knex from "knex";
import { hashPassword } from "../src/account/Account";

exports.seed = async (knex: Knex) => {
  await knex("account").del();
  await knex("account").insert([
    {
      email: "test.user@hallussa.fi",
      firstName: "test",
      id: 1,
      lastName: "user",
      password: await hashPassword("test"),
    },
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('account', 'id'), (SELECT MAX(id) FROM account)+1);"
  );
};
