import React, { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useStyles } from './style';
import { ContinueButton } from './ContinueButton';
import { BackButton } from './BackButton';
import { ParamSelection } from './ParamSelection';
import { TopicSelection } from './TopicSelection';
import { ScheduleSelection } from './ScheduleSelection';
import { GreyDivider } from './GreyDivider';
import { Param, ParamValues, trimParamValues, validateParamValues, initSelectedValues } from '../util/param';
import { Fade } from '@material-ui/core';
import { useCallFetch } from '../Hooks/useCallFetch';
import { Schedule, Weekday } from '../util/schedule';
import { getUrl } from '../util/fetchUtils';


/*
export enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

export interface Schedule {
    daily: boolean,
    weekly: boolean,
    onDate: boolean,
    weekdays: Weekday[],
    date: Date | null,
    time: Date
}
*/

export default function JobCreate() {
    const classes = useStyles();

    // states for stepper logic
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    // states for topic selection logic
    const [topicId, setTopicId] = React.useState(-1);
    const [jobName, setJobName] = React.useState("");

    // state for param selection logic
    const [paramList, setParamList] = React.useState<Param[]>([]);
    const [paramValues, setParamValues] = React.useState<ParamValues>({});

    // state for schedule selection logic
    const [schedule, setSchedule] = React.useState<Schedule>({
        type: "daily",
        time: new Date()
    });

    // initialize callback for add job functionality
    const addJob = useCallFetch(getUrl("/add"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topicId: topicId,
            jobName: jobName,
            params: trimParamValues(paramValues),
            /*
            schedule: {
                daily: schedule.daily,
                weekly: schedule.weekly,
                onDate: schedule.onDate,
                time: schedule.time?.toLocaleTimeString("de-DE").slice(0, -3),
                weekdays: schedule.weekdays,
                date: schedule.onDate && schedule.date ? format(schedule.date, "yyyy-MM-dd") : null
            }
            */
        })
    });

    useEffect(() => {
        if (activeStep === 3) {
            setActiveStep(4);
            setFinished(true);
            addJob();
        }
    }, [activeStep, addJob])

    // when a new topic or job name is selected, check if topic selection is complete
    useEffect(() => {
        if (activeStep === 0) {
            const allSet = topicId !== -1 && jobName.trim() !== "";
            setSelectComplete(allSet);
        }
    }, [topicId, jobName, activeStep])

    // when a new parameter value is entered, check if parameter selection is complete
    useEffect(() => {
        if (activeStep === 1) {
            const allSet = validateParamValues(paramList, paramValues);
            setSelectComplete(allSet);
        }
    }, [paramList, paramValues, activeStep])

    // when a weekly schedule is selected, check if at least one weekday checkbox is checked
    useEffect(() => {
        if (activeStep === 2) {
            const allSet = schedule.type !== "weekly" || (schedule.type === "weekly" && schedule.weekdays.length > 0);
            setSelectComplete(allSet);
        }
    }, [schedule, activeStep])

    // handlers for stepper logic
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // handlers for topic selection logic
    const handleSelectTopic = (topicId: number) => {
        setTopicId(topicId);
    }

    const handleEnterJobName = (jobName: string) => {
        setJobName(jobName);
    }

    const handleFetchParams = (params: Param[]) => {
        const params2: Param[] = [
            {
                name: "city_name",
                displayName: "Ort",
                type: "string",
                optional: false,
            },
            {
                name: "p_code",
                displayName: "PLZ",
                type: "number",
                optional: true,
            },
            {
                name: "twitter",
                displayName: "Twitter-Wordcloud generieren",
                type: "subParams",
                optional: true,
                subParams: [
                    {
                        name: "banned",
                        displayName: "Verbotene Wörter",
                        type: "multiString",
                        optional: false,
                    },
                    {
                        name: "hashtags",
                        displayName: "Hashtags",
                        type: "multiString",
                        optional: false,
                    }
                ]
            },
            {
                name: "read",
                displayName: "Welche Angaben sollen explizit im Video genannt werden?",
                type: "subParams",
                optional: false,
                subParams: [
                    {
                        name: "windspeed",
                        displayName: "Windgeschwindigkeit",
                        type: "boolean",
                        optional: false,
                    },
                    {
                        name: "temp",
                        displayName: "Temperatur",
                        type: "boolean",
                        optional: false,
                    }
                ]
            },

            {
                name: "bla",
                displayName: "Bla",
                type: "enum",
                optional: true,
                enumValues: [
                    {
                        value: "hallo",
                        displayValue: "Hallo"
                    },
                    {
                        value: "hola",
                        displayValue: "Hola"
                    }
                ]
            }
        ]
        setParamList(params2);
        setParamValues(initSelectedValues(params2));
    }

    // handler for param selection logic
    const handleSelectParam = (key: string, value: any) => {
        const updated = { ...paramValues }
        updated[key] = value;
        setParamValues(updated);
    }

    // handler for schedule selection logic
    const handleSelectSchedule = (schedule: Schedule) => {
        setSchedule(schedule);
    }

    // stepper texts
    const steps = [
        "Thema auswählen",
        "Parameter festlegen",
        "Zeitplan auswählen"
    ];
    const descriptions = [
        "Zu welchem Thema sollen Videos generiert werden?",
        "Parameter auswählen für: '" + jobName + "'",
        "Wann sollen neue Videos generiert werden?"
    ];

    // based on active step, render specific selection panel
    const getSelectPanel = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <TopicSelection
                        fetchParamHandler={handleFetchParams}
                        topicId={topicId}
                        jobName={jobName}
                        selectTopicHandler={handleSelectTopic}
                        enterJobNameHandler={handleEnterJobName} />
                );
            case 1:
                return (
                    <ParamSelection
                        topicId={topicId}
                        values={paramValues}
                        params={paramList}
                        fetchParamHandler={handleFetchParams}
                        selectParamHandler={handleSelectParam} />
                )
            case 2:
                return (
                    <ScheduleSelection
                        schedule={schedule}
                        selectScheduleHandler={handleSelectSchedule}
                    />
                )
            default:
                return "";
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <div className={classes.jobCreateBox}>
                {!finished
                    ?
                    <div>
                        <div>
                            <h3 className={classes.jobCreateHeader}>{descriptions[activeStep]}</h3>
                        </div>
                        <GreyDivider />
                        {getSelectPanel(activeStep)}
                        <GreyDivider />
                        <div className={classes.paddingSmall}>
                            <span>
                                <BackButton onClick={handleBack} style={{ marginRight: 20 }} disabled={activeStep <= 0}>
                                    {"Zurück"}
                                </BackButton>
                                <ContinueButton onClick={handleNext} style={{ marginLeft: 20 }}
                                    disabled={!selectComplete}>
                                    {activeStep < steps.length - 1 ? "WEITER" : "ERSTELLEN"}
                                </ContinueButton>
                            </span>
                        </div>
                    </div>
                    :
                    <Fade in={true}>
                        <div className={classes.paddingSmall}>
                            Job '{jobName}' wurde erstellt!
                        </div>
                    </Fade>
                }
            </div>
        </div>
    );
}