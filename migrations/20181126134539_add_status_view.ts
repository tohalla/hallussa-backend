import Knex from "knex";

exports.up = (knex: Knex) => knex.raw(`
  CREATE VIEW appliance_status AS SELECT
    appliance.id appliance,
    CASE WHEN COUNT(maintenance_event.id) - COUNT(maintenance_event.resolved_at) > 0 THEN
      1 ELSE 0
    END is_malfunctioning,
    MAX(maintenance_event.created_at) previous_maintenance_event,
    COUNT(maintenance_event.id)::integer maintenance_event_count,
    avg(maintenance_event.resolved_at - maintenance_event.created_at) average_maintenance_time
  FROM appliance
    LEFT JOIN maintenance_event ON maintenance_event.appliance = appliance.id
  GROUP BY appliance.id
`);

exports.down = (knex: Knex) => knex.raw("DROP VIEW appliance_status");
