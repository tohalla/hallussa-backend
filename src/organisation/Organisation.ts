import { Model } from "objection";

import Account from "../account/Account";

export default class Organisation extends Model {
  public static tableName = "organisation";

  public static relationMappings = {
    accounts: {
      join: {
        from: "organisation.id",
        through: {
          from: "organisation_account.account",
          to: "organisation_account.organisation",
        },
        to: "account.id",
      },
      modelClass: Account,
      relation: Model.ManyToManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "integer" },

      name: { type: "string", minLength: 1, maxLength: 64 },
      organisationIdentifier: { type: "string", minLength: 1, maxLength: 64 },
    },
    required: ["name"],
  };

  public updatedAt?: string;
  public createdAt?: Date;

  public async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
