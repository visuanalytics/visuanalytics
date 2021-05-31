import React, {useEffect, useRef, useState} from "react";
import { CenterNotification, centerNotifcationReducer } from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {InfoProviderSelection} from "./InfoProviderSelection";
import {SceneEditor} from "./SceneEditor";
import {ComponentContext} from "../ComponentProvider";
import {DataSource, uniqueId} from "../CreateInfoProvider";


//TODO: when merged with the new type structure, put this into a global file
/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
export type InfoProviderData = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * Wrapper component for the scene creation.
 */
export const SceneCreation = () => {

    //const classes = useStyles();
    const components = React.useContext(ComponentContext);

    //the current step of the creation process, numbered by 0 to 1
    const [step, setStep] = React.useState(0);
    //the list of all infoproviders fetched from the backend
    const [infoProviderList, setInfoProviderList] = React.useState<Array<InfoProviderData>>([]);
    //object of the infoprovider to be used in the scene creation, selected in first step
    const [infoProvider, setInfoProvider] = React.useState<Array<DataSource>>([]);

    React.useEffect(() => {
        //step - disabled since it makes debugging more annoying TODO: restore when finished!!
        setStep(Number(sessionStorage.getItem("step-" + uniqueId)||0));
        //infoProviderList
        setInfoProviderList(sessionStorage.getItem("infoProviderList-" + uniqueId) === null ? new Array<InfoProviderData>() : JSON.parse(sessionStorage.getItem("infoProviderList-" + uniqueId)!));
        //infoProvider
        setInfoProvider(sessionStorage.getItem("infoProvider-" + uniqueId )=== null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvider-" + uniqueId)!));
    }, [])
    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("step-" + uniqueId, step.toString());
    }, [step])

    React.useEffect(() => {
        sessionStorage.setItem("infoProviderList-" + uniqueId, JSON.stringify(infoProviderList));
    }, [infoProviderList])

    React.useEffect(() => {
        sessionStorage.setItem("infoProvider-" + uniqueId, JSON.stringify(infoProvider));
    }, [infoProvider])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("step-" + uniqueId);
        sessionStorage.removeItem("infoProviderList-" + uniqueId);
        sessionStorage.removeItem("infoProvider-" + uniqueId);
    }

    // contains the names of the steps to be displayed in the stepper
    const steps = [
        "Infoprovider-Auswahl",
        "Szenen-Erstellung"
    ];


    // setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({ type: "reportError", message: message });
    };

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleContinue = () => {
        setStep(step + 1);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        if(step===0) components?.setCurrent("dashboard")
        setStep(step-1)
    }

    /**
     * Handles the error-message if an error appears.
     * @param err the shown error
     */
    const handleErrorFetchAll = (err: Error) => {
        //console.log('error');
        dispatchMessage({type: "reportError", message: 'Fehler: ' + err});
    }

    /**
     * This type is needed because the answer of the backend consists of a list of infProviders.
     */
    type fetchAllBackendAnswer = Array<InfoProviderData>

    /**
     * Handles the success of the fetchAllInfoprovider()-method.
     * The json from the response will be transformed to an array of jsonRefs and saved in infoprovider.
     * @param jsonData the answer from the backend
     */
    const handleSuccessFetchAll = (jsonData: any) => {
        const data = jsonData as fetchAllBackendAnswer;
        setInfoProviderList(data);
    }

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * Method to fetch all infoproviders from the backend.
     * The standard hook "useCallFetch" is not used here since the fetch function has to be memorized
     * with useCallback in order to be used in useEffect.
     */
    const fetchAllInfoprovider = React.useCallback(() => {
        let url = "/visuanalytics/infoprovider/all"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted) handleSuccessFetchAll(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted) handleErrorFetchAll(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * The list of infoproviders is generated automatically when the component is shown.
     */
    React.useEffect(() => {
            //console.log("Fetcher hook here")
            fetchAllInfoprovider();
        }, [fetchAllInfoprovider]
    );


    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <InfoProviderSelection
                        continueHandler={() => setStep(step+1)}
                        backHandler={() => setStep(step-1)}
                        infoProviderList={infoProviderList}
                        reportError={reportError}
                        setInfoProvider={(infoProvider: Array<DataSource>) => setInfoProvider(infoProvider)}
                    />
                )
            case 1:
                return (
                    <SceneEditor
                        continueHandler={() => setStep(step+1)}
                        backHandler={() => setStep(step-1)}
                        infoProvider={infoProvider}
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
