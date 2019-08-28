import i18n from "i18next";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { Model } from "objection";
import { path } from "ramda";

import { Middleware } from "koa";
import { RouterStateContext } from "../../organisation/router";
import OrganisationAccount from "../../relation-models/OrganisationAccount";
import Account from "../account/Account";

interface InvitationPayload {
  email: string;
  userRole: number;
}

const ensureAdministrator: Middleware = async (ctx, next) => {
  const { organisation, account } = ctx.params;
  const allow = path(["rows", 0, "exists"], await Model.raw(
    `SELECT EXISTS(
      SELECT 1 FROM organisation_account WHERE organisation = :organisation:::integer AND (
        (account = :account:::integer AND (user_role IS NULL OR user_role != 1)) OR
        (account != :account:::integer AND user_role = 1)
      )
    )`,
    {account: Number(account), organisation: Number(organisation)}
  ));
  if (allow) {
    return next();
  }
  ctx.throw(i18n.t("error.organisation.administratorRequired", {lng: ctx.headers["Accept-Language"]}), 409);
};

export default new Router<RouterStateContext>({ prefix: "/users" })
  .get("/accounts", async (ctx) => {
    // organisation param set in parent router
    const { organisation } = ctx.params;
    const query = Account
      .query()
      .join(
        "organisation_account",
        (builder) => builder
          .on(Model.raw("organisation_account.organisation = ?::integer", organisation))
          .andOn("organisation_account.account", "account.id")
      )
      .select();

    if (ctx.query.accounts) {
      query.whereIn("id", JSON.parse(ctx.query.accounts));
    }

    ctx.body = await query;
  })
  .del("/accounts/:account", ensureAdministrator, async (ctx) => {
    const { organisation, account } = ctx.params;
    // Should be allowed to acces only if querying own account, or has right to manage users
    if (!(ctx.state.rights.allowManageUsers || ctx.state.claims.accountId === Number(account))) {
      return ctx.throw(403);
    }
    await OrganisationAccount.query().delete() // remove pre-existing roles from account in the organisation
      .where("organisation", "=", organisation)
      .andWhere("account", "=", account);
    ctx.body = {organisation, account: Number(account)};
    ctx.status = 200;
  })
  .use((ctx, next) => ctx.state.rights.allowManageUsers ? next() : ctx.throw(403))
  .post("/accounts", bodyParser(), async (ctx) => {
    // organisation param set in parent router
    const { organisation } = ctx.params;
    const {email, userRole} = (ctx.request.body || {}) as InvitationPayload;
    if (typeof email === "string") {
      const account = await Account.query().select("id").where("email", "=", email).first();
      if (!account) {
        return ctx.throw(
          i18n.t("error.organisation.users.accountNotFound", {lng: ctx.headers["Accept-Language"], email}),
          404
        );
      }
      try {
        ctx.body = await OrganisationAccount.query().insert({
          account: account.id,
          organisation: Number(organisation),
          userRole,
        }).returning("*");
      } catch (e) {
        if (typeof e === "object" && e.constraint === "organisation_account_account_organisation_unique") {
          ctx.throw(i18n.t("error.organisation.users.accountAlreadyAdded", {lng: ctx.headers["Accept-Language"]}), 409);
        }
      }
    }
  })
  .put("/accounts/:account", ensureAdministrator, bodyParser(), async (ctx) => {
    const { organisation, account } = ctx.params;
    const { userRole } = (ctx.request.body || {}) as InvitationPayload;
    ctx.body = await OrganisationAccount.query()
      .update({userRole})
      .where("organisation", "=", organisation)
      .andWhere("account", "=", account)
      .returning("*").first();
  });
