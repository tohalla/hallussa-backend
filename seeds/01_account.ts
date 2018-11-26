import Knex from "knex";
import { hashPassword } from "../src/account/Account";

exports.seed = async (knex: Knex) => {
  await knex("maintenance_task").del();
  await knex("maintenance_event").del();
  await knex("account").del();
  await knex("account").insert([
    {
      email: "test.user@hallussa.fi",
      firstName: "test",
      id: 1,
      lastName: "user",
      password: await hashPassword("test"),
    },
    {
      email: "maija.mustonen@hallussa.fi",
      firstName: "Maija",
      id: 2,
      lastName: "Mustonen",
      password: await hashPassword("maijamustonen"),
    },
    {
      email: "daniel.craig@hallussa.fi",
      firstName: "Daniel",
      id: 3,
      lastName: "Craig",
      password: await hashPassword("danielcraig"),
    },
    {
      email: "iida.hokkanen@hallussa.fi",
      firstName: "Iida",
      id: 4,
      lastName: "Hokkanen",
      password: await hashPassword("iidahokkanen"),
    },
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('account', 'id'), (SELECT MAX(id) FROM account)+1);"
  );
};
