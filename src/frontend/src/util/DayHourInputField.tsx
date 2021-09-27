import React from "react";
import { DayHour } from "./deleteSchedule";
import { Grid, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface DayHourInputProps {
  dayHour: DayHour | undefined;
  selectDayHourHandler: (dayHour: DayHour) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    centerDiv: {
      textAlign: "left",
      margin: "10px auto",
      width: 180,
    },
    inputFields: {
      borderBottom: "",
      width: "50%",
    },
    inputElement: {
      padding: "5px",
      mozAppearance: "textfield",
      appearance: "textfield",
      webkitAppearance: "none",
      margin: 0,
    },
    margin: {
      margin: "auto",
    },
  })
);

export const DayHourInputField: React.FC<DayHourInputProps> = ({
  dayHour,
  selectDayHourHandler,
}) => {
  const classes = useStyles();

  const handleAddDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() !== "" && dayHour !== undefined) {
      selectDayHourHandler({
        ...dayHour,
        days: Math.floor(Number(event.target.value)),
      });
    }
  };

  const handleAddHour = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() !== "" && dayHour !== undefined) {
      selectDayHourHandler({
        ...dayHour,
        hours: Math.floor(Number(event.target.value)),
      });
    }
  };

  const handleFocus = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.target.select();
  };

  return (
    <div style={{ margin: "10px" }}>
      <div className={classes.centerDiv}>
        <Grid item container spacing={4}>
          <Grid item container>
            <TextField
              className={classes.inputFields}
              onChange={handleAddDay}
              type={"number"}
              variant={"outlined"}
              onFocus={handleFocus}
              value={dayHour ? dayHour.days : 0}
              InputProps={{
                classes: { input: classes.inputElement },
                inputProps: { min: 0 },
              }}
            />
            <Typography className={classes.margin}>Tage</Typography>
          </Grid>
          <br />
          <Grid item container>
            <TextField
              className={classes.inputFields}
              onChange={handleAddHour}
              type={"number"}
              variant={"outlined"}
              onFocus={handleFocus}
              value={dayHour ? dayHour.hours : 0}
              InputProps={{
                classes: { input: classes.inputElement },
                inputProps: { min: 0, max: 23 },
              }}
            />
            <Typography className={classes.margin}>Stunden</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
