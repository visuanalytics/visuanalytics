import React from "react";
import { Grid } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import { ComponentContext } from "../../ComponentProvider";
import { MenuButton } from "./MenuButton";
import CreateIcon from "@material-ui/icons/Create";

export const Menu = () => {
  const components = React.useContext(ComponentContext);

  return (
    <Grid container spacing={1}>
      <MenuButton
        title="Logs"
        iconButtonProps={{ onClick: () => components?.setCurrent("jobLogs") }}
        icon={<DescriptionIcon />}
      />
      <MenuButton
        title="Themen hinzufügen"
        iconButtonProps={{ onClick: () => components?.setCurrent("addTopic") }}
        icon={<CreateIcon />}
      />
    </Grid>
  );
};
