import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { StyledBreadcrumb } from "./StyledBreadcrumb";
import AddCircleIcon from "@material-ui/icons/AddCircle";

export const Navigation = () => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      <StyledBreadcrumb
        component="a"
        href="#"
        label="Home"
        icon={<HomeIcon fontSize="small" />}
      />
      <StyledBreadcrumb
        component="a"
        href="#"
        icon={<AddCircleIcon fontSize="small" />}
        label="Job erstellen"
      />
    </Breadcrumbs>
  );
};
