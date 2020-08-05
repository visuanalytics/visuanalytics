import React, { useState, useCallback } from "react";
import { Param, ParamValues } from "../util/param";
import { JobItem } from "./JobItem";
import { Fade } from "@material-ui/core";
import { useFetchMultiple } from "../Hooks/useFetchMultiple";
import { Load } from "../Load";
import { Schedule } from "../util/schedule";
import { getUrl } from "../util/fetchUtils";

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
    <Fade in={true}>
      <div>
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
      </div>
    </Fade>
  );
};
