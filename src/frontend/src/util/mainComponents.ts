import { Home } from "../Home";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import /*React,*/ { FC } from "react";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon/SvgIcon";
import { JobPage } from "../JobPage";
import { JobLogs } from "../JobLogs";
import DescriptionIcon from "@material-ui/icons/Description";
import CreateIcon from "@material-ui/icons/Create";
import { AddTopic } from "../AddTopic";
import { CreateInfoProvider } from "../CreateInfoProvider"
import {Dashboard} from "../Dashboard";
import {EditInfoProvider} from "../EditInfoProvider";
import EditIcon from "@material-ui/icons/Edit";
import {SceneCreation} from "../SceneCreation";

export type MainComponent = {
  component: FC;
  props?: any;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  navName: string;
};

export interface MainComponents {
  [key: string]: MainComponent;
}

/**
 * Object das Alle main Componenten mit Icon und Navigations namen beinhalte.
 * Die Keys müssen in ComponentKey eingetragen werden.
 */
export const mainComponents: MainComponents = {
  home: {
    component: Home,
    icon: HomeIcon,
    navName: "Home",
  },
  jobPage: {
    component: JobPage,
    icon: AddCircleIcon,
    navName: "Job erstellen",
  },
  jobLogs: {
    component: JobLogs,
    icon: DescriptionIcon,
    navName: "Logs",
  },
  addTopic: {
    component: AddTopic,
    icon: CreateIcon,
    navName: "Themen",
  },
  createInfoProvider: {
    component: CreateInfoProvider,
    icon: HomeIcon,
    navName: "createInfoProvider",
  },
  dashboard: {
    component: Dashboard,
    icon: HomeIcon,
    navName: "dashboard"
  },
<<<<<<< HEAD

  editInfoProvider: {
    component: EditInfoProvider,
    icon: EditIcon,
    navName: "editInfoProvider"
  },
=======
>>>>>>> c97c7f70a6dc559b219835dbb3da5e63b79c8150
  sceneCreation: {
    component: SceneCreation,
    icon: HomeIcon,
    navName: "sceneCreation"
  }
};

/**
 * Type für alle Keys von mainComponents
 */
<<<<<<< HEAD
export type ComponentKey = "home" | "jobPage" | "jobLogs" | "addTopic" | "createInfoProvider" | "dashboard" | "editInfoProvider" | "sceneCreation";
=======
export type ComponentKey = "home" | "jobPage" | "jobLogs" | "addTopic" | "createInfoProvider" | "dashboard" | "sceneCreation";
>>>>>>> c97c7f70a6dc559b219835dbb3da5e63b79c8150
