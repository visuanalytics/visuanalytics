import React from 'react';
import { Param } from "../util/param";
import { JobItem } from "./JobItem";

export interface Job {
    id: string;
    name: string;
    topic: string;
    schedule: string; //Datentyp?
    next: string; //Datentyp?
    params: Param[];
}

export const JobList: React.FC = () => {
    // const jobInfo: Job[] = useFetch("/jobs");

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
    ]



    return (
        <>
            {jobInfo.map(j =>
                <div key={j.id}>
                    <JobItem
                        id={j.id}
                        name={j.name}
                        topic={j.topic}
                        schedule={j.schedule}
                        next={j.next}
                        params={j.params}
                    />
                </div>)
            }
        </>
    )

}