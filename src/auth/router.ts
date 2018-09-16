import bodyParser from "koa-bodyparser";
import Router from "koa-router";

export default new Router({prefix: "/auth"})
  .get("/", async (ctx) => {
    // TODO: generate new jwt, if current auth token is still valid
  })
  .post("/", bodyParser(), async (ctx) => {
    // TODO: generate jwt if correct credentials passed
  });
