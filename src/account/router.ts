import koaBody from "koa-body";
import Router from "koa-router";

export default new Router({prefix: "/account"})
  .get("/", (ctx) => {
    // TODO: return current account
  })
  .post("/", koaBody(), () => {
    // TODO: create account
  })
  .put("/", koaBody(), () => {
    // TODO: update current account information
  });
