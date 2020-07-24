import React from 'react';
import { Param } from "../util/param";
import { JobItem } from "./JobItem";
import {Fade, Paper, Typography} from '@material-ui/core';
import { useFetchMultiple } from '../Hooks/useFetchMultiple';
import {Schedule} from "../JobCreate";
import {Load} from "../util/Load"
import { getUrl } from '../util/fetchUtils';
import {useStyles} from "../Home/style";

export interface Job {
    jobId: number;
    jobName: string;
    params: Param[];
    schedule: Schedule;
    topicId: number;
    topicName: string;
}

export const JobList: React.FC = () => {
    const classes = useStyles();
    const [jobInfo, getJobs] = useFetchMultiple<Job []>(getUrl("/jobs"));

    if (jobInfo?.length == 0) {
        return (
            <Fade in={true}>
                <Paper variant="outlined" className={classes.paper}>
                    <div style={{textAlign: "center"}}>keine Jobs vorhanden</div>
                </Paper>
            </Fade>
        )
    } else {
        return (
            <Fade in={true}>
                <div>
                    <Load data={jobInfo}>
                        {jobInfo?.map((j : Job) =>
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
}