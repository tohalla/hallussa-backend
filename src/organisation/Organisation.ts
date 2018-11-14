import { Model } from "objection";

import Account from "../account/Account";

export default class Organisation extends Model {
  public static tableName = "organisation";

  public static relationMappings = {
    accounts: {
      join: {
        from: "organisation.id",
        through: {
          extra: ["isAdmin"],
          from: "organisation_account.organisation",
          to: "organisation_account.account",
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

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field

    this.updatedAt = new Date().toISOString();
  }
}
