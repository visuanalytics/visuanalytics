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
import {
    Param,
    ParamValues,
    trimParamValues,
    validateParamValues,
    initSelectedValues,
    toTypedValues
} from '../util/param';
import { Fade } from '@material-ui/core';
import { useCallFetch } from '../Hooks/useCallFetch';
import { Schedule, withFormattedDates, validateSchedule } from '../util/schedule';
import { getUrl } from '../util/fetchUtils';


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
    const [paramList, setParamList] = React.useState<Param[] | undefined>(undefined);
    const [paramValues, setParamValues] = React.useState<ParamValues>({});

    // state for Load Failed
    const [loadFailed, setLoadFailed] = React.useState(false);

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
            values: toTypedValues(trimParamValues(paramValues), paramList ? paramList : []),
            schedule: withFormattedDates(schedule)
        })
    });

    // handler for param Load failed
    const handleLoadParamsFailed = React.useCallback(() => {
      setLoadFailed(true);
    }, []);

    // handler for param selection logic
    const handleFetchParams = React.useCallback((params: Param[]) => {
        setParamList(params);
        setParamValues(initSelectedValues(params));
      }, []);
    
    // initialize callback for get params
    const fetchParams = useCallFetch(
        getUrl("/params/") + topicId, 
        undefined, 
        handleFetchParams, 
        handleLoadParamsFailed
    );
    
    // handler for RealoadingParms
    const handleRealoadParms = React.useCallback(() => {
      setParamList(undefined);
      setParamValues({});
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
        if (topicId !== -1) {
            handleRealoadParms();
        }
    }, [topicId, handleRealoadParms])

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
            const allSet = validateParamValues(paramValues, paramList);
            setSelectComplete(allSet);
        }
    }, [paramList, paramValues, activeStep])

    // when a weekly schedule is selected, check if at least one weekday checkbox is checked
    useEffect(() => {
        if (activeStep === 2) {
            const allSet = validateSchedule(schedule);
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
                        loadFailedProps={{
                            hasFailed: loadFailed, 
                            name: "Parameter", 
                            onReload: handleRealoadParms
                        }}
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