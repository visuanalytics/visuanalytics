import React from "react";
import { Components, Component, components } from "../util/mainComponents";

// Component das zuerst Angezeigt wird
const startComponent: Components = "home";

type ComponentContextType = {
  current: Component;
  setCurrent: (next: Components) => void;
};

export const ComponentContext = React.createContext<
  ComponentContextType | undefined
>(undefined);

interface Props {}

/**
 * Component das den Component Context verwendet um Funktionen bereit zustellen
 * um das Aktuelle Component auszuwählen.
 */
export const ComponentProvider: React.FC<Props> = ({ children }) => {
  const [current, setCurrent] = React.useState<Component>(
    components[startComponent]
  );

  const handleSetCurrent = (next: Components) => {
    setCurrent(components[next]);
  };

  return (
    <ComponentContext.Provider
      value={{
        current,
        setCurrent: handleSetCurrent,
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};
