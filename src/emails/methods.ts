import { getMailgun } from "./mailgun";

import inform from "./templates/inform";
import repairRequest from "./templates/repairRequest";
import subscribe from "./templates/subscribe";

const from = "HALLUSSA <noreply@hallussa.com>";

interface RecipientVar {
  id: number;
  name: string;
  subject: string;
  unsubscribeUrl?: string;
}

interface Data {
  from: string;
  subject: string;
  text?: string;
  html?: string;
  to: string | string[];
  "recipient-variables"?: {
    [key: string]: RecipientVar
  }
}

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

const send = async (data: Data) => {
  const mailgun = getMailgun();
  await mailgun.messages().send(data);
};

const sendFailEmail = async (senderEmail: string, msg: string) => {
  const failResponse = {
    from,
    subject: "Failed to send message.",
    text: msg,
    to: senderEmail,
  };

  try {
    await send(failResponse);
  } catch (e) {
    // TODO put to ErrorLog
  }
}

export const sendRepairRequestEmail = async (
  senderEmail: string,
  recipient: string,
  contents: {
    appliance: Appliance,
    request: string
  }) => {
  const data = {
    from,
    html: repairRequest(contents),
    subject: "An appliance needs maintanance.",
    to: recipient,
  };
  try {
    await send(data);
  } catch (e) {
    await sendFailEmail(senderEmail, contents.request);
  }
};

export const sendSubscriptionEmail = async (applianceName: string, recipient: string, unsubscribeUrl: string) => {
  const data = {
    from,
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

interface Recipient {
  email: string;
  firstName: string;
  lastName: string;
  unsubscribeUrl?: string;
}

const findRecipientVars = (recipients: ReadonlyArray<Recipient>, subject: string) => {
  const recipientVars: {
    [key: string]: RecipientVar
  } = {};
  recipients.forEach((recipient, index) => {
    const { email, firstName, lastName } = recipient;
    recipientVars[email] = {
      id: index,
      name: `${firstName} ${lastName}`,
      subject,
      unsubscribeUrl: recipient.unsubscribeUrl || "",
    }
  });
  return recipientVars;
}

export const informSubscribers = async (
    applianceName: string,
    type: "broken" | "repaired",
    recipients: ReadonlyArray<Recipient>
  ) => {
  const subject = `An appliance you have subscribed to has ${type === "broken" ? "broken" : "been repaired"}`;
  const recipientVars = findRecipientVars(recipients, subject);

  const data = {
    from,
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
}

export const inviteEmail = async (
    inviterEmail: string,
    recipients: ReadonlyArray<Recipient>,
    organisation: string,
    msg: string
  ) => {
  const recipientVars = findRecipientVars(recipients, `You have been invited to join ${organisation}`);

  const data = {
    from,
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

// export const sendVerifyEmail = async (recipient: string, msg: string) => {
//   const data = {
//     from,
//     subject: "Verify your email address.",
//     text: msg,
//     to: recipient,
//   };

//   try {
//     await send(data);
//   } catch (e) {
//     // TODO put to ErrorLog
//   }
// };
