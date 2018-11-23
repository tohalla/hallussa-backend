import { send, sender } from "./methods";

import html from "../templates/emails/repairRequest";

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

export interface RequestParams {
  orgId: number;
  orgName: string;
  appName: string;
  appDescription: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  eventDescription: string;
}

export const sendRepairRequestEmail = async (data: RequestParams) => {
  const email = {
    from: sender,
    html: html(data),
    subject: "An appliance needs maintenance.",
    to: data.email || "error@hallussa.fi",
  }
  try {
    await send(email);
  } catch (e) {
    // await sendFailEmail("foo", "bar");
  }
};
