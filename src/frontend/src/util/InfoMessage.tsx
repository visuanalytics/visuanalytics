import React from "react";
import { useStyles } from "../Home/style";
import { Fade, Paper, Grid, Typography } from "@material-ui/core";
import { ContinueButton } from "../JobCreate/ContinueButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

interface MessageProps {
  headline: string;
  text?: JSX.Element;
  button?: {
    text: string;
    onClick?: () => void;
  };
}

interface Props {
  condition: boolean;
  message: MessageProps;
}

export const InfoMessage: React.FC<Props> = ({
  condition,
  message,
  children,
}) => {
  const classes = useStyles();

  if (condition) {
    return (
      <Fade in>
        <Paper variant="outlined" className={classes.paper}>
          <Grid container spacing={2}>
            <Grid container item justify="center">
              <InfoOutlinedIcon
                className={classes.infoIcon}
                color={"disabled"}
                fontSize={"default"}
              />
            </Grid>
            <Grid container item justify="center">
              <Typography gutterBottom variant={"h5"}>
                {message.headline}
              </Typography>
              {message.text}
            </Grid>
            {message.button ? (
              <Grid container item justify="center">
                <ContinueButton
                  style={{ width: "auto" }}
                  onClick={message.button.onClick}
                >
                  {message.button.text}
                </ContinueButton>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
      </Fade>
    );
  } else {
    return (
      <Fade in>
        <div>{children}</div>
      </Fade>
    );
  }
};
