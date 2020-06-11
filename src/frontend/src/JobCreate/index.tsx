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

export default function JobCreate() {
    const classes = useStyles();

    // states for stepper logic
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);

    // states for topic selection logic
    const [selectedTopic, setSelectedTopic] = React.useState("");
    const [jobName, setJobName] = React.useState("");

    // state for param selection logic
    const [selectedParams, setSelectedParams] = React.useState<Param[]>([]);

    // when selected topic changes, fetch new parameter list
    useEffect(() => {
        // const topics: string[] = useFetch("/topics");
        const params: Param[] = [
            {
                name: "Spieltag",
                possibleValues: ["aktuell", "letzter", "vorletzter"],
                selected: ""
            },
            {
                name: "Twitter-Wordcloud",
                possibleValues: ["ja", "nein"],
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
            const allSet = selectedParams.every(p => p.selected !== "");
            setSelectComplete(allSet ? true : false);
        }
    }, [selectedParams, activeStep])

    // handlers for stepper logic
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

    // stepper texts
    const steps = [
        "Thema auswählen",
        "Parameter festlegen",
        "Zeitplan auswählen"
    ];
    const descriptions = [
        "Zu welchem Thema sollen Videos generiert werden?",
        "Parameter auswählen für: '" + selectedTopic + "'",
        "Wann sollen neue Videos generiert werden?"
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
                    <ScheduleSelection />
                )
            default:
                return 'Unknown step';
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
        </div>
    );
}
