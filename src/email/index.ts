import sgMail from "@sendgrid/mail";

export const initializeSG = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

export const sender = {
  noReply: "Hallussa <noreply@hallussa.fi>",
};
