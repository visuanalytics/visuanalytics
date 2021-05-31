import React, {useState} from "react";
import { CenterNotification, centerNotifcationReducer } from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {InfoProviderSelection} from "./InfoProviderSelection";
import {SceneEditor} from "./SceneEditor";



export const SceneCreation = () => {

    //const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const steps = [
        "Infoprovider-Auswahl",
        "Szenen-Erstellung"
    ];

    //the current step of the creation process, numbered by 0 to 1
    const [step, setStep] = React.useState(0);


    // setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    };


    const handleContinue = () => {
        setStep(step + 1);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        //TODO: if step==0, return to dashboard context
        setStep(step-1)
    }



    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <InfoProviderSelection

                    />
                )
            case 1:
                return (
                    <SceneEditor

                    />
                )
        }
    }

    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                <Stepper activeStep={step}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>
            {selectContent(step)}
            <CenterNotification
                handleClose={() => dispatchMessage({ type: "close" })}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </React.Fragment>
    );
}
