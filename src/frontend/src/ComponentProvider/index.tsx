import React from "react";
import {
  ComponentKey,
  MainComponent,
  mainComponents,
} from "../util/mainComponents";
import { uniqueId } from "../CreateInfoProvider/types";

// Component das zuerst Angezeigt wird
const startComponent: ComponentKey = "home";

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
    mainComponents[
      sessionStorage.getItem("currentComponent-" + uniqueId) || startComponent
    ]
  );

  const handleSetCurrent = (next: ComponentKey, props?: Object) => {
    setCurrent({ ...mainComponents[next], props: props });
  };

  /* keep current context in sessionStorage */
  React.useEffect(() => {
    //get the componentKey from sessionStorage and choose the correct context object
    //dashboard is the default when nothing is selected
    setCurrent(
      mainComponents[
        sessionStorage.getItem("currentComponent-" + uniqueId) || startComponent
      ]
    );
  }, []);

  /* on every context change, store the componentKey of the new context in sessionStorage */
  React.useEffect(() => {
    /* calculate keyName */
    //currently, navName is the same as keyName, but to be prepared for changes here, this search is included
    const keyName = Object.entries(mainComponents).find(
      (c) => c[1].navName === current.navName
    );
    if (keyName)
      sessionStorage.setItem("currentComponent-" + uniqueId, keyName[0]);
  }, [current]);

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
