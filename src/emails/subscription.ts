import { findRecipientVars, Recipient, send, sender } from "./methods";

import inform from "../templates/emails/inform";
import subscribe from "../templates/emails/subscribe";

export const sendSubscriptionEmail = async (applianceName: string, recipient: string, unsubscribeUrl: string) => {
  const data = {
    from: sender,
    html: subscribe(applianceName, unsubscribeUrl),
    subject: `You have subscribed to ${applianceName}'s status.`,
    to: recipient,
  };
  try {
    await send(data);
  } catch (e) {
    // TODO put to ErrorLog
  }
};

export const informSubscribers = async (
  applianceName: string,
  type: "broken" | "repaired",
  recipients: ReadonlyArray<Recipient>
) => {
  const subject = `An appliance you have subscribed to has ${type === "broken" ? "broken" : "been repaired"}`;
  const recipientVars = findRecipientVars(recipients, subject);

  const data = {
    "from": sender,
    "recipient-variables": recipientVars,
    "subject": "%recipient.subject%",
    "text": inform(applianceName, type),
    "to": recipients.map((recipient) => recipient.email),
  };

  try {
    await send(data);
  } catch (e) {
    // TODO put to ErrorLog
  }
};
