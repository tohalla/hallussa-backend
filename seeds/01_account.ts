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
      password: hashPassword("test"),
    },
  ]);
};
