import Router from "koa-router";
import repairRequest from "../templates/emails/repairRequest";
import Resolve from "../templates/maintenance/resolve/Resolve";

export default new Router({prefix: "/test"})
  .get("/", (ctx) => {
    ctx.response.set("Content-Type", "text/html");
    // ctx.body = repairRequest({
    //   app_description: "",
    //   app_hash: "",
    //   app_name: "",
    //   created_at: Date.now(),
    //   email: "foo@bar",
    //   event_description: "",
    //   first_name: "",
    //   last_name: "",
    //   org_id: 1,
    //   org_name: "",
    //   task_hash: "",
    // });
    ctx.body = Resolve();
  });
