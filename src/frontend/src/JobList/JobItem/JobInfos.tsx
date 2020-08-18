import React from "react";
import { useStyles } from "../style";
import { TextField } from "@material-ui/core";
import { Job } from "..";
import { fromFormattedDates, showSchedule } from "../../util/schedule";

interface Props {
  job: Job;
  next: string;
}

export const JobInfos: React.FC<Props> = ({ job, next }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.SPaddingTRB}>
        <TextField
          label="Thema"
          defaultValue={String(job.topicValues.map((t: any) => t.topicName))
            .split(",")
            .join(", ")}
          InputProps={{
            disabled: true,
          }}
          multiline
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={classes.SPaddingTRB}>
        <TextField
          label="Zeitplan"
          value={showSchedule(fromFormattedDates(job.schedule))}
          InputProps={{
            disabled: true,
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div></div>
      <div className={classes.SPaddingTRB}>
        <TextField
          label="nächstes Video"
          value={next}
          InputProps={{
            disabled: true,
          }}
          variant="outlined"
          fullWidth
        />
      </div>
    </div>
  );
};
