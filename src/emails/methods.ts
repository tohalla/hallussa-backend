import { getMailgun } from "./mailgun";

export const sender = "HALLUSSA <noreply@hallussa.com>";

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
  };
}

export interface Recipient {
  email: string;
  firstName: string;
  lastName: string;
  unsubscribeUrl?: string;
}

export const send = async (data: Data) => {
  const mailgun = getMailgun();
  await mailgun.messages().send(data);
};

export const findRecipientVars = (recipients: ReadonlyArray<Recipient>, subject: string) => {
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
    };
  });
  return recipientVars;
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
