import { Model } from "objection";
import Organisation from "../organisation/Organisation";

export default class Appliance extends Model {
  public static tableName = "appliance";

  public static relationMappings = {
    appliances: {
      join: {
        from: "appliance.id",
        through: {
          extra: ["isAdmin"],
          from: "appliance_maintainer.appliance",
          to: "appliance_maintainer.maintainer",
        },
        to: "maintainer.id",
      },
      modelClass: Appliance,
      relation: Model.ManyToManyRelation,
    },
    owner: {
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

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public organisation?: number;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.organisation; // should not update organisation field

    this.updatedAt = new Date().toISOString();
  }
}
