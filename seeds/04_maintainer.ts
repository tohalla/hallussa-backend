import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("maintainer").del();
  await knex("maintainer").insert([
    {
      email: "main.tainer1@hallussa.fi",
      firstName: "main",
      id: 1,
      lastName: "tainer1",
      organisation: 1,
    },
    {
      email: "main.tainer2@hallussa.fi",
      firstName: "main",
      id: 2,
      lastName: "tainer2",
      organisation: 1,
    },
    {
      email: "main.tainer3@hallussa.fi",
      firstName: "main",
      id: 3,
      lastName: "tainer3",
      organisation: 1,
    },
    {
      email: "main.tainer4@hallussa.fi",
      firstName: "main",
      id: 4,
      lastName: "tainer4",
      organisation: 3,
    },
  ]);
  await knex("appliance_maintainer").insert([
    {maintainer: 1, appliance: 1},
    {maintainer: 2, appliance: 1},
    {maintainer: 3, appliance: 1},
    {maintainer: 3, appliance: 2},
    {maintainer: 1, appliance: 2},
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('maintainer', 'id'), (SELECT MAX(id) FROM maintainer)+1);"
  );
};
