import React, {useEffect} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {useStyles} from './style';
import {ContinueButton} from './ContinueButton';
import {BackButton} from './BackButton';
import {ParamSelection} from './ParamSelection';
import {TopicSelection, Topic} from './TopicSelection';
import {GreyDivider} from './GreyDivider';
import {
    Param,
    ParamValues,
    trimParamValues,
    validateParamValues,
    initSelectedValues,
    toTypedValues
} from '../util/param';
import {Fade, Grid, Typography} from '@material-ui/core';
import {useCallFetch} from '../Hooks/useCallFetch';
import {Schedule, withFormattedDates, validateSchedule} from '../util/schedule';
import {getUrl} from '../util/fetchUtils';
import {HintButton} from "../util/HintButton";
import {ComponentContext} from "../ComponentProvider";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {DeleteSchedule} from "../util/deleteSchedule";
import {SettingsPage} from "../util/SettingsPage";


export default function JobCreate() {
    const classes = useStyles();
    const components = React.useContext(ComponentContext);

    const [counter, setCounter] = React.useState(5);
    // states for stepper logic
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    // states for topic selection logic
    const [topics, setTopics] = React.useState<Topic[]>([]);
    const [jobName, setJobName] = React.useState("");
    const [multipleTopics, setMultipleTopics] = React.useState(false);
    const multipleRef = React.useRef(false);

    // state for param selection logic
    const [paramLists, setParamLists] = React.useState<Param[][] | undefined>(undefined);
    const [paramValues, setParamValues] = React.useState<ParamValues[]>([]);

    // state for Load Failed
    const [loadFailed, setLoadFailed] = React.useState(false);

    // state for schedule selection logic
    const [schedule, setSchedule] = React.useState<Schedule>({
        type: "daily",
        time: new Date()
    });

    // state for deleteSchedule selection logic
    const [deleteSchedule, setDeleteSchedule] = React.useState<DeleteSchedule>({
        type: "noDeletion",
    })

    const [hintState, setHintState] = React.useState(0);

    // initialize callback for add job functionality
    const addJob = useCallFetch(getUrl("/add"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topics: topics.map((t, idx) => {
                return {
                    topicId: t.topicId,
                    values: toTypedValues(trimParamValues(paramValues[idx]), paramLists ? paramLists[idx] : [])
                }
            }),
            jobName: jobName,
            schedule: withFormattedDates(schedule)
        })
    });

    // handler for param Load failed
    const handleLoadParamsFailed = React.useCallback(() => {
        setLoadFailed(true);
    }, []);

    // handler for param selection logic
    const handleFetchParams = React.useCallback((params: Param[]) => {
        setParamLists(p => {
            if (p !== undefined) {
                return [...p, params];
            }
            return [params];
        })
        setParamValues(v => {
            if (v !== undefined) {
                return [...v, initSelectedValues(params)];
            }
            return [initSelectedValues(params)];
        })
    }, []);

    // initialize callback for get params
    const fetchParams = useCallFetch(
        getUrl("/params/") + topics[topics.length - 1]?.topicId,
        undefined,
        handleFetchParams,
        handleLoadParamsFailed
    );

    // handler for reloading params
    const handleReloadParams = React.useCallback(() => {
        if (!multipleRef.current) {
            setParamLists(undefined);
            setParamValues([]);
        }
        setLoadFailed(false);
        fetchParams();
    }, [fetchParams]);

    useEffect(() => {
        if (activeStep === 3) {
            setActiveStep(4);
            setFinished(true);
            addJob();
        }
    }, [activeStep, addJob])

    // when a new topic is selected, fetch params
    useEffect(() => {
        if (topics.length > 0) {
            handleReloadParams();
        }
    }, [topics, handleReloadParams])

    // when a new topic or job name is selected, check if topic selection is complete
    useEffect(() => {
        if (activeStep === 0) {
            const allSet = topics.length > 0 && jobName.trim() !== "";
            setSelectComplete(allSet);
        }
    }, [topics, jobName, activeStep, paramLists])


    useEffect(() => {
        multipleRef.current = multipleTopics;
        if (!multipleTopics) {
            setTopics([]);
            setParamLists(undefined);
            setParamValues([]);
        }
    }, [multipleTopics])

    // when a new parameter value is entered, check if parameter selection is complete
    useEffect(() => {
        if (activeStep === 1) {
            const allSet = paramLists?.every((l, idx) => validateParamValues(paramValues[idx], l));
            setSelectComplete(allSet || false);
        }
    }, [paramLists, paramValues, activeStep])

    // when a weekly schedule is selected, check if at least one weekday checkbox is checked
    useEffect(() => {
        if (activeStep === 2) {
            const allSet = validateSchedule(schedule);
            setSelectComplete(allSet);
        }
    }, [schedule, activeStep])

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
        handleHintState(activeStep + 1);
        if (activeStep === 2) {
            delay();
        }
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // handlers for topic selection logic
    const handleResetTopics = () => {
        setTopics([]);
    }

    const handleAddTopic = (topic: Topic) => {
        setTopics([...topics, topic]);
    }

    const handleSetSingleTopic = (topic: Topic) => {
        setTopics([topic]);
    }

    const handleEnterJobName = (jobName: string) => {
        setJobName(jobName);
    }

    const handleToggleMultiple = () => {
        setMultipleTopics(!multipleTopics);
    }

    // handler for param selection logic
    const handleSelectParam = (key: string, value: any, idx: number) => {
        const updated = [...paramValues]
        updated[idx][key] = value;
        setParamValues(updated);
    }

    // handler for schedule selection logic
    const handleSelectSchedule = (schedule: Schedule) => {
        setSchedule(schedule);
    }

    // handler fpr deleteSchedule selection logic
    const handleSelectDeleteSchedule = (deleteSchedule: DeleteSchedule) => {
        setDeleteSchedule(deleteSchedule);
    }

    const handleHintState = (hint: number) => {
        setHintState(hint);
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
        "Wann sollen neue Videos generiert/gelöscht werden?"
    ];
    const hintContent = [
        <div>
            <Typography variant="h5" gutterBottom>Themenauswahl</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie auswählen zu welchem der Themen Ihnen ein Video generiert werden soll.
            </Typography>
        </div>,
        <div>
            <Typography variant="h5" gutterBottom>Parameterauswahl</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie bestimmte Parameter auswahlen.
            </Typography>
        </div>,
        <div>
            <Typography variant="h5" gutterBottom>Zeitplan auswählen</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video generiert werden soll.
            </Typography>
            <Typography variant="h6">täglich</Typography>
            <Typography gutterBottom>Das Video wird täglich zur unten angegebenen Uhrzeit erstellt</Typography>
            <Typography variant="h6">wöchentlich</Typography>
            <Typography gutterBottom>Das Video wird zu den angegebenen Wochentagen wöchentlich zur unten angegebenen
                Uhrzeit erstellt</Typography>
            <Typography variant="h6">Intervall</Typography>
            <Typography gutterBottom>Das Video wird nach dem angegebenen Intervall generiert</Typography>
            <Typography variant="h6">an festem Datum</Typography>
            <Typography gutterBottom>Das Video wird zum angegebenen Datum und zur angegebenen Uhrzeit
                erstellt</Typography>
        </div>,

        <div>
            <Typography variant="h5" gutterBottom>Löschen</Typography>
            <Typography gutterBottom>
                Auf dieser Seite können Sie auswählen an welchem Zeitpunkt das Video gelöscht werden soll.
            </Typography>
            <Typography variant="h6">nie</Typography>
            <Typography gutterBottom>Das Video wird nie gelöscht</Typography>
            <Typography variant="h6">nach Zeit</Typography>
            <Typography gutterBottom>Das Video wird nach einer bestimmten Anzahl an Tagen und Stunden
                gelöscht</Typography>
            <Typography variant="h6">nach Anzahl</Typography>
            <Typography gutterBottom>Das Video wird nach einer bestimmten Anzahl an generierten Videos
                gelöscht</Typography>
            <Typography variant="h6">feste Namen</Typography>
            <Typography gutterBottom>Es wird eine bestimmte Anzahl an Videos generiert, wobei das neuste immer den
                Namen <i>jobName</i>_1 besitzt</Typography>
        </div>
    ];

    // based on active step, render specific selection panel
    const getSelectPanel = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <TopicSelection
                        topics={topics}
                        jobName={jobName}
                        multipleTopics={multipleTopics}
                        toggleMultipleHandler={handleToggleMultiple}
                        resetTopicsHandler={handleResetTopics}
                        setSingleTopicHandler={handleSetSingleTopic}
                        addTopicHandler={handleAddTopic}
                        enterJobNameHandler={handleEnterJobName}/>
                );
            case 1:
                return (
                    <ParamSelection
                        topicNames={topics.map(t => t.topicName)}
                        values={paramValues}
                        params={paramLists}
                        loadFailedProps={{
                            hasFailed: loadFailed,
                            name: "Parameter",
                            onReload: handleReloadParams
                        }}
                        selectParamHandler={handleSelectParam}/>
                )
            case 2:
                return (
                    <SettingsPage
                        offset={1}
                        schedule={schedule}
                        deleteSchedule={deleteSchedule}
                        selectScheduleHandler={handleSelectSchedule}
                        selectDeleteScheduleHandler={handleSelectDeleteSchedule}
                        handleHintState={handleHintState}
                        paramSelectionProps={undefined}
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
                            <Grid container>
                                <Grid item xs={1}>
                                </Grid>
                                <Grid item xs={10}>
                                    <h3 className={classes.header}>{descriptions[activeStep]}</h3>
                                </Grid>
                                <Grid container item xs={1}>
                                    <HintButton content={hintContent[hintState]} />
                                </Grid>
                            </Grid>
                        </div>
                        <GreyDivider/>
                        {getSelectPanel(activeStep)}
                        <GreyDivider/>
                        <div className={classes.MPaddingTB}>
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
                        <div className={classes.MPaddingTB}>
                            <Grid container spacing={2}>
                                <Grid container item justify="center">
                                    <CheckCircleIcon
                                        className={classes.checkIcon}
                                        color={"disabled"}
                                        fontSize={"default"}
                                    />
                                </Grid>
                                <Grid container item justify="center">
                                    <Typography>Job '{jobName}' erfolgreich erstellt!</Typography>
                                </Grid>
                                <Grid container item justify="center">
                                    <Typography>Sie werden in {counter} Sekunden zur Startseite
                                        weitergeleitet.</Typography>
                                </Grid>
                                <Grid container item justify="center">
                                    <ContinueButton onClick={() => components?.setCurrent("home")}>
                                        STARTSEITE
                                    </ContinueButton>
                                </Grid>
                            </Grid>
                        </div>
                    </Fade>
                }
            </div>
        </div>
    );
}