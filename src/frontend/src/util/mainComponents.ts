import { Home } from "../Home";
import HomeIcon from "@material-ui/icons/Home";
import { FC } from "react";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon/SvgIcon";

export type Component = {
  component: FC;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  navName: string;
};

/**
 * Object das Alle main Componenten mit Icon und Navigations namen beinhalte.
 * Die Keys müssen in Components eingetragen werden.
 */
export const components = {
  home: {
    component: Home,
    icon: HomeIcon,
    navName: "Home",
  },
};

/**
 * Type für alle Keys von components
 */
export type Components = "home";
