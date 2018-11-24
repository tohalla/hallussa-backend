import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import container from "../../../emotion-styles/src/container";
import { logoContainer, uppercaseTitle } from "../../../emotion-styles/src/topbar";
import Root from "../../shared/Root";
import TopBar from "../../shared/TopBar";
import ViewContainer from "../../shared/ViewContainer";

export default (

) => renderStylesToString(renderToStaticMarkup(
  <Root>
    <ViewContainer>
      <TopBar>
        <div style={{ display: "flex", flexGrow: 1 }}>
          <div className={logoContainer} style={{ position: "absolute" }}>
            logo
          </div>
          <div className={uppercaseTitle} style={{ flexGrow: 1 }}>
            Maintenance Report
          </div>
        </div>
      </TopBar>
      <div className={container}>
        Hello
      </div>
    </ViewContainer>
  </Root>
));
