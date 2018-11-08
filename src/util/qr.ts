import { Context } from "koa";
import QRCode from "qrcode";
import { path, reduce } from "ramda";

import Appliance from "../appliance/Appliance";

export const getQRPage = async (
  applianceIDs: number[],
  organisation: number,
  host: string,
  protocol: string = "http"
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
        `${protocol}://${host}/api/v1/maintenance/${appliance.hash}`,§
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
