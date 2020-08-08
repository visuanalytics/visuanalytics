import React from "react";
import { Progress } from "../util/Progress";
import { ContinueButton } from "../JobCreate/ContinueButton";
import { useStyles } from "./style";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

export interface LoadFailedProps {
  hasFailed: boolean;
  name: string;
  onReload: () => void;
}

interface Props {
  data: any | undefined;
  failed?: LoadFailedProps;
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
    const solutions = [
      "Es später nochmal Versuchen",
      "Netzwerkverbindung  überprüfen",
    ];

    return (
      <Grid container>
        <Grid container item justify="center">
          <ReportProblemOutlinedIcon
            className={classes.waringIcon}
            fontSize="default"
          />
        </Grid>
        <Grid container item justify="center">
          <Typography gutterBottom variant="h5">
            {failed?.name} konnten nicht geladen werden!
          </Typography>
        </Grid>
        <Grid container item justify="center">
          <div className={classes.text}>
            <Typography variant="subtitle1" color="textSecondary">
              Mögliche Lösungen:
            </Typography>
            <List dense>
              {solutions.map((s, idx) => (
                <ListItem key={idx} className={classes.listItem}>
                  <ListItemIcon className={classes.listBulletItem}>
                    <ArrowRightIcon className={classes.listBulletIcon} />
                  </ListItemIcon>
                  <ListItemText secondary={s} />
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
        <Grid container item justify="center">
          <ContinueButton
            size="small"
            style={{ width: "auto" }}
            onClick={failed?.onReload}
          >
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
