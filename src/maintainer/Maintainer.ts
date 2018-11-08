import { Model } from "objection";
import Appliance from "../appliance/Appliance";
import Organisation from "../organisation/Organisation";

export default class Maintainer extends Model {
  public static tableName = "maintainer";

  public static relationMappings = {
    appliances: {
      join: {
        from: "maintainer.id",
        through: {
          extra: ["isAdmin"],
          from: "appliance_maintainer.maintainer",
          to: "appliance_maintainer.appliance",
        },
        to: "appliance.id",
      },
      modelClass: Appliance,
      relation: Model.ManyToManyRelation,
    },
    owner: {
      join: {
        from: "maintainer.organisation",
        to: "organisation.id",
      },
      modelClass: Organisation,
      relation: Model.BelongsToOneRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      email: {type: "string", maxLength: 256},
      firstName: {type: "string", minLength: 1, maxLength: 64},
      lastName: {type: "string", minLength: 1, maxLength: 64},
      phone: {type: "string", pattern: "^(\+)?\d{1,15}$", maxLength: 16},
    },
    required: ["firstName", "lastName", "email", "phone"],
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
