import React from 'react';
import { Param } from "../util/param";
import { JobItem } from "./JobItem";
import { Fade } from '@material-ui/core';
import { useFetchMultiple } from '../Hooks/useFetchMultiple';
import { Load } from "../util/Load"
import { Schedule } from '../util/schedule';

export interface Job {
    jobId: number;
    jobName: string;
    params: Param[];
    schedule: Schedule;
    topicId: number;
    topicName: string;
}

export const JobList: React.FC = () => {
    const [jobInfo, getJobs] = useFetchMultiple<Job[]>("/jobs");

    return (
        <Fade in={true}>
            <div>
                <Load data={jobInfo}>
                    {jobInfo?.map((j: Job) =>
                        <div key={j.jobId}>
                            <JobItem
                                job={j}
                                getJobs={getJobs}
                            />
                        </div>)
                    }
                </Load>
            </div>
        </Fade>
    )
}