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
  .use((ctx, next) => ctx.state.rights.allowManageUsers ? next() : ctx.throw(401))
  .post("/accounts", bodyParser(), async (ctx) => {
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
      try {
        ctx.body = await OrganisationAccount.query().insert({
          account: account.id,
          organisation: Number(organisation),
          userRole,
        }).returning("*");
      } catch (e) {
        if (typeof e === "object" && e.constraint === "organisation_account_account_organisation_unique") {
          ctx.throw(409, "Account already added to the organisation");
        }
      }
    }
  })
  .put("/accounts/:account", bodyParser(), async (ctx) => {
    const { organisation, account } = ctx.params;
    const { userRole } = (ctx.request.body || {}) as InvitationPayload;
    ctx.body = await OrganisationAccount.query()
      .update({userRole})
      .where("organisation", "=", organisation)
      .andWhere("account", "=", account)
      .returning("*").first();
  })
  .del("/accounts/:account", async (ctx) => {
    const { organisation, account } = ctx.params;
    await OrganisationAccount.query().delete() // remove pre-existing roles from account in the organisation
      .where("organisation", "=", organisation)
      .andWhere("account", "=", account);
  });
