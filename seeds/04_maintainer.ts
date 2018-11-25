import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("maintainer").del();
  await knex("maintainer").insert([
    {
      email: "markku.alen@hallussa.fi",
      firstName: "Markku",
      id: 1,
      lastName: "Alen",
      organisation: 6,
    },
    {
      email: "nikke.nakuttaja@hallussa.fi",
      firstName: "Nikke",
      id: 2,
      lastName: "Nakuttaja",
      organisation: 5,
    },
    {
      email: "aku.hirvinen@hallussa.fi",
      firstName: "Aku",
      id: 3,
      lastName: "Hirvonen",
      organisation: 5,
    },
    {
      email: "peter.parker@hallussa.fi",
      firstName: "Peter",
      id: 4,
      lastName: "Parker",
      organisation: 3,
    },
    {
      email: "juho.i.jokela@gmail.com",
      firstName: "Juho",
      id: 5,
      lastName: "Jokela",
      organisation: 3,
    },
  ]);
  await knex("appliance_maintainer").insert([
    {maintainer: 1, appliance: 4},
    {maintainer: 2, appliance: 2},
    {maintainer: 2, appliance: 3},
    {maintainer: 3, appliance: 2},
    {maintainer: 3, appliance: 3},
    {maintainer: 5, appliance: 2},
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('maintainer', 'id'), (SELECT MAX(id) FROM maintainer)+1);"
  );
};
