import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { getIntervalLabel, Schedule, TimeInterval } from "../../util/schedule";

interface IntervalCheckboxProps {
  schedule: Schedule;
  intervalHandler: (interval: TimeInterval) => void;
}

export const IntervalCheckboxes: React.FC<IntervalCheckboxProps> = (props) => {
  const schedule = props.schedule;
  const intervals: TimeInterval[] = [
    "minute",
    "quarter",
    "half",
    "threequarter",
    "hour",
    "quartday",
    "halfday",
  ];

  const renderCheckBox = (interval: TimeInterval) => {
    return (
      <FormControlLabel
        key={interval}
        control={
          <Radio
            checked={
              schedule.type === "interval" && schedule.interval === interval
            }
            value={interval}
            onChange={handleChange}
          />
        }
        label={getIntervalLabel(interval)}
        labelPlacement="top"
      />
    );
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const interval = event.target.value as TimeInterval;
    props.intervalHandler(interval);
  };

  return (
    <div>
      <FormControl component="fieldset">
        <RadioGroup row>{intervals.map(renderCheckBox)}</RadioGroup>
      </FormControl>
    </div>
  );
};
