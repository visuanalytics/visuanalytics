import React from "react";
import { Grid } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import { ComponentContext } from "../../ComponentProvider";
import { MenuButton } from "./MenuButton";

export const Menu = () => {
  const components = React.useContext(ComponentContext);

  return (
    <Grid container>
      <MenuButton
        title="Logs"
        iconButtonProps={{ onClick: () => components?.setCurrent("jobLogs") }}
        icon={<DescriptionIcon />}
      />
    </Grid>
  );
};
