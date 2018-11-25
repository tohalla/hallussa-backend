import { send, sender } from "./methods";

export const sendFailEmail = async (senderEmail: string, msg: string) => {
  const failResponse = {
    from: sender,
    subject: "Failed to send message.",
    text: msg,
    to: senderEmail,
  };

  try {
    await send(failResponse);
  } catch (e) {
    // TODO put to ErrorLog
  }
};
