import format from "date-fns/format";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Footer from "./components/Footer";
import Signature from "./components/Signature";

import { RequestParams } from "../../emails/request";

interface Appliance {
  name: string;
  model: string;
  manufacturer: string;
  description: string;
}

export default (data: RequestParams) => {
  const {
    orgName,
    appName,
    appDescription,
    firstName,
    lastName,
    createdAt,
    eventDescription,
  } = data;
  return renderToStaticMarkup(
    <div>
      <h1>Hello, {firstName} {lastName}.</h1>
      <h2>An appliance has been reported malfunctioning.</h2>
      <p>Details of the appliance:</p>
      <ul>
        <li>Organisation: {orgName}</li>
        <li>Name: {appName}</li>
        <li>Description: {appDescription}</li>
        <li>Reported: {format(createdAt, "YYYY-MM-DD")}</li>
        <li>Short description of the problem: {eventDescription}</li>
      </ul>
      <Signature />
      <Footer />
    </div>
  );
};
