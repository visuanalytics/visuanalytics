import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  content: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hintButton: {
      margin: "auto 10px",
      cursor: "pointer",
      color: "#d2d2d2",
    },
  })
);

export const HintButton: React.FC<Props> = ({ content }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      open={open}
      onOpen={() => setOpen(true)}
      onClick={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={content}
    >
      <div className={classes.hintButton}>
        <HelpIcon />
      </div>
    </Tooltip>
  );
};
