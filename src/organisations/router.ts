// import subWeeks from "date-fns/sub_weeks";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

// import { AuditModel } from "../audit/audit";

export default new Router({prefix: "/organisations"})
  // .get("/:organisation/events", (ctx) => {
  //   const events = AuditModel.find({
  //     organisation: ctx.params.organisation,
  //     timestamp: {
  //       $gte: subWeeks(Date.now(), 2),
  //     },
  //   });
  //   ctx.body = { events };
  // })
  .get("/:organisation", (ctx) => {
    ctx.body = {
      id: ctx.params.organisation,
    };
  })
  .post("/", bodyParser(), () => {
    // create organisation
  });
