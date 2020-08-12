import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Navigation } from "./Navigation";
import { Box, Grid, Toolbar } from "@material-ui/core";
import { BlueDivider } from "./BlueDivider";
import { getUrl } from "../util/fetchUtils";
import { Menu } from "./Menu/Menu";

export const Header = () => {
  return (
    <AppBar position="static" color="transparent">
      <Box height="3rem" display="flex" alignSelf="center">
        <img
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          src={getUrl("/images/logo.png")}
          alt="logo"
        />
      </Box>
      <BlueDivider />
      <Toolbar style={{ minHeight: "40px" }}>
        <Grid container justify="center">
          <Grid item md xs></Grid>
          <Grid md xs={10} item container justify="center" alignItems="center">
            <Grid item>
              <Navigation />
            </Grid>
          </Grid>
          <Grid item container md xs justify="flex-end">
            <Grid item>
              <Menu />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
      <BlueDivider />
    </AppBar>
  );
};
