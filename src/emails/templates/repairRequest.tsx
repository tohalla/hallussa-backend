import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "./components/Footer";
import Signature from "./components/Signature";

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

export default (contents: { appliance: Appliance, request: string }) => {
  const {
    appliance: {
      name, model, manufacturer, description,
    },
    request,
  } = contents;
  return renderToStaticMarkup(
    <div>
      <h2>An appliance has been reported malfunctioning.</h2>
      <p>Details:</p>
      <ul>
        <li>{ name }</li>
        <li>{ model }</li>
        <li>{ manufacturer }</li>
        <li>{ description }</li>
      </ul>
      <p>Repair request:</p>
      <p>{ request }</p>
      <Signature />
      <Footer />
    </div>
  );
};
