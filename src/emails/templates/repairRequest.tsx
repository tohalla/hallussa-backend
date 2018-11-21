import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "./components/Footer";
import Signature from "./components/Signature";
import MaintenanceEvent from "./../../maintenance/MaintenanceEvent";

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

export default (contents: {
  appliance: Appliance;
  maintenanceEvent: MaintenanceEvent;
  request: string;
}) => {
  const {
    appliance: { name, model, manufacturer, description },
    maintenanceEvent: { description: maintenanceDescription },
    request
  } = contents;
  return renderToStaticMarkup(
    <div>
      <h2>An appliance has been reported malfunctioning.</h2>
      <p>Details of the appliance:</p>
      <ul>
        <li>Name: {name}</li>
        <li>Model: {model}</li>
        <li>Manufacturer: {manufacturer}</li>
        <li>Description: {description}</li>
        <li>Short description of the problem: {maintenanceDescription}</li>
      </ul>
      <p>Accept repair request:</p>
      <p>{request}</p>
      <Signature />
      <Footer />
    </div>
  );
};
