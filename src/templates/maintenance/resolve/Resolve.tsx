import format from "date-fns/format";
import { renderStylesToString } from "emotion-server";
import React, { ReactFragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Appliance from "../../../appliance/Appliance";
import MaintenanceEvent from "../../../maintenance/MaintenanceEvent";
import MaintenanceTask from "../../../maintenance/MaintenanceTask";

import { growContainer } from "../../../emotion-styles/src/container";
import logo from "../../../emotion-styles/src/logo";
import { logoContainer, uppercaseTitle } from "../../../emotion-styles/src/topbar";

import Footer from "../../shared/Footer";
import Root from "../../shared/Root";
import TopBar from "../../shared/TopBar";
import ViewContainer from "../../shared/ViewContainer";

const Assigned = (props: { assignedTo: number | undefined; maintainer: number | undefined; }) => {
  let text = "This task has already been assigned to one of your colleagues.";
  if (!props.assignedTo) {
    text = "The maintainer for this task has not yet been assigned.";
  } else if (props.assignedTo === props.maintainer) {
    text = "This task has been assigned to you.";
  }
  return (
    <p>{text}</p>
  );
};

export default (
  {
    event,
    task,
    organisation,
    appliance,
  }: {
    event: MaintenanceEvent;
    task: MaintenanceTask;
    organisation: string;
    appliance: Appliance;
  },
  Content: any
) => renderStylesToString(renderToStaticMarkup(
  <Root>
    <ViewContainer>
      <TopBar>
        <div style={{ display: "flex", flexGrow: 1 }}>
          <div className={logoContainer} style={{ position: "absolute", margin: "11px" }}>
            <img src="../../../../assets/img/hallussa-qr.png" className={logo} />
          </div>
          <div className={uppercaseTitle} style={{ flexGrow: 1 }}>
            Maintenance
          </div>
        </div>
      </TopBar>
      <div className={growContainer}>
        <div style={{ width: "90vw", margin: "0 auto" }}>
          <h4>Appliance details:</h4>
          <ul>
            <li>Organisation: {organisation}</li>
            <li>Appliance: {appliance.name}</li>
            <li>Description: {appliance.description}</li>
          </ul>
          <h4>Maintenance request details:</h4>
          <ul>
            <li>Submitted: {format(event.createdAt as string, "YYYY-MM-DD hh:mm:ss")}</li>
            <li>Description: {event.description}</li>
          </ul>
        <Assigned maintainer={task.maintainer} assignedTo={event.assignedTo} />
        </div>
        {Content &&
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Content taskHash={task.hash} />
          </div>
        }
      </div>
      <Footer />
    </ViewContainer>
  </Root>
));
