import { send } from "@sendgrid/mail";
import { Model, snakeCaseMappers } from "objection";
import { omit, path } from "ramda";

import { apiURL } from "../config";
import { sender } from "../email";
import { getTemplateIDByLanguage } from "../email/templates";

export default class MaintenanceTask extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

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
  public description?: string;
  public maintainer?: number;

  public async $beforeUpdate() {
    delete this.hash; // should not update hash field
    delete this.createdAt; // should not update createdAt field
    delete this.maintenanceEvent; // should not update maintenance event field
    delete this.maintainer; // should not update maintainer field

    this.updatedAt = new Date().toISOString();
  }

  public async $afterInsert() {
    const data = path<any>(["rows", 0], await Model.raw(`
      SELECT
        organisation.id as organisation_id, organisation.name as organisation_name,
        appliance.name as appliance_name, appliance.description as appliance_description,
        appliance.hash as appliance_hash,
        maintainer.email as email, maintainer.first_name as first_name, maintainer.last_name as last_name,
        COALESCE(maintainer.language, organisation.language) as language,
        maintenance_event.description as event_description, maintenance_event.created_at as created_at
      FROM maintenance_task
        JOIN maintainer ON maintainer.id = maintenance_task.maintainer
        JOIN maintenance_event ON maintenance_event.id = maintenance_task.maintenance_event
        JOIN appliance ON appliance.id = maintenance_event.appliance
        JOIN organisation ON organisation.id = appliance.organisation
      WHERE maintenance_task.hash=?::uuid`, this.hash as string)
    );

    if (typeof data === "object") {
      send({
        dynamicTemplateData: {
          ...omit(["language", "appliance_hash", "email"], data),
          ["maintenance_url"]: `${apiURL}/maintenance/${data.appliance_hash}/${this.hash}`,
        },
        from: sender.noReply,
        templateId: getTemplateIDByLanguage(data.language, "repairRequest"),
        to: data.email,
      });
    }
  }
}
