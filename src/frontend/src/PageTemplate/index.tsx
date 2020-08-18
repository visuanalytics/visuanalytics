import React from "react";
import { useStyles } from "./style";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { HintButton } from "../util/HintButton";

interface ActionProps {
  title: string;
  Icon: JSX.Element;
  onClick?: () => void;
}

interface Props {
  heading: string;
  action: ActionProps;
  hintContent: any;
}

export const PageTemplate: React.FC<Props> = ({
  heading,
  action,
  hintContent,
  children,
}) => {
  const classes = useStyles();
  return (
    <Container maxWidth={"md"} className={classes.margin}>
      <Paper variant="outlined" className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item container sm={5} xs={10}>
            <Grid item>
              <Typography variant={"h4"} className={classes.header}>
                {heading}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title={action.title} arrow>
                <IconButton
                  className={classes.button}
                  size="small"
                  onClick={action?.onClick}
                >
                  {action.Icon}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item container sm={7} xs={2} justify={"flex-end"}>
            <HintButton content={hintContent} />
          </Grid>
        </Grid>
        {children}
      </Paper>
    </Container>
  );
};
