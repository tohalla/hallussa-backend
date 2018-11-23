import { Context } from "koa";
import QRCode from "qrcode";
import { path, reduce } from "ramda";

import Appliance from "../appliance/Appliance";
import Organisation from "../organisation/Organisation";

export const getQRPage = async (
  applianceIDs: number[],
  organisationID: number,
  host: string,
  protocol: string = "http"
) => {
  // get specified appliances (only if listed under organisation)
  const appliances = await Appliance
    .query()
    .select("hash")
    .whereIn("id", applianceIDs)
    .andWhere("organisation", "=", organisationID);

  // generate svg qr codes for appliances
  const qrCodes = await Promise.all(
    appliances.map(async (appliance) =>
      QRCode.toString(
        `${protocol}://${host}/api/v1/maintenance/${appliance.hash}`,
        {errorCorrectionLevel: "medium", type: "svg", scale: 2}
      ),
      appliances
    )
  );

  const organisation = await Organisation.query().select().where("id","=",organisationID).first();
  if (organisation) {
    // return page as string
    return reduce(
      (prev, curr) => prev + `
      <div>
        <div style="width: 35%; display: inline-block; float:left;">
          ${curr}
        </div>
        <div style="width: 65%; text-align: center; display: inline-block; float:right; font-size: 125%;">
          <h1>${organisation.name}</h1>
          <p>Scan the QR-code if you notice any malfunctioning</p>
          <p>Hallussa at your service!</p>
        </div>
      </div>`,
      "<!doctype html><html><head></head><body>",
      qrCodes
    ) + "</body></html>";
  }
};
