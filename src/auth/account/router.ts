import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import { secureRoute } from "../jwt";
import Account, { normalizeAccount } from "./Account";

export default new Router({prefix: "/accounts"})
  .get("/", secureRoute, async (ctx) => {
    const accountId = path(["state", "claims", "accountId"], ctx);
    ctx.body = normalizeAccount(await Account
      .query()
      .select()
      .where("id", "=", accountId)
      .eager(ctx.query.eager)
      .modifyEager("organisations", (builder) => builder.select("organisation", "user_role"))
      .first()
    );
  })
  .post("/", bodyParser(), async (ctx) => {
    try {
      if (!ctx.request.body) {
        return ctx.throw(400);
      }
      const {password, retypePassword} = ctx.request.body as {[key: string]: any};
      if (password !== retypePassword) {
        return ctx.throw(400, "Passwords do not match");
      }
      ctx.body = await Account
        .query()
        .insert(ctx.request.body)
        .returning("*");
      ctx.status = 201;
    } catch (e) {
      if (typeof e === "object") {
        if (e.constraint === "account_email_unique") {
          ctx.throw(
            409,
            `Account with email ${
              path(["request", "body", "email"], ctx)
            } already exists.`
          );
        }
      }
      throw e;
    }
  })
  .patch("/", secureRoute, bodyParser(), async (ctx) => {
    ctx.body = await Account.query().patch(
      ctx.request.body || {}
    ).returning("*").first();
  });
