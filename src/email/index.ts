import sgMail from "@sendgrid/mail";

export const initializeSG = () => {
  if (!process.env.SENDGRID_API_KEY) {
    throw Error("Sendgrid api key not set.");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

export const sender = {
  noReply: "Hallussa <noreply@hallussa.fi>",
};
