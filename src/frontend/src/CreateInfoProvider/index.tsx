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


/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider = () => {
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
    const [step, setStep] = React.useState(4);
    // holds the key of the current API
    const [apiKey, setApiKey] = React.useState("");
    //holds the query of the current API
    const [query, setQuery] = React.useState("");
    // marks if the user selected that no key is needed right now
    const [noKey, setNoKey] = React.useState(false);
    //holds the selected authorization method
    const [method, setMethod] = React.useState("");
    //holds the data delivered from the currently created API
    const [apiData, setApiData] = React.useState({});
    // contains selected data from DataSelection
    const [selectedData, setSelectedData] = React.useState(new Set<string>());
    // contains all data created custom in step 4
    const [customData, setcustomData] = React.useState(new Set<any>());
    // contains all data that was selected for historization
    const [historizedData, setHistorizedData] = React.useState(new Set<string>());


    /**
     * Handler for the return of a successful call to the backend (posting info-provider)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {

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
    const postInfoProvider = useCallFetch("/Infoprovider",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api: {
                    type: "request",
                    api_key_name: apiKey,
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
            api: {
                type: "request",
                api_key_name: apiKey,
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
                        apiKey={apiKey}
                        setApiKey={(key: string) => setApiKey(key)}
                        noKey={noKey}
                        setNoKey={(noKey: boolean) => setNoKey(noKey)}
                        method={method}
                        setMethod={(method: string) => setMethod(method)}
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
                    />
                )
            case 4:
                return (
                    <HistorySelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={selectedData}
                        historizedData={historizedData}
                        setHistorizedData={(set: Set<string>) => setHistorizedData(set)}
                    />
                )
            case 5:
                return (
                    <div>Step 5</div>
                )
            /*case 5:
                return (
                    <CreationOverview>
                    />
                )*/
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
