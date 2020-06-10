import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useStyles } from './style';
import { Divider } from '@material-ui/core';
import { ContinueButton } from './ContinueButton';
import { BackButton } from './BackButton';
import { ParamSelection } from './ParamSelection';
import { TopicSelection } from './TopicSelection';
import { ScheduleSelection } from './ScheduleSelection';

export default function JobCreate() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectComplete, setSelectComplete] = React.useState(false);
    const [selectedTopic, setSelectedTopic] = React.useState<string>("");

    const handleSelectTopic = (topicName: string) => {
        setSelectedTopic(topicName);
    }

    const handleSelectComplete = (isComplete: boolean) => {
        setSelectComplete(isComplete);
    }

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

    const getSelectPanel = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <TopicSelection selectTopicHandler={handleSelectTopic} selectCompleteHandler={handleSelectComplete} />
                );
            case 1:
                return (
                    <ParamSelection topic={selectedTopic} selectCompleteHandler={handleSelectComplete} />
                )
            case 2:
                return (
                    <ScheduleSelection />
                )
            default:
                return 'Unknown step';
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div style={{ width: 1000 }}>
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
                <Divider /> {/* TODO: use GreyDivider */}
                {getSelectPanel(activeStep)}
                <Divider /> {/* TODO: use GreyDivider */}
                <div className={classes.paddingSmall}>
                    <span>
                        <BackButton onClick={handleBack} style={{ marginLeft: 20 }} disabled={activeStep <= 0}>
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
