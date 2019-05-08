import QRCode from "qrcode";
import { reduce } from "ramda";

import Appliance from "../appliance/Appliance";
import { apiURL } from "../config";

export const getQRPage = async (
  applianceIDs: number[],
  organisation: number
) => {
  // get specified appliances (only if listed under organisation)
  const appliances = await Appliance
    .query()
    .select("hash")
    .whereIn("id", applianceIDs)
    .andWhere("organisation", "=", organisation);

  // generate svg qr codes for appliances
  const qrCodes = await Promise.all(
    appliances.map(async (appliance) =>
      QRCode.toString(
        `${apiURL}/maintenance/${appliance.hash}`,
        {errorCorrectionLevel: "medium", type: "svg", scale: 2}
      ),
      appliances
    )
  );

  // return page as string
  return reduce(
    (prev, curr) => prev + `<div style=\"width: 250px; height: auto;\">${
      curr
    }</div>`,
    "<!doctype html><html><head></head><body>",
    qrCodes
  ) + "</body></html>";

};
