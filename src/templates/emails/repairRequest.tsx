import format from "date-fns/format";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Footer from "./components/Footer";
import Signature from "./components/Signature";

import { RequestParams } from "../../emails/request";

export default (data: RequestParams) => {
  const {
    org_name,
    app_name,
    app_hash,
    app_description,
    first_name,
    last_name,
    created_at,
    event_description,
    task_hash,
  } = data;
  const {PROTOCOL, API_PREFIX, BASE_URL} = process.env;
  const maintenancePageURI = `${PROTOCOL}://${BASE_URL}${API_PREFIX}/maintenance/${app_hash}/${task_hash}`;
  return renderToStaticMarkup(
    <div>
      <h1>Hello, {first_name} {last_name}.</h1>
      <h2>An appliance has been reported malfunctioning.</h2>
      <p>Details of the appliance:</p>
      <ul>
        <li>Organisation: {org_name}</li>
        <li>Name: {app_name}</li>
        <li>Description: {app_description}</li>
        <li>Reported: {format(created_at, "YYYY-MM-DD")}</li>
        <li>Short description of the problem: {event_description}</li>
      </ul>
      <a href={maintenancePageURI}>maintenancePageURI</a>.
      <Signature />
      <Footer />
    </div>
  );
};
