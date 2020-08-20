import React, { useState, useCallback } from "react";
import { Param, ParamValues } from "../util/param";
import { JobItem } from "./JobItem";
import { Typography } from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Load } from "../Load";
import { Schedule } from "../util/schedule";
import { getUrl } from "../util/fetchUtils";
import { ComponentContext } from "../ComponentProvider";
import { DeleteSchedule } from "../util/deleteSchedule";
import { InfoMessage } from "../util/InfoMessage";
import { Notification, notifcationReducer } from "../util/Notification";

export interface Job {
  jobId: number;
  jobName: string;
  topicValues: [
    {
      topicName: string;
      topicId: number;
      params: Param[];
      values: ParamValues;
    }
  ];
  schedule: Schedule;
  deleteSchedule: DeleteSchedule;
}

export const JobList: React.FC = () => {
  const components = React.useContext(ComponentContext);

  const [message, dispatchMessage] = React.useReducer(notifcationReducer, {
    open: false,
    message: "",
    severity: "success",
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
    dispatchMessage({ type: "reportSuccess", message: message });
  };

  const handleReportError = (message: string) => {
    dispatchMessage({ type: "reportError", message: message });
  };

  return (
    <>
      <InfoMessage
            condition={jobInfo?.length === 0}
            message={{
                headline: "Willkommen bei Ihrer Job-Übersicht!",
          text: (
            <Typography align={"center"} color="textSecondary">
              Mit VisuAnalytics können Sie sich Videos zu verschiedenen Themen
                        generieren lassen.
                        <br /> Klicken Sie auf 'Job erstellen', um einen Job
                        anzulegen, welcher ein Video nach einem gewählten Zeitplan generiert.
            </Typography>
          ),
          button: {
            text: "Job erstellen",
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
            </Load>
      </InfoMessage>
      <Notification
          handleClose={() => dispatchMessage({ type: "close" })}
          open={message.open}
          message={message.message}
          severity={message.severity}
      />
    </>
  );
};
