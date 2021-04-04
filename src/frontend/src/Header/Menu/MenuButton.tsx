import React from "react";
import {
  Tooltip,
  IconButton,
  IconButtonProps,
  createStyles,
  makeStyles,
  Theme,
  Grid,
} from "@material-ui/core";

interface Props {
  iconButtonProps: IconButtonProps;
  title: string;
  icon: JSX.Element;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "whitesmoke",
      borderRadius: "20px",
    },
    icon: {},
  })
);

export const MenuButton: React.FC<Props> = ({
  iconButtonProps,
  title,
  icon,
}) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Tooltip title={title}>
        <IconButton size="small" className={classes.root} {...iconButtonProps}>
          {icon}
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
