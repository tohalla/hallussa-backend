import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { growContainer } from "../../../emotion-styles/src/container";
import logo from "../../../emotion-styles/src/logo";
import { logoContainer, uppercaseTitle } from "../../../emotion-styles/src/topbar";
import Footer from "../../shared/Footer";
import Root from "../../shared/Root";
import TopBar from "../../shared/TopBar";
import ViewContainer from "../../shared/ViewContainer";

const {PROTOCOL, API_PREFIX, BASE_URL} = process.env;

export default (
  hash: string,
  name: string,
  organisation: string,
  Description: any,
  Form: any
) => renderStylesToString(renderToStaticMarkup(
  <Root>
    <ViewContainer>
      <TopBar>
        <div style={{ display: "flex", flexGrow: 1 }}>
          <div className={logoContainer} style={{ position: "absolute", margin: "11px" }}>
            <img src={`${PROTOCOL}://${BASE_URL}/assets/img/hallussa-qr.png`} className={logo} />
          </div>
          <div className={uppercaseTitle} style={{ flexGrow: 1 }}>
            Maintenance Report
          </div>
        </div>
      </TopBar>
      <div className={growContainer}>
        <div style={{ width: "90vw", margin: "0 auto" }}>
          <h1>{name}</h1>
          <h5>{organisation}</h5>
          <p>Hey!</p>
          <p>
            You have scanned a maintenance card.
            <Description />
            Thanks for the effort!
          </p>
          <p>
            Leave your email address and you will be informed when the appliance is functioning again.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Form hash={hash} />
        </div>
      </div>
      <Footer />
    </ViewContainer>
  </Root>
));
