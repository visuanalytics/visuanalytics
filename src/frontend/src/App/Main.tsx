import React from "react";
import { ComponentContext } from "../ComponentProvider";

/**
 * Component das, das Aktuelle Component des ComponentContextes Anzeigt
 * Nicht ändern
 */
export const Main = () => {
  const component = React.useContext(ComponentContext);
  return <>{component ? <component.current.component /> : null}</>;
};
