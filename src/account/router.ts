import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { query } from "../database/db";
import Account from "./Account";

export default new Router({prefix: "/accounts"})
  .get("/", async (ctx) => {
    // TODO: return current account
  })
  .post("/", bodyParser(), async (ctx) => {
    ctx.body = await query(Account.query().insertAndFetch(ctx.request.body || {}));
  })
  .put("/", bodyParser(), () => {
    // TODO: update current account information
  });
