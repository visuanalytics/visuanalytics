import React, { useState, useCallback } from "react";
import { Param, ParamValues } from "../util/param";
import { JobItem } from "./JobItem";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Load } from "../Load";
import { Schedule } from "../util/schedule";
import { getUrl } from "../util/fetchUtils";
import {ComponentContext} from "../ComponentProvider";
import {DeleteSchedule} from "../util/deleteSchedule";
import { InfoMessage } from "../util/InfoMessage";
import { Typography } from "@material-ui/core";

export interface Job {
  jobId: number;
  jobName: string;
  params: Param[];
  values: ParamValues;
  schedule: Schedule;
  deleteSchedule: DeleteSchedule;
  topicId: number;
  topicName: string;
}

export const JobList: React.FC = () => {
  const components = React.useContext(ComponentContext);

  const [loadFailed, setLoadFailed] = useState(false);
  const handleLoadFailed = useCallback(() => {
    setLoadFailed(true);
  }, [setLoadFailed]);

  const [jobInfo, getJobs] = useFetchMultiple<Job[]>(
    getUrl("/jobs"),
    undefined,
    handleLoadFailed
  );

  const handleReaload = () => {
    setLoadFailed(false);
    getJobs();
  };

  return (
    <InfoMessage
      condition={jobInfo?.length === 0}
      message={{
        headline: "Willkommen bei ihrer Job Übersicht!",
        text: (
          <Typography align={"center"} color="textSecondary">
            Mit VisuAnalytics können Sie sich Videos zu bestimmten Themen
            generieren lassen.
            <br /> Klicken Sie auf 'Neuen Job erstellen', um Ihren ersten Job
            anzulegen und ein Video zu einem gewählten Zeitraum generieren zu
            lassen.
          </Typography>
        ),
        button: {
          text: "Neuen Job erstellen",
          onClick: () => components?.setCurrent("jobPage"),
        },
      }}
    >
      <Load
        failed={{
          hasFailed: loadFailed,
          name: "Jobs",
          onReload: handleReaload,
        }}
        data={jobInfo}
      >
        {jobInfo?.map((j: Job) => (
          <div key={j.jobId}>
            <JobItem job={j} getJobs={handleReaload} />
          </div>
        ))}
      </Load>
    </InfoMessage>
  );
};
