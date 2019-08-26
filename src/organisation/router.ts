import i18n from "i18next";
import bodyParser from "koa-bodyparser";
import Router, { RouterContext } from "koa-router";
import { concat, map, omit, path, reduce } from "ramda";

import { Model, transaction } from "objection";
import applianceRouter from "../appliance/router";
import { Claims, secureRoute } from "../auth/jwt";
import userRoleRouter from "../auth/user-role/router";
import { RoleRights } from "../auth/user-role/UserRole";
import userRouter from "../auth/user/router";
import maintainerRouter from "../maintainer/router";
import { checkRelationExpression } from "../model/validation";
import { secureOrganisation } from "./middleware";
import Organisation, { normalizeOrganisation } from "./Organisation";
import OrganisationPreferences from "./Preferences";

export type RouterStateContext = RouterContext<{}, {
  rights: RoleRights | {[key: string]: never}
  claims: Claims;
}>;

const organisationRouter = new Router({prefix: "/:organisation"})
  .get("/", async (ctx) => {
    if (!checkRelationExpression(Organisation, ctx.query.eager)) {
      return ctx.throw(400, i18n.t("error.misc.invalidRelationExpression"), {lng: ctx.headers["Accept-Language"]});
    }
    ctx.body = normalizeOrganisation(await Organisation.query()
      .select()
      .where("id", "=", ctx.params.organisation)
      .eager(ctx.query.eager)
      .mergeEager("preferences")
      .modifyEager("accounts", (builder) => builder.select("account", "user_role"))
      .modifyEager("appliances", (builder) => builder.select("id"))
      .modifyEager("maintainers", (builder) => builder.select("id"))
      .first()
    );
  })
  .patch("/", bodyParser(), async (ctx) => {
    if (!ctx.state.rights.allowUpdateOrganisation) {
      return ctx.throw(403);
    }

    let organisation: Partial<Omit<Organisation, keyof Model>>;
    const trx = await transaction.start(Organisation.knex());

    try {
      const body = ctx.request.body as Partial<Omit<Organisation, keyof Model>>;
      organisation = await Organisation
        .query(trx)
        .patch(omit(["preferences"], ctx.request.body) || {})
        .where("id", "=", ctx.params.organisation)
        .returning("*")
        .first();
      if (body.preferences) {
        organisation.preferences = await OrganisationPreferences
          .query(trx)
          .patch(body.preferences)
          .where("organisation", "=", ctx.params.organisation)
          .returning("*")
          .first();
      }
      trx.commit();
    } catch (e) {
      trx.rollback();
      throw e;
    }
    ctx.body = organisation;
  })
  .del("/", async (ctx) => {
    if (!ctx.state.rights.allowDeleteOrganisation) {
      return ctx.throw(403);
    }
    await Organisation.query().deleteById(ctx.params.organisation);
    ctx.status = 200;
  })
  .use(
    ...reduce(
      (prev, curr) => concat(prev, [curr.routes(), curr.allowedMethods()]),
      [],
      [applianceRouter, maintainerRouter, userRoleRouter(), userRouter]
    )
  );

export default new Router<RouterStateContext>({ prefix: "/organisations" })
  .use(secureRoute)
  .get("/", async (ctx) => {
    if (!checkRelationExpression(Organisation, ctx.query.eager)) {
      return ctx.throw(400, i18n.t("error.misc.invalidRelationExpression"), {lng: ctx.headers["Accept-Language"]});
    }
    const accountID = path(["state", "claims", "accountId"], ctx);
    // TODO: Should organisations be public? if so, limit public data
    const organisations = await Organisation
      .query()
      .select()
      .joinRaw(
        "JOIN organisation_account ON organisation_account.account=?::integer " +
        "AND organisation_account.organisation=organisation.id",
        accountID
      )
      .eager(ctx.query.eager)
      .mergeEager("preferences")
      .modifyEager("accounts", (builder) => builder.select("account", "user_role"))
      .modifyEager("appliances", (builder) => builder.select("id"))
      .modifyEager("maintainers", (builder) => builder.select("id"))
      .modifyEager("userRoles", (builder) => builder.select("id"));
    ctx.body = map(normalizeOrganisation, organisations);
  })
  .post("/", bodyParser(), async (ctx) => {
    const trx = await transaction.start(Organisation.knex());
    try {
      const accountId = ctx.state.claims.accountId;
      // attempt to create a new organisation
      const organisation = await Organisation.query(trx).insert(
        ctx.request.body || {}
      ).returning("*");

      // add current account to created organisation with admin rights
      await trx.raw(
        "INSERT INTO organisation_account (organisation, account, user_role) " +
        "VALUES (?::integer, ?::integer, ?::integer)",
        [organisation.id as number, accountId, 1]
      );
      await trx.commit();
      ctx.body = {
        ...organisation,
        accounts: [{id: accountId, userRole: 1}],
      };
      ctx.status = 201;
    } catch (e) {
      // should roll back organisation creation if couldn't link it to account
      trx.rollback();
      throw e;
    }
  })
  // account must be authenticated and a member of the organisation to access its routes
  .use("/:organisation", secureOrganisation)
  .use(organisationRouter.routes(), organisationRouter.allowedMethods());
