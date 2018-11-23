import { logo, send, sender } from "./methods";

import html from "../templates/emails/repairRequest";

export interface RequestParams {
  org_id: number;
  org_name: string;
  app_hash: string;
  app_name: string;
  app_description: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: number;
  event_description: string;
  task_hash: string;
}

export const sendRepairRequestEmail = async (data: RequestParams) => {
  const email = {
    from: sender,
    html: html(data),
    inline: logo,
    subject: "An appliance needs maintenance.",
    to: data.email || "error@hallussa.fi",
  };
  try {
    await send(email);
  } catch (e) {
    // TODO send fail email.
    // await sendFailEmail("foo", "bar");
  }
};
