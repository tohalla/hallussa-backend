import { Model } from "objection";
import { evolve, map, prop } from "ramda";

import ApplianceMaintainer from "../relation-models/ApplianceMaintainer";
import { formatPhone } from "../util/format";

export default class Maintainer extends Model {
  public static tableName = "maintainer";

  public static relationMappings = {
    appliances: { // should never eagerly load appliances, only ID's
      join: {
        from: "maintainer.id",
        to: "appliance_maintainer.maintainer",
      },
      modelClass: ApplianceMaintainer,
      relation: Model.HasManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      email: {type: "string", maxLength: 256},
      firstName: {type: "string", minLength: 1, maxLength: 64},
      lastName: {type: "string", minLength: 1, maxLength: 64},
      phone: {type: "string", maxLength: 16},
    },
    required: ["firstName", "lastName", "email", "phone"],
  };

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public organisation?: number;
  public phone?: string;
  public appliances: ReadonlyArray<number> = [];

  public $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.organisation; // should not update organisation field

    this.phone = formatPhone(this.phone);
    this.updatedAt = new Date().toISOString();
  }

  public $beforeInsert() {
    this.phone = formatPhone(this.phone);
  }
}

// normalizes maintainer
export const normalizeMaintainer = (maintainer: Maintainer | undefined) =>
 maintainer && evolve({
   appliances: map(prop("appliance")),
 }, maintainer as object);
