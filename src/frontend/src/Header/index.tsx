import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Navigation } from "./Navigation";
import { Box } from "@material-ui/core";
import { BlueDivider } from "./BlueDivider";
import { getUrl } from "../util/fetchUtils";

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
      <Box display="flex" alignSelf="center" m={1}>
        <Navigation />
      </Box>
      <BlueDivider />
    </AppBar>
  );
};
