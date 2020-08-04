import React from "react";
import { Progress } from "./Progress";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { useStyles } from "../Home/style";
import { Grid, Typography } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

interface FailedProps {
  hasFailed: boolean;
  name: string;
  onReload: () => void;
}

interface Props {
  data: any | undefined;
  failed?: FailedProps;
  className?: string;
}

export const Load: React.FC<Props> = ({
  children,
  data,
  failed,
  className,
}) => {
  const classes = useStyles();

  const onFail = () => {
    return (
      <Grid container spacing={2}>
        <Grid container item justify="center">
          <ReportProblemOutlinedIcon
            className={classes.waringIcon}
            fontSize={"default"}
          />
        </Grid>
        <Grid container item justify="center">
          <Typography gutterBottom variant={"h5"}>
            {failed?.name} konnten nicht geladen werden!
          </Typography>
          <Typography align={"center"} color="textSecondary">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et
          </Typography>
        </Grid>
        <Grid container item justify="center">
          <ContinueButton style={{ width: "auto" }} onClick={failed?.onReload}>
            erneut versuchen
          </ContinueButton>
        </Grid>
      </Grid>
    );
  };

  const onLoad = () => {
    return data ? children : <Progress />;
  };

  return (
    <div className={className}>{failed?.hasFailed ? onFail() : onLoad()}</div>
  );
};
