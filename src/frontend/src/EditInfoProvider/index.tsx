import React, {useState} from "react";
import {formelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {Schedule, SelectedDataItem} from "../CreateInfoProvider";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {useStyles} from "./style";
import {ComponentContext} from "../ComponentProvider";
import {InfoProviderObj} from "../Dashboard/TabsContent/InfoProviderOverview/infoProviderOverview";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: InfoProviderObj;
}

export const EditInfoProvider: React.FC<EditInfoProviderProps> = ({infoProvId, infoProvider}) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

//the current step of the creation process, numbered by 0 to 5
    const [step, setStep] = React.useState(0);

    const steps = [
        "Überblick",
        "API-Daten",
        "Formeln",
        "Diagramme",
        "Historisierung"
    ];

// setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({type: "reportError", message: message});
    };


    /**
     * Handler for continue button that is passed to all sub-component as props.
     * Increments the step.
     */
    const handleContinue = () => {
        setStep(step + 1);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        setStep(step - 1)
    }


    const editInfoProvider = () => {
        //TODO: Post the edited Infoprovider!
    }

    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <EditSettingsOverview
                        continueHandler={handleContinue}
                        editInfoProvider={editInfoProvider}
                    />
                );
            case 1:
                return (
                    <EditDataSelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        editInfoProvider={editInfoProvider}
                    />
                );
            case 2:
                return (
                    <Grid>

                    </Grid>
                );
            case 3:
                return (
                    <Grid>

                    </Grid>
                )
            case 4:
                return (
                    <Grid>

                    </Grid>
                )
            case 5:
                return (
                    <Grid>

                    </Grid>
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
            {infoProvId}
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </React.Fragment>
    );
}
