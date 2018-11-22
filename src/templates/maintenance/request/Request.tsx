import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import container, { body } from "../../../emotion-styles/src/container";
import { logoContainer, uppercaseTitle } from "../../../emotion-styles/src/topbar";
import Footer from "../../shared/Footer";
import TopBar from "../../shared/TopBar";
import ViewContainer from "../../shared/ViewContainer";
import NewRequestForm from "./NewRequestForm";

export default (hash: string, name: string, organisation: string) => renderStylesToString(renderToStaticMarkup(
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body className={body}>
      <ViewContainer>
        <TopBar>
          <div style={{ display: "flex" }}>
            <div className={logoContainer} style={{ position: "absolute" }}>
              logo
            </div>
            <div className={uppercaseTitle} style={{ flexGrow: 1 }}>
              Maintenance Report
            </div>
          </div>
        </TopBar>
        <div className={container}>
          <div style={{ width: "90vw", margin: "0 auto" }}>
            <h1>{name}</h1>
            <h3>{organisation}</h3>
            <p>Hey!</p>
            <p>
              You have scanned a maintenance card.
              You can report a malfunctioning appliance on this form.
              We’ll make sure that the appliance’s organisation is informed as soon as you send this report.
              Thanks for the effort!
            </p>
            <p>
              Leave your email address and you will be informed when the appliance is functioning again.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NewRequestForm hash={hash} />
          </div>
        </div>
        <Footer />
      </ViewContainer>
    </body>
  </html>
));
