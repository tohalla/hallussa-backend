import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "./components/Footer";
import Signature from "./components/Signature";

export default (applianceName: string, unsubscribeUrl: string) => {
  return renderToStaticMarkup(
    <div>
      <h2>Hello subscriber!</h2>
      <p>
        You have subscribed to get notified of {applianceName}
        's status.
      </p>
      <h3>What does this mean?</h3>
      <p>
        Whenever this appliance is malfunctioning or it is repaired you will
        receive an email. These emails will inform you of the current status of
        the appliance.
      </p>
      <p>
        To stop the subscription you can click the following{" "}
        <a href={unsubscribeUrl}>link</a>. If for some reason the above link
        does not work, try copying and pasting the following text to your
        browser {unsubscribeUrl}
      </p>
      <p>Hope we can be of service to you.</p>
      <Signature />
      <Footer />
    </div>
  );
};
