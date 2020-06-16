import { Home } from "../Home";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FC } from "react";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon/SvgIcon";
import { JobPage } from "../JobPage";

export type MainComponent = {
  component: FC;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  navName: string;
};

/**
 * Object das Alle main Componenten mit Icon und Navigations namen beinhalte.
 * Die Keys müssen in ComponentKey eingetragen werden.
 */
export const mainComponents = {
  home: {
    component: Home,
    icon: HomeIcon,
    navName: "Home",
  },
  jobpage: {
    component: JobPage,
    icon: AddCircleIcon,
    navName: "Job erstellen",
  }
};

/**
 * Type für alle Keys von mainComponents
 */
export type ComponentKey = "home" | "jobpage";
