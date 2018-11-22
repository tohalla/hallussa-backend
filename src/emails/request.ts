import { sendFailEmail } from "./fail";
import { send, sender } from "./methods";

import html from "../templates/emails/repairRequest";

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

export const sendRepairRequestEmail = async (
  senderEmail: string,
  recipient: string,
  contents: {
    appliance: Appliance,
    request: string
  }) => {
  const data = {
    from: sender,
    html: html(contents),
    subject: "An appliance needs maintanance.",
    to: recipient,
  };
  try {
    await send(data);
  } catch (e) {
    await sendFailEmail(senderEmail, contents.request);
  }
};
