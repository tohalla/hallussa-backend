import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import { secureRoute } from "../auth/jwt";
import { query } from "../database/db";
import Account from "./Account";

export default new Router({prefix: "/accounts"})
  .get("/", secureRoute, async (ctx) => {
    const accountId = path(["state", "claims", "accountId"], ctx);
    ctx.body =  await query(Account.query().select().where("id", "=", accountId).omit(["password"]).first());
  })
  .post("/", bodyParser(), async (ctx) => {
    ctx.body = await query(Account.query().insertAndFetch(ctx.request.body || {}));
    ctx.status = 201;
  })
  .put("/", secureRoute, bodyParser(), async (ctx) => {
    ctx.body = await query(Account.query().patchAndFetchById(
      path(["state", "claims", "accountId"], ctx) as number,
      ctx.request.body || {}
    ));
  });
