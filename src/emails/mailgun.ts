import { config } from "dotenv";
import Mailgun from "mailgun-js";

config({ path: "../.env" });

export const getMailgun = () => {
  if (!(
    process.env.MAILGUN_DOMAIN &&
    process.env.MAILGUN_APIKEY
  )) {
    throw new Error("define environment variables for mailgun");
  }
  const apiKey = process.env.MAILGUN_APIKEY;
  const domain = process.env.MAILGUN_DOMAIN;
  return new Mailgun({ apiKey, domain });
};
