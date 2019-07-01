import { Model, snakeCaseMappers } from "objection";

export default class OrganisationPreferences extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "organisation_preferences";

  public static jsonSchema = {
    type: "object",

    properties: {
      organisation: { type: "integer" },

      allowResolvingEvents: { type: "boolean" },
      qrCodes: { type: "boolean" },
    },
  };

  public organisation?: number;

  public async $beforeUpdate() {
    delete this.organisation; // should not update organisation field
  }
}
