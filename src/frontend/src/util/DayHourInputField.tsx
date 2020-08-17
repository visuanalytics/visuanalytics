import React from "react";
import { DayHour } from "./deleteSchedule";
import { Grid, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface DayHourInputProps {
  dayHour: DayHour;
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
    selectDayHourHandler({ ...dayHour, days: Number(event.target.value) });
  };

  const handleAddHour = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectDayHourHandler({ ...dayHour, hours: Number(event.target.value) });
  };

  return (
    <div style={{ margin: "10px" }}>
      <div className={classes.centerDiv}>
        <Grid container spacing={4}>
          <Grid container>
            <TextField
              className={classes.inputFields}
              onChange={handleAddDay}
              type={"number"}
              variant={"outlined"}
              InputProps={{
                classes: { input: classes.inputElement },
                inputProps: { min: 0 },
              }}
            />
            <Typography className={classes.margin}>Tage</Typography>
          </Grid>
          <br />
          <Grid container>
            <TextField
              className={classes.inputFields}
              onChange={handleAddHour}
              type={"number"}
              variant={"outlined"}
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
