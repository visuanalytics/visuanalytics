import React, {useState} from "react";
import { CenterNotification, centerNotifcationReducer } from "../util/CenterNotification";
import { BasicSettings } from "./BasicSettings";
import { useCallFetch } from "../Hooks/useCallFetch";
import { TypeSelection } from "./TypeSelection";
import { HistorySelection } from "./HistorySelection";
import {DataSelection} from "./DataSelection";
import {CreateCustomData} from "./CreateCustomData";
import Container from "@material-ui/core/Container";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {SettingsOverview} from "./SettingsOverview";
import {formelObj} from "./CreateCustomData/CustomDataGUI/formelObjects/formelObj"


//TODO: possibly find a better solution - objects are a nice structure, but comparison takes up compute time since conversions are necessary
//data type for elements contained in selectedData
export type SelectedDataItem = {
    key: string;
    type: String;
}

export type Schedule = {
    type: string;
    weekdays?: number[];
    time?: string;
    interval?: string;
}

/**
 * Returns a set that only contains the keys from selectedData.
 */
export const extractKeysFromSelection = (selectedData: Array<SelectedDataItem>) => {
    const keyArray = new Array<string>();
    selectedData.forEach((item) => keyArray.push(item.key));
    return keyArray;
}

/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider = () => {
    //unique application id used to avoid collisions in session storage
    const uniqueId = "ddfdd278-abf9-11eb-8529-0242ac130003"

    //const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const steps = [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Formeln",
        "Historisierung",
        "Gesamtübersicht"
    ];
    //the current step of the creation process, numbered by 0 to 5

    const [step, setStep] = React.useState(2);
    //name of the info-provider
    const [name, setName] = React.useState("");
    //holds the name of the current API
    const [apiName, setApiName] = React.useState("");
    //holds the query of the current API
    const [query, setQuery] = React.useState("");
    // holds the key of the current API
    const [apiKeyInput1, setApiKeyInput1] = React.useState("");
    // holds the key of the current API
    const [apiKeyInput2, setApiKeyInput2] = React.useState("");
    // marks if the user selected that no key is needed right now
    const [noKey, setNoKey] = React.useState(false);
    //holds the selected authorization method
    const [method, setMethod] = React.useState("");
    //holds the data delivered from the currently created API
    const [apiData, setApiData] = React.useState({});
    // contains selected data from DataSelection
    const [selectedData, setSelectedData] = React.useState(new Array<SelectedDataItem>());
    // contains all data created custom in step 4
    const [customData, setCustomData] = React.useState(new Array<formelObj>());
    // contains all data that was selected for historization
    const [historizedData, setHistorizedData] = React.useState(new Array<string>());
    // Contains the JSON for historisation schedule selection
    const [schedule, selectSchedule] = useState<Schedule>({type: "weekly", interval: undefined, time: undefined, weekdays: []});

    /**
     * Restores all data of the current session when the page is loaded. Used to not loose data on reloading the page.
     * The sets need to be converted back from Arrays that were parsed with JSON.stringify.
     */
    React.useEffect(() => {
        //step - disabled since it makes debugging more annoying TODO: restore when finished!!
        //setStep(Number(sessionStorage.getItem("step-" + uniqueId)||0));
        //apiName
        setApiName(sessionStorage.getItem("apiName-" + uniqueId)||"");
        //query
        setQuery(sessionStorage.getItem("query-" + uniqueId)||"");
        //noKey
        setNoKey(sessionStorage.getItem("noKey-" + uniqueId)==="true");
        //method
        setMethod(sessionStorage.getItem("method-" + uniqueId)||"");
        //apiData
        setApiData(JSON.parse(sessionStorage.getItem("apiData-" + uniqueId)||""));
        //selectedData
        setSelectedData(JSON.parse(sessionStorage.getItem("selectedData-" + uniqueId)||""));
        //customData
        setCustomData(JSON.parse(sessionStorage.getItem("customData-" + uniqueId)||""));
        //historizedData
        setHistorizedData(JSON.parse(sessionStorage.getItem("historizedData-" + uniqueId)||""));
    }, [])
    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("step-" + uniqueId, step.toString());
    }, [step])
    //store apiName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("apiName-" + uniqueId, apiName);
    }, [apiName])
    //store query in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("query-" + uniqueId, query);
    }, [query])
    //store noKey in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("noKey-" + uniqueId, noKey?"true":"false");
    }, [noKey])
    //store method in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("method-" + uniqueId, method);
    }, [method])
    //store apiData in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("apiData-" + uniqueId, JSON.stringify(apiData));
    }, [apiData])
    //store selectedData in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("selectedData-" + uniqueId, JSON.stringify(selectedData));
    }, [selectedData])
    //store customData in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("customData-" + uniqueId, JSON.stringify(customData));
    }, [customData])
    //store historizedData in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("historizedData-" + uniqueId, JSON.stringify(historizedData));
    }, [historizedData])


    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("step-" + uniqueId);
        sessionStorage.removeItem("apiName-" + uniqueId);
        sessionStorage.removeItem("query-" + uniqueId);
        sessionStorage.removeItem("noKey-" + uniqueId);
        sessionStorage.removeItem("method-" + uniqueId);
        sessionStorage.removeItem("apiData-" + uniqueId);
        sessionStorage.removeItem("selectedData-" + uniqueId);
        sessionStorage.removeItem("customData-" + uniqueId);
        sessionStorage.removeItem("historizedData-" + uniqueId);
    }


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
     * Handler for the return of a successful call to the backend (posting info-provider)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {
      clearSessionStorage();
    }

    /**
     * Handler for unsuccessful call to the backend (posting info-provider)
     * @param err The error returned by the backend
     */
    const handleError = (err: Error) => {
        reportError("Fehler: Senden des Info-Providers an das Backend fehlgeschlagen! (" + err.message + ")");
    }

    /**
     * Method to post all settings for the Info-Provider made by the user to the backend.
     * The backend will use this data to create the desired Info-Provider.
     */
    const postInfoProvider = useCallFetch("/infoprovider",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                infoprovider_name: name,
                api: {
                    type: "request",
                    api_key_name: method==="BearerToken"?apiKeyInput1:apiKeyInput1 + "||" + apiKeyInput2,
                    url_pattern: query
                },
                method: noKey?"noAuth":method,
                transform: extractKeysFromSelection(selectedData),
                storing: historizedData,
                customData: customData
            })
        }, handleSuccess, handleError
    );



    /**
     * Method that checks if the given name is already in use for a data source in this info-provider
     * @param name Name that should be checked.
     * Return true if the name is already in use for this Info-Provider
     */
    const checkNameDuplicate = (name: string) => {
        //if(name is contained) return true
        //else return false
        return false; //TODO: to be removed when the check is implemented
    }

    /**
     * Handler for continue button that is passed to all sub-component as props.
     * Increments the step.
     */
    const handleContinue = () => {
        setStep(step+1);
        console.log(JSON.stringify({
            infoprovider_name: name,
            api: {
                type: "request",
                api_key_name: method==="BearerToken"?apiKeyInput1:apiKeyInput1 + "||" + apiKeyInput2,
                url_pattern: query,
            },
            method: noKey?"noAuth":method,
            transform: extractKeysFromSelection(selectedData),
            storing: historizedData,
            customData: customData
        }));
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
                    <TypeSelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                    />
                );
            case 1:
                return (
                    <BasicSettings
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        setApiData={setApiData}
                        checkNameDuplicate={checkNameDuplicate}
                        query={query}
                        setQuery={(query: string) => setQuery(query)}
                        apiKeyInput1={apiKeyInput1}
                        setApiKeyInput1={(key: string) => setApiKeyInput1(key)}
                        apiKeyInput2={apiKeyInput2}
                        setApiKeyInput2={(key: string) => setApiKeyInput2(key)}
                        noKey={noKey}
                        setNoKey={(noKey: boolean) => setNoKey(noKey)}
                        method={method}
                        setMethod={(method: string) => setMethod(method)}
                        name={apiName}
                        setName={(name: string) => setApiName(name)}
                        reportError={reportError}
                    />
                );
            case 2:
                return (
                    <DataSelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        apiData={apiData}
                        selectedData={selectedData}
                        setSelectedData={(set: Array<SelectedDataItem>) => setSelectedData(set)}
                    />
                );
            case 3:
                return (
                    <CreateCustomData
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={selectedData}
                        setSelectedData={(array: Array<SelectedDataItem>) => setSelectedData(array)}
                        customData={customData}
                        setCustomData={(array:Array<formelObj>) => setCustomData(array)}
                    />
                )
            case 4:
                return (
                    <HistorySelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={extractKeysFromSelection(selectedData)}
                        customData={customData}
                        historizedData={historizedData}
                        setHistorizedData={(set: Array<string>) => setHistorizedData(set)}
                        schedule={schedule}
                        selectSchedule={selectSchedule}
                    />
                )
            case 5:
                return (
                    <SettingsOverview
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        name={name}
                        setName={(name: string) => setName(name)}
                        selectedData={extractKeysFromSelection(selectedData)}
                        customData={customData}
                        historizedData={historizedData}
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
