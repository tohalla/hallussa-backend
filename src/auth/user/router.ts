import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { raw } from "objection";

import { RouterStateContext } from "../../organisation/router";
import OrganisationAccount from "../../relation-models/OrganisationAccount";
import Account from "../account/Account";

interface InvitationPayload {
  email: string;
  userRole: number;
}

export default new Router<RouterStateContext>({ prefix: "/users" })
  .get("/accounts", async (ctx) => {
    // organisation param set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Account
      .query()
      .join(
        "organisation_account",
        (builder) => builder
          .on(raw("organisation_account.organisation = ?::integer", organisation))
          .andOn("organisation_account.account", "account.id")
      )
      .select();
  })
  .post("/accounts", bodyParser(), async (ctx) => {
    if (!ctx.state.rights.allowManageRoles) {
      return ctx.throw(401);
    }
    // organisation param set in parent router
    const { organisation } = ctx.params;
    const {email, userRole} = (ctx.request.body || {}) as InvitationPayload;
    if (typeof userRole !== "number") {
      return ctx.throw(400, "values for account and userRole required");
    }
    if (typeof email === "string") {
      const account = await Account.query().select("id").where("email", "=", email).first();
      if (!account) {
        return ctx.throw(400, `Account not found with email ${email}`);
      }
      await OrganisationAccount.query().delete() // remove pre-existing roles from account in the organisation
        .where("organisation", "=", organisation)
        .andWhere("account", "=", account.id);
      ctx.body = await OrganisationAccount.query().insert({
        account: account.id,
        organisation: Number(organisation),
        userRole,
      }).returning("*");
    }
  })
  .del("/accounts/:account", async (ctx) => {
    if (!ctx.state.rights.allowManageRoles) {
      return ctx.throw(401);
    }
    const { organisation, account } = ctx.params;
    await OrganisationAccount.query().delete() // remove pre-existing roles from account in the organisation
      .where("organisation", "=", organisation)
      .andWhere("account", "=", account);
  });
