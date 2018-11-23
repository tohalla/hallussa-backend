import { Model } from "objection";
import { path } from "ramda";

import { RequestParams, sendRepairRequestEmail } from "../emails/request";

export default class MaintenanceTask extends Model {
  public static tableName = "maintenance_task";

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      maintainer: {type: "integer"},
      maintenanceEvent: {type: "integer"},
    },
    required: ["maintenanceEvent", "maintainer"],
  };

  public updatedAt?: string;
  public createdAt?: string;
  public hash?: string;
  public maintenanceEvent?: number;
  public maintainer?: number;

  public async $beforeUpdate() {
    delete this.hash; // should not update hash field
    delete this.createdAt; // should not update createdAt field
    delete this.maintenanceEvent; // should not update maintenance event field
    delete this.maintainer; // should not update maintainer field

    this.updatedAt = new Date().toISOString();
  }

  public async $afterInsert() {
    const data = path<RequestParams>(["rows", 0], await Model.raw(`
      SELECT
        organisation.id as org_id, organisation.name as org_name,
        appliance.name as app_name, appliance.description as app_description, appliance.hash as app_hash,
        maintainer.email as email, maintainer.first_name as first_name, maintainer.last_name as last_name,
        maintenance_event.description as event_description, maintenance_event.created_at as created_at
      FROM maintenance_task
        JOIN maintainer ON maintainer.id = maintenance_task.maintainer
        JOIN maintenance_event ON maintenance_event.id = maintenance_task.maintenance_event
        JOIN appliance ON appliance.id = maintenance_event.appliance
        JOIN organisation ON organisation.id = appliance.organisation
      WHERE maintenance_task.hash=?::uuid`, this.hash as string));

    if (data) {
      sendRepairRequestEmail({
        ...data,
        ["task_hash"]: this.hash as string,
      });
    }
  }
}
