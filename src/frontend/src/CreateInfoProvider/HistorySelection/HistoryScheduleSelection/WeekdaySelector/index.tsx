import React from "react";
import { Weekday, getWeekdayLabel } from "../../../../util/schedule";
import Button from "@material-ui/core/Button";
import { useStyles } from "../../../style";

interface WeekdaySelectorProps {
  days?: number[];
  toggleSelectedDay: (dayNumber: number) => void;
}

/**
 * Component that renders the available weekdays for selection.
 * @param props The properties passed by the parent.
 */
export const WeekdaySelector: React.FC<WeekdaySelectorProps> = (props) => {
  const classes = useStyles();

  /**
   * Helper method that returns the ordinal/index of a provided weekday.
   * @param weekday That weekday whose ordinal should be returned.
   */
  const getDayIndex = (weekday: Weekday) => {
    switch (weekday) {
      case Weekday.MONDAY:
        return 0;
      case Weekday.TUESDAY:
        return 1;
      case Weekday.WEDNESDAY:
        return 2;
      case Weekday.THURSDAY:
        return 3;
      case Weekday.FRIDAY:
        return 4;
      case Weekday.SATURDAY:
        return 5;
      case Weekday.SUNDAY:
        return 6;
    }
  };

  //array containing constants for all weekdays
  const weekdays = [
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
    Weekday.SUNDAY,
  ];

  /**
   * Renders a button for the weekday.
   * @param weekday The weekday that should be rendered.
   */
  const renderWeekday = (weekday: Weekday) => {
    // TODO possibly switch to toggle buttons for better accessibility, but current solution is working too.
    return (
      <Button
        color="primary"
        key={getDayIndex(weekday)}
        variant="contained"
        size="small"
        className={props.days?.includes(weekday) ? classes.weekdaySelected : ""}
        onClick={() => props.toggleSelectedDay(weekday)}
        aria-label={
          props.days?.includes(weekday)
            ? getWeekdayLabel(weekday) + " ausgewählt"
            : getWeekdayLabel(weekday) + " nicht ausgewählt"
        }
      >
        {getWeekdayLabel(weekday)}
      </Button>
    );
  };

  //const components = React.useContext(ComponentContext);
  return <React.Fragment>{weekdays.map(renderWeekday)}</React.Fragment>;
};
