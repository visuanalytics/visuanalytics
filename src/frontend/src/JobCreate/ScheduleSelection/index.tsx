import React from "react";
import { useStyles } from "../style";
import {
  Collapse,
  Divider,
  Fade,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { WeekdayCheckboxes } from "./WeekdayCheckboxes";
import { DateInputField, TimeInputField } from "./DateTimeInput";
import { Schedule, TimeInterval, Weekday } from "../../util/schedule";
import { IntervalCheckboxes } from "./IntervalCheckboxes";

interface ScheduleSelectionProps {
  schedule: Schedule;
  selectScheduleHandler: (schedule: Schedule) => void;
}

export const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({
  schedule,
  selectScheduleHandler,
}) => {
  const classes = useStyles();
  const time = schedule.type !== "interval" ? schedule.time : new Date();

  const handleSelectDaily = () => {
    selectScheduleHandler({ type: "daily", time: time });
  };
  const handleSelectWeekly = () => {
    selectScheduleHandler({ type: "weekly", time: time, weekdays: [] });
  };
  const handleSelectInterval = () => {
    selectScheduleHandler({
      type: "interval",
      interval: "minute",
      nextExecution: new Date(),
    });
  };
  const handleSelectOnDate = () => {
    selectScheduleHandler({ type: "onDate", time: time, date: new Date() });
  };
  const handleAddWeekDay = (d: Weekday) => {
    if (schedule.type === "weekly") {
      const weekdays = [...schedule.weekdays, d];
      selectScheduleHandler({ ...schedule, weekdays: weekdays });
    }
  };
  const handleRemoveWeekday = (d: Weekday) => {
    if (schedule.type === "weekly") {
      const weekdays: Weekday[] = schedule.weekdays.filter((e) => e !== d);
      selectScheduleHandler({ ...schedule, weekdays: weekdays });
    }
  };
  const handleInterval = (i: TimeInterval) => {
    if (schedule.type === "interval") {
      selectScheduleHandler({ ...schedule, interval: i });
    }
  };
  const handleSelectDate = (date: Date | null) => {
    if (date !== null && schedule.type === "onDate") {
      selectScheduleHandler({ ...schedule, date: date });
    }
  };
  const handleSelectTime = (time: Date | null) => {
    if (time !== null && schedule.type !== "interval") {
      selectScheduleHandler({ ...schedule, time: time });
    }
  };

  return (
    <Fade in={true}>
      <div>
        <div className={classes.MPaddingTB}>
          <div className={classes.centerDiv}>
            <FormControlLabel
              value="daily"
              control={
                <Radio
                  checked={schedule.type === "daily"}
                  onChange={handleSelectDaily}
                  value="daily"
                />
              }
              label="täglich"
            />
          </div>
        </div>
        <Divider />
        <div className={classes.MPaddingTB}>
          <div className={classes.centerDiv}>
            <FormControlLabel
              value="weekly"
              control={
                <Radio
                  checked={schedule.type === "weekly"}
                  onChange={handleSelectWeekly}
                  value="weekly"
                />
              }
              label="wöchentlich"
            />
          </div>
          <Collapse in={schedule.type === "weekly"}>
            <div>
              <WeekdayCheckboxes
                schedule={schedule}
                addWeekDayHandler={handleAddWeekDay}
                removeWeekDayHandler={handleRemoveWeekday}
              />
            </div>
          </Collapse>
        </div>
        <Divider />
        <div className={classes.MPaddingTB}>
          <div className={classes.centerDiv}>
            <FormControlLabel
              value="interval"
              control={
                <Radio
                  checked={schedule.type === "interval"}
                  onChange={handleSelectInterval}
                  value="interval"
                />
              }
              label="Intervall"
            />
          </div>
          <Collapse in={schedule.type === "interval"}>
            <div>
              <IntervalCheckboxes
                schedule={schedule}
                intervalHandler={handleInterval}
              />
            </div>
          </Collapse>
        </div>
        <Divider />
        <div className={classes.MPaddingTB}>
          <div className={classes.centerDiv}>
            <FormControlLabel
              value="onDate"
              control={
                <Radio
                  checked={schedule.type === "onDate"}
                  onChange={handleSelectOnDate}
                  value="onDate"
                />
              }
              label="an festem Datum"
            />
          </div>
          <Collapse in={schedule.type === "onDate"}>
            <DateInputField
              date={schedule.type === "onDate" ? schedule.date : null}
              handler={handleSelectDate}
            />
          </Collapse>
        </div>
        <Divider />
        <div className={classes.MPaddingTB}>
          <TimeInputField
            date={schedule.type !== "interval" ? time : new Date()}
            disabled={schedule.type === "interval"}
            handler={handleSelectTime}
          />
        </div>
      </div>
    </Fade>
  );
};
