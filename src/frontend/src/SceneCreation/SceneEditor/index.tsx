import React, {useState} from "react";



export const SceneEditor = () => {

    //const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const steps = [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Formeln",
        "Historisierung",
        "Gesamtübersicht",
        "Diagrammerstellung"
    ];
    //the current step of the creation process, numbered by 0 to 6

    const [step, setStep] = React.useState(0);


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



    return (
        <React.Fragment>

        </React.Fragment>
    );
}
