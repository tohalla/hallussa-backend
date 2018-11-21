import Knex from "knex";

exports.seed = async (knex: Knex) => {
  await knex("appliance").del();
  await knex("appliance").insert([
    {
      description: "Washing machine of Haos. For students to wash their dirty clothes. Machines are disabled 23.00-05.00.",
      id: 1,
      // manufacturer: "Haos",
      // model: "wm1",
      name: "Washing Machine 1",
      organisation: 1,
    },
    {
      description: "Soda machine that serves soda drinks like coca-cola, sprite and novelle. Machine functions all the time.",
      id: 2,
      // manufacturer: "SodaDrinkers",
      // model: "vm1",
      name: "Vending Machine 1",
      organisation: 3,
    },
    {
      description: "Soda machine that serves light soda drinks like coca-cola light, sprite light and novelle light. Machine functions all the time.",
      id: 3,
      // manufacturer: "SodaDrinkers",
      // model: "vm2",
      name: "Vending Machine 2",
      organisation: 3,
    },
    {
      description: "Office printer that prints black and white or colored images. Printer is connected to offices' computers with Wi-Fi.",
      id: 4,
      // manufacturer: "InkPrint",
      // model: "ip1",
      name: "Printer Gulpin",
      organisation: 6,
    },
  ]);
  await knex.raw(
    "SELECT pg_catalog.setval(pg_get_serial_sequence('appliance', 'id'), (SELECT MAX(id) FROM appliance)+1);"
  );
};
