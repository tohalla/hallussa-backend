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
    const data = path<RequestParams>(["rows", 0], Model.raw(`
      SELECT
        organisation.id as orgId, organisation.name as orgName,
        appliance.name as appName, appliance.description as appDescription,
        maintainer.email as email, maintainer.first_name as firstName, maintainer.last_name as lastName,
        maintenance_event.description as eventDescription, maintenance_event.created_at as createdAt
      FROM maintenance_task
        JOIN maintainer ON maintainer.id = maintenance_task.maintainer
        JOIN maintenance_event ON maintenance_event.id = maintenance_task.maintenance_event
        JOIN appliance ON appliance.id = maintenance_event.appliance
        JOIN organisation ON organisation.id = appliance.organisation
      WHERE hash=?::string`));

    if (data) {
      sendRepairRequestEmail(data);
    }
  }
}
