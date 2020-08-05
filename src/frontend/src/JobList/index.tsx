import React from 'react';
import { Param, ParamValues } from "../util/param";
import { JobItem } from "./JobItem";
import {Fade, Grid, Paper, Typography} from '@material-ui/core';
import { useFetchMultiple } from '../Hooks/useFetchMultiple';
import { Load } from "../util/Load"
import { Schedule } from '../util/schedule';
import { getUrl } from '../util/fetchUtils';
import {useStyles} from "../Home/style";
import {ContinueButton} from "../JobCreate/ContinueButton";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {ComponentContext} from "../ComponentProvider";

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
    const [jobInfo, getJobs] = useFetchMultiple<Job[]>(getUrl("/jobs"));
    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    if (jobInfo?.length === 0) {
        return (
            <Fade in={true}>
                <Paper variant="outlined" className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid container item justify="center">
                            <InfoOutlinedIcon
                                className={classes.infoIcon}
                                color={"disabled"}
                                fontSize={"default"}
                            />
                        </Grid>
                        <Grid container item justify="center">
                            <Typography gutterBottom variant={"h5"}>
                                Willkommen bei ihrer Job Übersicht!
                            </Typography>
                            <Typography align={"center"}>
                                Mit VisuAnalytics können Sie sich Videos zu bestimmten Themen generieren lassen.<br/> Klicken Sie auf 'Neuen Job erstellen', um Ihren ersten Job anzulegen und ein Video zu einem gewählten Zeitraum generieren zu lassen.
                            </Typography>
                        </Grid>
                        <Grid container item justify="center">
                            <ContinueButton style={{width: "auto"}} onClick={() => components?.setCurrent("jobpage")}>Neuen Job erstellen</ContinueButton>
                        </Grid>
                    </Grid>
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