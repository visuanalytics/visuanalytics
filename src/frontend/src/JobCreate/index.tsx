import React, {useEffect} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {useStyles} from './style';
import {ContinueButton} from './ContinueButton';
import {BackButton} from './BackButton';
import {ParamSelection} from './ParamSelection';
import {TopicSelection} from './TopicSelection';
import {ScheduleSelection} from './ScheduleSelection';
import {GreyDivider} from './GreyDivider';
import {Param} from '../util/param';
import {Fade} from '@material-ui/core';
import {useCallFetch} from '../Hooks/useCallFetch';
import {format} from "date-fns";

export enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

export interface Schedule {
    daily: boolean,
    weekly: boolean,
    onDate: boolean,
    weekdays: Weekday[],
    date: Date | null,
    time: Date | null
}

export default function JobCreate() {
    const classes = useStyles();

    // states for stepper logic
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    // states for topic selection logic
    const [selectedTopicId, setSelectedTopicId] = React.useState(-1);
    const [jobName, setJobName] = React.useState("");

    // state for param selection logic
    const [selectedParams, setSelectedParams] = React.useState<Param[]>([]);

    // state for schedule selection logic
    const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule>({
        daily: true,
        weekly: false,
        onDate: false,
        weekdays: [],
        date: new Date(),
        time: new Date()
    });

    // initialize callback for add job functionality
    const addJob = useCallFetch("/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topicId: selectedTopicId,
            jobName: jobName,
            params: selectedParams,
            schedule: {
                daily: selectedSchedule.daily,
                weekly: selectedSchedule.weekly,
                onDate: selectedSchedule.onDate,
                time: selectedSchedule.time?.toLocaleTimeString("de-DE").slice(0, -3),
                weekdays: selectedSchedule.weekdays,
                date: selectedSchedule.onDate && selectedSchedule.date ? format(selectedSchedule.date, "yyyy-MM-dd") : null
            }
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
            const allSet = selectedTopicId !== -1 && jobName.trim() !== "";
            setSelectComplete(allSet);
        }
    }, [selectedTopicId, jobName, activeStep])

    // when a new parameter is selected, check if parameter selection is complete 
    useEffect(() => {
        if (activeStep === 1) {
            const allSet = validateParams(selectedParams);
            setSelectComplete(allSet);
        }
    }, [selectedParams, activeStep])

    // when a weekly schedule is selected, check if at least one weekday checkbox is checked
    useEffect(() => {
        if (activeStep === 2 && selectedSchedule.weekly) {
            setSelectComplete(selectedSchedule.weekdays.length > 0);
        }
    }, [selectedSchedule, activeStep])

    // handlers for stepper logic
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // handlers for topic selection logic
    const handleSelectTopic = (topicId: number) => {
        setSelectedTopicId(topicId);
    }

    const handleFetchParams = (params: Param[]) => {
        const params2: Param[] = [
            {
                name: "city_name",
                displayName: "Ort",
                type: "string",
                optional: false,
                selected: "",
                defaultValue: "",
                possibleValues: null,
                subParams: null
            },
            {
                name: "p_code",
                displayName: "PLZ",
                type: "number",
                optional: true,
                selected: "",
                possibleValues: null,
                defaultValue: "",
                subParams: null
            },
            {
                name: "twitter",
                displayName: "Twitter-Wordcloud generieren",
                type: "sub_params",
                optional: true,
                selected: false,
                possibleValues: null,
                defaultValue: "",
                subParams: [
                    {
                        name: "banned",
                        displayName: "Verbotene Wörter",
                        type: "multi-string",
                        optional: false,
                        selected: [],
                        possibleValues: null,
                        defaultValue: "",
                        subParams: null
                    },
                    {
                        name: "hashtags",
                        displayName: "Hashtags",
                        type: "multi-string",
                        optional: false,
                        selected: [],
                        possibleValues: null,
                        defaultValue: "",
                        subParams: null
                    }
                ]
            },
            {
                name: "read",
                displayName: "Welche Angaben sollen explizit im Video genannt werden?",
                type: "sub_params",
                optional: false,
                selected: false,
                possibleValues: null,
                defaultValue: "",
                subParams: [
                    {
                        name: "windspeed",
                        displayName: "Windgeschwindigkeit",
                        type: "boolean",
                        optional: false,
                        selected: false,
                        possibleValues: null,
                        defaultValue: "",
                        subParams: null
                    },
                    {
                        name: "temp",
                        displayName: "Temperatur",
                        type: "boolean",
                        optional: false,
                        selected: false,
                        possibleValues: null,
                        defaultValue: "",
                        subParams: null
                    }
                ]
            },

            {
                name: "bla",
                displayName: "Bla",
                type: "enum",
                optional: true,
                defaultValue: "hallo",
                selected: "",
                subParams: null,
                possibleValues: [
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
        setSelectedParams(params2);
    }

    const handleEnterJobName = (jobName: string) => {
        setJobName(jobName);
    }

    // handler for param selection logic
    const handleSelectParam = (key: string, value: any) => {
        const newList = updateSelected(selectedParams, key, value);
        setSelectedParams(newList);
    }

    // handler for schedule selection logic
    const handleSelectDaily = () => {
        setSelectedSchedule({...selectedSchedule, daily: true, weekly: false, onDate: false, weekdays: [],})
    }
    const handleSelectWeekly = () => {
        setSelectedSchedule({...selectedSchedule, daily: false, weekly: true, onDate: false, weekdays: [],})
    }
    const handleSelectOnDate = () => {
        setSelectedSchedule({...selectedSchedule, daily: false, weekly: false, onDate: true, weekdays: [],})
    }
    const handleAddWeekDay = (d: Weekday) => {
        const weekdays: Weekday[] = [...selectedSchedule.weekdays, d];
        setSelectedSchedule({...selectedSchedule, weekdays: weekdays});
    }
    const handleRemoveWeekday = (d: Weekday) => {
        const weekdays: Weekday[] = selectedSchedule.weekdays.filter(e => e !== d);
        setSelectedSchedule({...selectedSchedule, weekdays: weekdays});
    }
    const handleSelectDate = (date: Date | null) => {
        setSelectedSchedule({...selectedSchedule, date: date})
    }
    const handleSelectTime = (time: Date | null) => {
        setSelectedSchedule({...selectedSchedule, time: time})
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
                        selectedTopicId={selectedTopicId}
                        jobName={jobName}
                        selectTopicHandler={handleSelectTopic}
                        enterJobNameHandler={handleEnterJobName}/>
                );
            case 1:
                return (
                    <ParamSelection
                        topicId={selectedTopicId}
                        params={selectedParams}
                        fetchParamHandler={handleFetchParams}
                        selectParamHandler={handleSelectParam}/>
                )
            case 2:
                return (
                    <ScheduleSelection
                        schedule={selectedSchedule}
                        selectDailyHandler={handleSelectDaily}
                        selectWeeklyHandler={handleSelectWeekly}
                        selectOnDateHandler={handleSelectOnDate}
                        addWeekDayHandler={handleAddWeekDay}
                        removeWeekDayHandler={handleRemoveWeekday}
                        selectDateHandler={handleSelectDate}
                        selectTimeHandler={handleSelectTime}
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
                        <GreyDivider/>
                        {getSelectPanel(activeStep)}
                        <GreyDivider/>
                        <div className={classes.paddingSmall}>
                            <span>
                                <BackButton onClick={handleBack} style={{marginRight: 20}} disabled={activeStep <= 0}>
                                    {"Zurück"}
                                </BackButton>
                                <ContinueButton onClick={handleNext} style={{marginLeft: 20}}
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


// validate selected params
const validateParams = (params: Param[]): boolean => {
    console.log(trimAllSelected(params));
    return params?.every(p => {
        switch (p.type) {
            case "sub_params":
                if ((p.optional && p.selected) || !p.optional) {
                    return p.subParams === null ? true : validateParams(p.subParams);
                }
                break;
            case "string":
            case "number":
                if (!p.optional) {
                    return p.selected.trim() !== "";
                }
                break;
            case "multi-string":
            case "multi-number":
                if (!p.optional) {
                    return p.selected.map((v: string) => v.trim()).filter((v: string) => v !== "").length > 0;
                }
                break;
        }
        return true;
    })
}


// update selected value in a list of parameters
const updateSelected = (params: Param[], key: string, value: any): Param[] => {
    return params.map(p => {
        if (p.name === key) {
            return {...p, selected: value};
        }
        if (p.type === "sub_params" && p.subParams !== null) {
            const subParams = updateSelected(p.subParams, key, value);
            return {...p, subParams: subParams};
        }
        return p;
    })
}

const trimAllSelected = (params: Param[]): Param[] => {
    return params.map(p => {
        switch (p.type) {
            case "string":
            case "number":
                return {...p, selected: p.selected.trim()};
            case "multi-string":
            case "multi-number":
                return {...p, selected: p.selected.map((v: string) => v.trim()).filter((v: string) => v !== "")};
            case "sub_params":
                if (p.subParams !== null) {
                    const subParams = trimAllSelected(p.subParams);
                    return {...p, subParams: subParams};
                }
                return p;
            default:
                return p;
        }
    })
}