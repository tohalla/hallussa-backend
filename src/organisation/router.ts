import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import { transaction } from "objection";
import { secureRoute } from "../auth/jwt";
import Organisation, { OrganisationAccountRelation } from "./Organisation";

export default new Router({ prefix: "/organisations" })
  .get("/", async (ctx) => {
    // TODO: Should organisations be public? if so, limit public data
    ctx.body = await Organisation.query().select();
  })
  .get("/:organisation", async (ctx) => {
    ctx.body = await Organisation.query()
      .select()
      .where("id", "=", ctx.params.organisation)
      .first();
  })
  .post("/", secureRoute, bodyParser(), async (ctx) => {
    const trx = await transaction.start(Organisation);
    try {
      // attempt to create a new organisation
      const organisation = await Organisation.query(trx).insert(
        ctx.request.body || {}
      );

      // add current account to created organisation with admin rights
      await organisation
        .$relatedQuery("accounts", trx)
        .relate<OrganisationAccountRelation>({
          id: 0,
          isAdmin: true,
        });
    } catch (e) {
      // should roll back organisation creation if couldn't link it to account
      trx.rollback();
      throw e;
    }
  });
