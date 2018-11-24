import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { map, path } from "ramda";

import { Model, transaction } from "objection";
import applianceRouter from "../appliance/router";
import { secureRoute } from "../auth/jwt";
import maintainerRouter from "../maintainer/router";
import { secureOrganisation } from "./middleware";
import Organisation, { normalizeOrganisation } from "./Organisation";

const router = new Router({ prefix: "/organisations" })
  .use(secureRoute)
  .get("/", async (ctx) => {
    const accountID = path(["state", "claims", "accountId"], ctx);
    // TODO: Should organisations be public? if so, limit public data
    ctx.body = map(normalizeOrganisation, await Organisation
      .query()
      .select()
      .joinRaw(
        "JOIN organisation_account ON organisation_account.account=?::integer " +
        "AND organisation_account.organisation=organisation.id",
        accountID
      )
      .eager(ctx.query.eager)
      .modifyEager("accounts", (builder) => builder.select("account", "isAdmin"))
      .modifyEager("appliances", (builder) => builder.select("id"))
      .modifyEager("maintainers", (builder) => builder.select("id"))
    );
  })
  .post("/", secureRoute, bodyParser(), async (ctx) => {
    const trx = await transaction.start(Organisation);
    try {
      const accountId = ctx.state.claims.accountId;
      // attempt to create a new organisation
      const organisation = await Organisation.query(trx).insert(
        ctx.request.body || {}
      ).returning("*");

      // add current account to created organisation with admin rights
      await trx.raw(
        "INSERT INTO organisation_account (organisation, account, is_admin) " +
        "VALUES (?::integer, ?::integer, ?::boolean)",
        [organisation.id as number, accountId, true]
      );

      trx.commit();
      ctx.body = {
        ...organisation,
        accounts: [{id: accountId, isAdmin: true}],
      };
      ctx.status = 201;
    } catch (e) {
      // should roll back organisation creation if couldn't link it to account
      trx.rollback();
      throw e;
    }
  });

router
  // account must be authenticated and a member of the organisation to access its routes
  .param("organisation", secureOrganisation)
  .get("/:organisation", async (ctx) => {
    ctx.body = normalizeOrganisation(await Organisation.query()
      .select()
      .where("id", "=", ctx.params.organisation)
      .eager(ctx.query.eager)
      .modifyEager("accounts", (builder) => builder.select("account", "isAdmin"))
      .modifyEager("appliances", (builder) => builder.select("id"))
      .modifyEager("maintainers", (builder) => builder.select("id"))
      .first()
    );
  })
  .patch("/:organisation", bodyParser(), async (ctx) => {
    ctx.body = await Organisation
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", ctx.params.organisation)
      .returning("*")
      .first();
  })
  .use("/:organisation", applianceRouter.routes(), applianceRouter.allowedMethods())
  .use("/:organisation", maintainerRouter.routes(), maintainerRouter.allowedMethods());

export default router;
