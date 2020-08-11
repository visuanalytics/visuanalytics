import React, { useState, useCallback } from "react";
import { Param, ParamValues } from "../util/param";
import { JobItem } from "./JobItem";
import {Fade, Grid, Paper, Typography} from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Load } from "../Load";
import { Schedule } from "../util/schedule";
import { getUrl } from "../util/fetchUtils";
import { ComponentContext } from "../ComponentProvider";
import { InfoMessage } from "../util/InfoMessage";
import { Notification, notifcationReducer } from "../util/Notification";

export interface Job {
  jobId: number;
  jobName: string;
  params: Param[];
  values: ParamValues;
  schedule: Schedule;
  topicId: number;
  topicName: string;
}

export const JobList: React.FC = () => {
  const components = React.useContext(ComponentContext);

  const [message, dispatchMessage] = React.useReducer(notifcationReducer, {
    open: false,
    message: "",
    type: "success"
});

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

  const handleReportSuccess = (message: string) => {
    dispatchMessage({type: "reportSuccess", message: message})
  }

  const handleReportError = (message: string) => {
    dispatchMessage({type: "reportError", message: message})
  }

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
                   <JobItem
                      job={j}
                       getJobs={handleReaload}
                       reportError={handleReportError}
                       reportSuccess={handleReportSuccess}
                   />
              </div>
        ))}
        <Notification handleClose={() => dispatchMessage({ type: "close" })} open={message.open} message={message.message}
                            type={message.type}/>
      </Load>
    </InfoMessage>
  );
};
