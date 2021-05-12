import React from "react";
import {
  ComponentKey,
  MainComponent,
  mainComponents,
} from "../util/mainComponents";

// Component das zuerst Angezeigt wird
const startComponent: ComponentKey = "dashboard";

type ComponentContextType = {
  current: MainComponent;
  setCurrent: (next: ComponentKey, props?: Object) => void;
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
  const [current, setCurrent] = React.useState<MainComponent>(
    mainComponents[startComponent]
  );

  const handleSetCurrent = (next: ComponentKey, props?: Object) => {
    setCurrent({ ...mainComponents[next], props: props });
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
