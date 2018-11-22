import { findRecipientVars, Recipient, send, sender } from "./methods";

import { sendFailEmail } from "./fail";

export const inviteEmail = async (
  inviterEmail: string,
  recipients: ReadonlyArray<Recipient>,
  organisation: string,
  msg: string
) => {
  const recipientVars = findRecipientVars(recipients, `You have been invited to join ${organisation}`);

  const data = {
    "from": sender,
    "recipient-variables": recipientVars,
    "subject": "%recipient.subject%",
    "text": msg,
    "to": recipients.map((recipient) => recipient.email),
  };

  try {
    await send(data);
  } catch (e) {
    const failMessage = `Following recipients did not receive your email: \n ${recipients.join("\n")}`;
    await sendFailEmail(inviterEmail, failMessage);
  }
};