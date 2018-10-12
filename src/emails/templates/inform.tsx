import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "./components/Footer";
import Signature from "./components/Signature";

export default (applianceName: string, type: "broken" | "repaired") => {
  const verb = type === "broken" ? "broken" : "been repaired";
  return renderToStaticMarkup(
    <div>
      <h2>Hello subscriber!</h2>
      <p>
        We would like to notify you that:
        It appears that the appliance { applianceName } you have subscribed to has { verb }.
      </p>
      <p>
        To stop this subscription you can click this <a href="%recipient.unsubscribeUrl%">link</a>.
        If for some reason the above link does not work,
        try copying and pasting the following link %recipient.unsubscribeUrl% to your browser.
      </p>
      <p>
        Hope we can be of service to you.
      </p>
      <Signature />
      <Footer />
    </div>
  );
};
