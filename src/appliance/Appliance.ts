import { Model } from "objection";
import Organisation from "../organisation/Organisation";

export default class Appliance extends Model {
  public static tableName = "appliance";

  public static relationMappings = {
    organisation: {
      join: {
        from: "appliance.organisation",
        to: "organisation.id",
      },
      modelClass: Organisation,
      relation: Model.BelongsToOneRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "integer" },
      name: { type: "string", minLength: 1, maxLength: 64 },
    },
    required: ["name"],
  };

  public updatedAt?: string;

  public async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
