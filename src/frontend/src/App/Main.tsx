import React from "react";
import { ComponentContext } from "../ComponentProvider";
import Fade from "@material-ui/core/Fade";

/**
 * Component das, das Aktuelle Component des ComponentContextes Anzeigt
 * Nicht ändern
 */
export const Main = () => {
  const component = React.useContext(ComponentContext);
  return (
    <Fade in>
      <>{component ? <component.current.component /> : null}</>
    </Fade>
  );
};
