import React from 'react';
import { Param } from "../util/param";
import { JobItem } from "./JobItem";
import { Fade } from '@material-ui/core';
import { useFetch } from '../Hooks/useFetch';
import {Schedule} from "../JobCreate";

export interface Job {
    jobId: number;
    jobName: string;
    params: Param[];
    schedule: Schedule;
    topicId: number;
    topicName: string;
}

export const JobList: React.FC = () => {
    const jobInfo: Job[] = useFetch("/jobs");

    /*
    const jobInfo: Job[] = [
        {
            "id": "1",
            "name": "BuLi aktuell",
            "topic": "Bundesliga-Ergebnisse",
            "schedule": "wöchentlich (mo), 18:00 Uhr",
            "next": "4d 9h 32min",
            "params": [
                {
                    "name": "Spieltag",
                    "selected": "aktuell",
                    "possibleValues": ["aktuell", "letzter", "vorletzter"]
                }
            ]
        },
        {
            "id": "2",
            "name": "Wetter DE",
            "topic": "Deutschlandweiter Wetterbericht",
            "schedule": "täglich, 08:00 Uhr",
            "next": "0d 3h 30min",
            "params": []
        },
    ]*/



    return (
        <Fade in={true}>
            <div>
                {jobInfo?.map(j =>
                    <div key={j.jobId}>
                        <JobItem
                            jobId={j.jobId}
                            jobName={j.jobName}
                            params={j.params}
                            schedule={j.schedule}
                            topicId={j.topicId}
                            topicName={j.topicName}
                        />
                    </div>)
                }
            </div>
        </Fade>
    )
}