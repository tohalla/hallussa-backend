import Knex from "knex";

exports.up = async (knex: Knex) => {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_organisation_preferences() RETURNS TRIGGER AS
    $$
    BEGIN
      INSERT INTO organisation_preferences (organisation) VALUES (NEW.id);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql VOLATILE
  `);
  return knex.raw(`
    CREATE TRIGGER organisation_ait AFTER INSERT ON organisation
    FOR EACH ROW EXECUTE FUNCTION create_organisation_preferences()
  `);
};

exports.down = async (knex: Knex) => {
  await knex.raw("DROP TRIGGER organisation_ait ON organisation");
  return knex.raw("DROP FUNCTION create_organisation_preferences()");
};
