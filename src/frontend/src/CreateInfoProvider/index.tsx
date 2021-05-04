import React, {useCallback} from "react";
import {
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Paper,
    Typography,
} from "@material-ui/core";
import { JobList } from "../JobList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ComponentContext } from "../ComponentProvider";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../PageTemplate";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BasicSettings } from "./BasicSettings";
import {useStyles} from "../Home/style";
import JobCreate from "../JobCreate";
import { useCallFetch } from "../Hooks/useCallFetch";
import { TypeSelection } from "./TypeSelection";
import { HistorySelection } from "./HistorySelection";
import {DataSelection} from "./DataSelection";
import {CreateCustomData} from "./CreateCustomData";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {clear} from "@testing-library/user-event/dist/clear";
import {SettingsOverview} from "./SettingsOverview";


/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider = () => {
    //unique application id used to avoid collisions in session storage
    const uniqueId = "ddfdd278-abf9-11eb-8529-0242ac130003"

    //const classes = useStyles();
    const steps = [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Formeln",
        "Historisierung",
        "Gesamtübersicht"
    ];
    //the current step of the creation process, numbered by 0 to 5
    const [step, setStep] = React.useState(5);
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
    const [selectedData, setSelectedData] = React.useState(new Set<string>());
    // contains all data created custom in step 4
    const [customData, setCustomData] = React.useState(new Set<string>());
    // contains all data that was selected for historization
    const [historizedData, setHistorizedData] = React.useState(new Set<string>());

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
        setSelectedData(new Set<string>(JSON.parse(sessionStorage.getItem("selectedData-" + uniqueId)||"")));
        //customData
        setCustomData(new Set(JSON.parse(sessionStorage.getItem("customData-" + uniqueId)||"")));
        //historizedData
        setHistorizedData(new Set(JSON.parse(sessionStorage.getItem("historizedData-" + uniqueId)||"")));
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
        sessionStorage.setItem("selectedData-" + uniqueId, JSON.stringify(Array.from(selectedData)));
    }, [selectedData])
    //store customData in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("customData-" + uniqueId, JSON.stringify(Array.from(customData)));
    }, [customData])
    //store historizedData in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("historizedData-" + uniqueId, JSON.stringify(Array.from(historizedData)));
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
        //TODO: implement error handling
    }

    /**
     * Method to post all settings for the Info-Proivder made by the user to the backend.
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
                    url_pattern: query,
                },
                method: noKey?"noAuth":method,
                transform: Array.from(selectedData),
                storing: Array.from(historizedData),
                customData: Array.from(customData)
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
        return false //TODO: to be removed when the check is implemented
    }


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
            transform: Array.from(selectedData),
            storing: Array.from(historizedData),
            customData: Array.from(customData)
        }));
    }

    const handleBack = () => {
        //TODO: if step==0, return to dashboard context
        setStep(step-1)
    }


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
                    />
                );
            case 2:
                return (
                    <DataSelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        apiData={apiData}
                        selectedData={selectedData}
                        setSelectedData={(set: Set<string>) => setSelectedData(set)}
                    />
                );
            case 3:
                return (
                    <CreateCustomData
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={selectedData}
                        setSelectedData={(set: Set<string>) => setSelectedData(set)}
                        customData={customData}
                        setCustomData={(set:Set<string>) => setCustomData(set)}
                    />
                )
            case 4:
                return (
                    <HistorySelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={selectedData}
                        customData={customData}
                        historizedData={historizedData}
                        setHistorizedData={(set: Set<string>) => setHistorizedData(set)}
                    />
                )
            case 5:
                return (
                    <SettingsOverview
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        name={name}
                        setName={(name: string) => setName(name)}
                        selectedData={selectedData}
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
        </React.Fragment>
    );
}
