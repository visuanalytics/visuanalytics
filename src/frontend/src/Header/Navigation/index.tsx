import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { StyledBreadcrumb } from "./StyledBreadcrumb";
import { ComponentContext } from "../../ComponentProvider";

export const Navigation = () => {
  const components = React.useContext(ComponentContext);

  const showCurrent = () => {
    if (components) {
      // If current Component is Home not render Twice
      if (components?.current.navName === "Home") return;

      return (
        <StyledBreadcrumb
          icon={<components.current.icon fontSize="small" />}
          label={components?.current.navName}
        />
      );
    }
  };

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      <StyledBreadcrumb
        label="Home"
        onClick={() => components?.setCurrent("home")}
        icon={<HomeIcon fontSize="small" />}
      />
      {showCurrent()}
    </Breadcrumbs>
  );
};
