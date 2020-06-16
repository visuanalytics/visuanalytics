import React from 'react';
import {Param} from "../util/param";
import {JobItem} from "./JobItem";

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
            "name": "Wetter Gießen",
            "topic": "Wetter",
            "schedule": "wöchentlich",
            "next": "0d 21h 32min",
            "params": [
                {
                    "name": "Vorhersage",
                    "selected": "2+3",
                    "possibleValues": ["2", "2+3"]
                }
            ]
        },
        {
            "id": "2",
            "name": "Wetter DE",
            "topic": "Wetter",
            "schedule": "täglich",
            "next": "0d 21h 32min",
            "params": [
                {
                    "name": "Vorhersage",
                    "selected": "2+3",
                    "possibleValues": ["2", "2+3"]
                }
            ]
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