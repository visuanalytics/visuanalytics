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
import { Param } from '../util/param';
import { Fade } from '@material-ui/core';
import {DeleteSelection} from "./DeleteSelection";
import {ComponentContext} from "../ComponentProvider";

export enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

export interface Schedule {
    daily: boolean,
    weekly: boolean,
    onDate: boolean,
    weekdays: Weekday[],
    date: Date | null,
    time: Date | null,
    delete: boolean,
    onTime: boolean,
    delete_old_on_new: boolean,
    removal_time: Date | null
}

export default function JobCreate() {
    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    const [counter, setCounter] = React.useState(5);
    // states for stepper logic
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    // states for topic selection logic
    const [selectedTopic, setSelectedTopic] = React.useState("");
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
        time: new Date(),
        delete: false,
        delete_old_on_new: false,
        onTime: false,
        removal_time: new Date()
    });

    useEffect(() => {
        if (activeStep === 4) {
            setFinished(true);
        }
    }, [activeStep])

    // when selected topic changes, fetch new parameter list
    useEffect(() => {
        // const topics: string[] = useFetch("/topics");
        const params: Param[] = [
            {
                name: "Ort",
                possibleValues: [],
                selected: ""
            },
            {
                name: "Postleitzahl",
                possibleValues: [],
                selected: ""
            }
        ]
        setSelectedParams(params);
    }, [selectedTopic])

    // when a new topic or job name is selected, check if topic selection is complete
    useEffect(() => {
        if (activeStep === 0) {
            const allSet = selectedTopic !== "" && jobName.trim() !== "";
            setSelectComplete(allSet ? true : false);
        }
    }, [selectedTopic, jobName, activeStep])

    // when a new parameter is selected, check if parameter selection is complete 
    useEffect(() => {
        if (activeStep === 1) {
            const allSet = selectedParams.every(p => p.selected.trim() !== "");
            setSelectComplete(allSet ? true : false);
        }
    }, [selectedParams, activeStep])

    // when a weekly schedule is selected, check if at least one weekday checkbox is checked
    useEffect(() => {
        if (activeStep === 2) {
            if (selectedSchedule.weekly) {
                setSelectComplete(selectedSchedule.weekdays.length > 0);
            } else {
                setSelectComplete(true);
            }
        }

        if (activeStep === 2 && selectedSchedule.weekly) {
            setSelectComplete(selectedSchedule.weekdays.length > 0);
        }
    }, [selectedSchedule, activeStep])

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);

    const delay = () => {
        setCounter(5);
        setTimeout(() => {
            components?.setCurrent("home");
        }, 5000);
    }

    // handlers for stepper logic
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 3) {
            delay();
        }
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // handlers for topic selection logic
    const handleSelectTopic = (topicName: string) => {
        setSelectedTopic(topicName);
    }
    const handleEnterJobName = (jobName: string) => {
        setJobName(jobName);
    }

    // handler for param selection logic
    const handleSelectParam = (key: string, value: string) => {
        const newList: Param[] = selectedParams.map((e: Param) => {
            if (e.name === key) {
                return { ...e, selected: value };
            }
            return e;
        })
        setSelectedParams(newList);
    }

    // handler for schedule selection logic
    const handleSelectDaily = () => {
        setSelectedSchedule({ ...selectedSchedule, daily: true, weekly: false, onDate: false, weekdays: [], })
    }
    const handleSelectWeekly = () => {
        setSelectedSchedule({ ...selectedSchedule, daily: false, weekly: true, onDate: false, weekdays: [], })
    }
    const handleSelectOnDate = () => {
        setSelectedSchedule({ ...selectedSchedule, daily: false, weekly: false, onDate: true, weekdays: [], })
    }
    const handleAddWeekDay = (d: Weekday) => {
        const weekdays: Weekday[] = [...selectedSchedule.weekdays, d];
        setSelectedSchedule({ ...selectedSchedule, weekdays: weekdays });
    }
    const handleRemoveWeekday = (d: Weekday) => {
        const weekdays: Weekday[] = selectedSchedule.weekdays.filter(e => e !== d);
        setSelectedSchedule({ ...selectedSchedule, weekdays: weekdays });
    }
    const handleSelectDate = (date: Date | null) => {
        setSelectedSchedule({ ...selectedSchedule, date: date })
    }
    const handleSelectTime = (time: Date | null) => {
        setSelectedSchedule({ ...selectedSchedule, time: time })
    }
    const handleDelete = () => {
        setSelectedSchedule({...selectedSchedule, delete: false, delete_old_on_new: false, onTime: false})
    }
    const handleDeleteOldNew = () => {
        setSelectedSchedule({...selectedSchedule, delete: true, delete_old_on_new: true, onTime: false})
    }

    const handleDeleteOnTime = () => {
        setSelectedSchedule({...selectedSchedule, delete: true, delete_old_on_new: false, onTime: true})
    }

    const handleDeleteTime = (date: Date | null) => {
        setSelectedSchedule({ ...selectedSchedule, removal_time: date })
    }

    // stepper texts
    const steps = [
        "Thema auswählen",
        "Parameter festlegen",
        "Zeitplan auswählen",
        "Löschen des Videos"
    ];
    const descriptions = [
        "Zu welchem Thema sollen Videos generiert werden?",
        "Parameter auswählen für: '" + selectedTopic + "'",
        "Wann sollen neue Videos generiert werden?",
        "Wann soll das generierte Video gelöscht werden"
    ];

    // based on active step, render specific selection panel
    const getSelectPanel = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <TopicSelection
                        selectedTopic={selectedTopic}
                        jobName={jobName}
                        selectTopicHandler={handleSelectTopic}
                        enterJobNameHandler={handleEnterJobName} />
                );
            case 1:
                return (
                    <ParamSelection
                        topic={selectedTopic}
                        params={selectedParams}
                        selectParamHandler={handleSelectParam} />
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
            case 3:
                return (
                    <DeleteSelection
                        schedule={selectedSchedule}
                        deleteHandler={handleDelete}
                        deleteOldNewHandler={handleDeleteOldNew}
                        deleteOnTimeHandler={handleDeleteOnTime}
                        deleteTimeHandler={handleDeleteTime}
                    />
                )
            default:
                return "";
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
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
                                <ContinueButton onClick={handleNext} style={{ marginLeft: 20 }} disabled={!selectComplete}>
                                    {activeStep < steps.length - 1 ? "WEITER" : "ERSTELLEN"}
                                </ContinueButton>
                            </span>
                        </div>
                    </div>
                    :
                    <Fade in={true}>
                        <div className={classes.paddingSmall}>
                            Der Job wurde erstellt!
                            <p>Sie werden in {counter} Sekunden zur Startseite weitergeleitet.</p>
                            <ContinueButton onClick={() => components?.setCurrent("home")}>
                                STARTSEITE
                            </ContinueButton>
                        </div>
                    </Fade>
                }
            </div>
        </div>
    );
}
