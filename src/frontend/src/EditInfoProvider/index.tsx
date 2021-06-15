import React from "react";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid, Typography} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {ComponentContext} from "../ComponentProvider";
import {EditCustomData} from "./EditCustomData/EditCustomData";
import {StrArg} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {EditSingleFormel} from "./EditCustomData/EditSingleFormel/EditSingleFormel";

import {formelContext/*, InfoProviderObj*/} from "./types";
import {
    authDataDialogElement,
    BackendDataSource,
    FrontendInfoProvider,
    DataSource,
    DataSourceKey,
    Diagram,
    Plots,
    ListItemRepresentation,
    SelectedDataItem,
    uniqueId
} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {DiagramCreation} from "../CreateInfoProvider/DiagramCreation";
import {AuthDataDialog} from "../CreateInfoProvider/AuthDataDialog";
import {useCallFetch} from "../Hooks/useCallFetch";
import {HistorySelection} from "../CreateInfoProvider/HistorySelection";
import {extractKeysFromSelection} from "../CreateInfoProvider/helpermethods";
import {Schedule} from "./types";
import {CreateInfoProvider} from "../CreateInfoProvider";


interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: FrontendInfoProvider;
}


//TODO: task list for the team
/*
DONE:
task 0: overview component (Tristan)
task 1: restore formulas (Tristan)
task 2: editing for formulas (Tristan)
task 3: new formulas (Tristan)
task 4: integrate diagram components (Janek)
task 6: keep the component context on reload (Janek)
NOT DONE:
task 5: sessionStorage compatibility with AuthDataDialog (Janek)
task 7: reload data from api in DataSelection and compare if all selectedData-items are contained in the new listItems (Janek)
task 8: component for DataSelection (Janek)
task 9: historized data (Tristan)
task 10: add additional data sources (Daniel)
task 11: delete dependencies (???)
task 12: load data from backend (Janek)
task 13: send data to backend (Janek)
 */


export const EditInfoProvider: React.FC<EditInfoProviderProps> = ({ infoProvId, infoProvider}) => {

    const components = React.useContext(ComponentContext);

    /**
     * the current step of the creation process, numbered by 0 to 5
     */
    const [step, setStep] = React.useState(0);

    /**
     * The name of the infoprovider that is being edited
     */

        //infoProvider? infoProvider.name : "TristanTest"
    const [infoProvName, setInfoProvName] = React.useState(infoProvider !== undefined ? infoProvider.infoproviderName : "");


    const [newDataSourceMode, setNewDataSourceMode] = React.useState(false);
    //TODO: mind that keyInput is now in map
    //TODO: remove testinput for production
    /**
     * The array with DataSources from the infoprovider that is being edited.
     * One DataSource-object holds all information from one api.
     */

     //infoProvider? infoProvider.dataSources : new Array<DataSource>(...)
     //fill with test data

    const [infoProvDataSources, setInfoProvDataSources] = React.useState<Array<DataSource>>(infoProvider !== undefined ? infoProvider.dataSources : new Array<DataSource>(
        {
            apiName: "apiName",
            query: "query",
            //apiKeyInput1: "apiKeyInput1",
            //apiKeyInput2: "apiKeyInput2",
            noKey: true,
            method: "KeyInHeader",
            selectedData: new Array<SelectedDataItem>(
                {
                    key: "Array1|Data0",
                    type: "Zahl"
                },
                {
                    key: "Array1|Data1",
                    type: "Zahl"
                }
            ),
            customData: new Array<FormelObj>(new FormelObj("formel1", "26 * 2"), new FormelObj("formel2", "formel1 * formel1")),
            historizedData: new Array<string>("formel1", "formel2"),
            schedule: {type: "weekly", interval: "", time: "18:00", weekdays: [4, 5]},
            listItems: [],
        },
        {
            apiName: "apiName2",
            query: "query2",
            //apiKeyInput1: "apiKeyInput1_2",
            //apiKeyInput2: "apiKeyInput2_2",
            noKey: false,
            method: "BearerToken",
            selectedData: new Array<SelectedDataItem>(
                {
                    key: "Array2|Data0",
                    type: "Zahl"
                },
                {
                    key: "Array2|Data1",
                    type: "Zahl"
                }
            ),
            customData: new Array<FormelObj>(new FormelObj("formel1_2", "(26 % data / ((7 + 5) * 8) + data2 - 3432412f) * 2"), new FormelObj("formel2_2", "25 * formel1_2 / (3 * (Array2|Data0 - 5))")),
            historizedData: new Array<string>("formel1_2", "Array2|Data0"),
            schedule: {type: "weekly", interval: "", time: "16:00", weekdays: [0, 1]},
            listItems: [],
        },
        ));


    //Holds the values of apiKeyInput1 and apiKeyInput2 of each dataSource - map where dataSource name is the key
    const [infoProvDataSourcesKeys, setInfoProvDataSourcesKeys] = React.useState<Map<string, DataSourceKey>>(new Map());

    /**
     * The array with diagrams from the Infoprovider that is being edited.
     */
    const [infoProvDiagrams, setInfoProvDiagrams] = React.useState(infoProvider !== undefined ? infoProvider.diagrams : new Array<Diagram>());

    /**
     * The index to select the right DataSource that is wanted to edit
     */
    const [selectedDataSource, setSelectedDataSource] = React.useState(0);

    /**
     * formel-information to initialize the EditSingleFormelGUI
     */
    const [formelInformation, setFormelInformation] = React.useState<formelContext>({
        formelName: "",
        parenCount: 0,
        formelAsObjects: new Array<StrArg>(),
        dataFlag: false,
        numberFlag: false,
        opFlag: true,
        leftParenFlag: false,
        rightParenFlag: false
    });


    //flag for opening the dialog that restores authentication data on reload
    const [authDataDialogOpen, setAuthDataDialogOpen] = React.useState(false);

    const [historySelectionStep, setHistorySelectionStep] = React.useState(1);


    React.useEffect(() => {
        //create default values in the key map for all dataSources
        //necessary to not run into undefined values
        const map = new Map();
        const data: Array<DataSource> = sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!)
        data.forEach((dataSource) => {
            map.set(dataSource.apiName, {
                apiKeyInput1: "",
                apiKeyInput2: ""
            })
        });
        setInfoProvDataSourcesKeys(map);
    }, [])

    //TODO: add current state variables if needed
    /**
     * Method to check if there is api auth data to be lost when the user refreshes the page.
     * Needs to be separated from authDialogNeeded since this uses state while authDialogNeeded uses sessionStorage
     */
    const checkKeyExistence = React.useCallback(() => {
        //check the current data source
        //if((!noKey)&&(apiKeyInput1!==""||apiKeyInput2!=="")) return true;
        //check all other data sources
        for (let index = 0; index < infoProvDataSources.length; index++) {
            const dataSource = infoProvDataSources[index];
            if (infoProvDataSourcesKeys.get(dataSource.apiName) !== undefined) {
                if ((!dataSource.noKey) && (infoProvDataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 !== "" || infoProvDataSourcesKeys.get(dataSource.apiName)!.apiKeyInput2 !== "")) return true;
            }
        }
        return false;
    }, [infoProvDataSources, infoProvDataSourcesKeys])

    //TODO: is it necessary to fully copy here?
    /**
     * Defines event listener for reloading the page and removes it on unmounting.
     * The event listener will warn the user that api keys will be list an a reload.
     * Note: Custom messages seem not to be supported by modern browsers so we cant give an explicit warning here.
     * Displaying an additional alert or something is also not possibly since an re-render would be necessary.
     */
    React.useEffect(() => {
        const leaveAlert = (e: BeforeUnloadEvent) => {
            if (checkKeyExistence()) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", leaveAlert);
        return () => {
            window.removeEventListener("beforeunload", leaveAlert);
        }
    }, [checkKeyExistence])

    //TODO: check if current states are really not needed - possibly necessary when creation of additional dataSources is added
    /**
     * Checks if displaying a dialog for reentering authentication data on loading the component is necessary.
     * This will be the case if the current dataSource has not selected noKey or if any of the previously existing dataSources has noKey.
     * Needs to run based on sessionStorage since it is called in the first render.
     */
    const authDialogNeeded = () => {
        //TODO: switch to empty array instead of this debugging sample data when the fetching mechanism is implemented
        const data: Array<DataSource> = sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? new Array<DataSource>(
            {
                apiName: "apiName",
                query: "query",
                //apiKeyInput1: "apiKeyInput1",
                //apiKeyInput2: "apiKeyInput2",
                noKey: true,
                method: "KeyInHeader",
                selectedData: new Array<SelectedDataItem>(
                    {
                        key: "Array1|Data0",
                        type: "Zahl"
                    },
                    {
                        key: "Array1|Data1",
                        type: "Zahl"
                    }
                ),
                customData: new Array<FormelObj>(new FormelObj("formel1", "26 * 2"), new FormelObj("formel2", "formel1 * formel1")),
                historizedData: new Array<string>("formel1", "formel2"),
                schedule: {type: "weekly", interval: "", time: "18:00", weekdays: [4, 5]},
                listItems: [],
            },
            {
                apiName: "apiName2",
                query: "query2",
                //apiKeyInput1: "apiKeyInput1_2",
                //apiKeyInput2: "apiKeyInput2_2",
                noKey: false,
                method: "BearerToken",
                selectedData: new Array<SelectedDataItem>(
                    {
                        key: "Array2|Data0",
                        type: "Zahl"
                    },
                    {
                        key: "Array2|Data1",
                        type: "Zahl"
                    }
                ),
                customData: new Array<FormelObj>(new FormelObj("formel1_2", "(26 % data / ((7 + 5) * 8) + data2 - 3432412f) * 2"), new FormelObj("formel2_2", "25 * formel1_2 / (3 * (Array2|Data0 - 5))")),
                historizedData: new Array<string>("formel1_2", "Array2|Data0"),
                schedule: {type: "weekly", interval: "", time: "16:00", weekdays: [0, 1]},
                listItems: [],
            },
        ) : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!)
        //const noKeyCurrent: boolean = sessionStorage.getItem("noKey-" + uniqueId)==="true";
        //will only trigger if the user has selected a method and noKey - this makes sure he already got to step 2 in the current datasource
        //const methodCurrent: string = sessionStorage.getItem("method-" + uniqueId)||"";
        //if((!noKeyCurrent)&&methodCurrent!=="") return true;
        //else {
        for (let index = 0; index < data.length; index++) {
            if (!data[index].noKey) return true;
        }
        //}
        return false;
    }


    /**
     * Restores all data of the current session when the page is loaded. Used to not loose data on reloading the page.
     * The sets need to be converted back from Arrays that were parsed with JSON.stringify.
     */
    React.useEffect(() => {
        //step - disabled since it makes debugging more annoying
        setStep(Number(sessionStorage.getItem("step-" + uniqueId) || 0));
        //infoProvName
        setInfoProvName(sessionStorage.getItem("infoProvName-" + uniqueId) || "");
        //infoProvDataSource
        //TODO: switch to empty array instead of this debugging sample data when the fetching mechanism is implemented
        setInfoProvDataSources(sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? new Array<DataSource>(
            {
                apiName: "apiName",
                query: "query",
                //apiKeyInput1: "apiKeyInput1",
                //apiKeyInput2: "apiKeyInput2",
                noKey: true,
                method: "KeyInHeader",
                selectedData: new Array<SelectedDataItem>(
                    {
                        key: "Array1|Data0",
                        type: "Zahl"
                    },
                    {
                        key: "Array1|Data1",
                        type: "Zahl"
                    }
                ),
                customData: new Array<FormelObj>(new FormelObj("formel1", "26 * 2"), new FormelObj("formel2", "formel1 * formel1")),
                historizedData: new Array<string>("formel1", "formel2"),
                schedule: {type: "weekly", interval: "", time: "18:00", weekdays: [4, 5]},
                listItems: [],
            },
            {
                apiName: "apiName2",
                query: "query2",
                //apiKeyInput1: "apiKeyInput1_2",
                //apiKeyInput2: "apiKeyInput2_2",
                noKey: false,
                method: "BearerToken",
                selectedData: new Array<SelectedDataItem>(
                    {
                        key: "Array2|Data0",
                        type: "Zahl"
                    },
                    {
                        key: "Array2|Data1",
                        type: "Zahl"
                    }
                ),
                customData: new Array<FormelObj>(new FormelObj("formel1_2", "(26 % data / ((7 + 5) * 8) + data2 - 3432412f) * 2"), new FormelObj("formel2_2", "25 * formel1_2 / (3 * (Array2|Data0 - 5))")),
                historizedData: new Array<string>("formel1_2", "Array2|Data0"),
                schedule: {type: "weekly", interval: "", time: "16:00", weekdays: [0, 1]},
                listItems: [],
            },
        ) : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!));
        //infoProvDiagrams
        setInfoProvDiagrams(sessionStorage.getItem("infoProvDiagrams-" + uniqueId) === null ? new Array<Diagram>() : JSON.parse(sessionStorage.getItem("infoProvDiagrams-" + uniqueId)!));
        //selectedDataSource
        setSelectedDataSource(Number(sessionStorage.getItem("selectedDataSource-" + uniqueId) || 0));
        //formelInformation
        setFormelInformation(sessionStorage.getItem("formelInformation-" + uniqueId) === null ? {
            formelName: "",
            parenCount: 0,
            formelAsObjects: new Array<StrArg>(),
            dataFlag: false,
            numberFlag: false,
            opFlag: true,
            leftParenFlag: false,
            rightParenFlag: false
        } : JSON.parse(sessionStorage.getItem("formelInformation-" + uniqueId)!));

        //create default values in the key map for all dataSources
        //necessary to not run into undefined values
        const map = new Map();
        const data: Array<DataSource> = sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!)
        data.forEach((dataSource) => {
            map.set(dataSource.apiName, {
                apiKeyInput1: "",
                apiKeyInput2: ""
            })
        });
        setInfoProvDataSourcesKeys(map);

        if (authDialogNeeded()) {
            setAuthDataDialogOpen(true);
        }
    }, [])

    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("step-" + uniqueId, step.toString());
    }, [step])
    //store infoProvName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvName-" + uniqueId, infoProvName);
    }, [infoProvName])
    // Store infoProvDataSource in session storage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvDataSources-" + uniqueId, JSON.stringify(infoProvDataSources));
    }, [infoProvDataSources])
    // Store infoProvDiagrams in session storage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvDiagrams-" + uniqueId, JSON.stringify(infoProvDiagrams));
    }, [infoProvDiagrams])
    //store selectedDataSource in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("selectedDataSource-" + uniqueId, selectedDataSource.toString());
    }, [selectedDataSource])
    // Store infoProvDiagrams in session storage
    React.useEffect(() => {
        sessionStorage.setItem("formelInformation-" + uniqueId, JSON.stringify(formelInformation));
    }, [formelInformation])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("step-" + uniqueId);
        sessionStorage.removeItem("infoProvName-" + uniqueId);
        sessionStorage.removeItem("infoProvDataSources-" + uniqueId);
        sessionStorage.removeItem("infoProvDiagrams-" + uniqueId);
        sessionStorage.removeItem("selectedDataSource-" + uniqueId);
        sessionStorage.removeItem("formelInformation-" + uniqueId);
    }

    const steps = [
        "Überblick",
        "API-Daten",
        "Formeln",
        "Einzelne Formel bearbeiten",
        "Historisierung",
        "Diagramme"
    ];

    /**
     * Checks if historizedData in the selected DataSource holds any content.
     * If it is empty, the schedule-object will also be set to empty.
     * Through delete options historizedData can become empty.
     */
    const checkForHistorizedData = () => {
        if (infoProvDataSources[selectedDataSource].historizedData.length <= 0) {
            infoProvDataSources[selectedDataSource].schedule = {type: "", interval: "", time: "", weekdays: []}
        }
    }

    /**
     * setup for error notification
     */
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = React.useCallback((message: string) => {
        dispatchMessage({type: "reportError", message: message});
    }, []);

    /**
     * Handler method for changing the selectedData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param selectedData The new selectedData
     */
    const setSelectedData = (selectedData: Array<SelectedDataItem>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].selectedData = selectedData;
        setInfoProvDataSources(arCopy);
    }

    /**
     * Handler method for changing the historizedData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param historizedData The new historizedData
     */
    const setHistorizedData = (historizedData: Array<string>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].historizedData = historizedData;
        setInfoProvDataSources(arCopy);
    }

    const setSchedule = (schedule: Schedule) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].schedule = schedule;
        setInfoProvDataSources(arCopy)
    }

    /**
     * Handler method for changing the customData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param customData The new customData
     */
    const setCustomData = (customData: Array<FormelObj>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].customData = customData;
        setInfoProvDataSources(arCopy);
    }

    /**
     * Method that deletes all settings of the current dataSource and all diagrams using it.
     * Necessary for the case that the API data differs from how it was structured when the dataSource was
     * created so that selected data or used arrays arent contained anymore.
     * @param newListItems the new listItems returned by the API call
     */
    const cleanDataSource = (newListItems: Array<ListItemRepresentation>) => {
        const dataSourceCopy = {
            ...infoProvDataSources[selectedDataSource]
        }
        //clean diagrams depending on historized customData and historizedData
        const diagramsToRemove: Array<string> = [];
        dataSourceCopy.historizedData.forEach((historizedItem) => {
            infoProvDiagrams.forEach((diagram) => {
                //only diagrams with historizedData are relevant
                if (diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                    for (let index = 0; index < diagram.historizedObjects.length; index++) {
                        const historized = diagram.historizedObjects[index];
                        //the dataSource name needs to be added in front of the historized element name since historizedObjects has dataSource name in it paths too
                        //it is also checked if the same diagram has already been marked by another formula or historized data
                        if (infoProvName + "|" + historizedItem === historized.name && (!diagramsToRemove.includes(diagram.name))) {
                            diagramsToRemove.push(diagram.name);
                            break;
                        }
                    }
                }
            })
        })
        //clean diagrams depending on arrays - just find all arrayObjects containing the apiName as head of their key path
        infoProvDiagrams.forEach((diagram) => {
            //only diagrams with array as data are relevant
            if (diagram.sourceType === "Array" && diagram.arrayObjects !== undefined) {
                for (let index = 0; index < diagram.arrayObjects.length; index++) {
                    const array = diagram.arrayObjects[index];
                    //check if the dataSource name at the front is the same as the current apiName
                    if (infoProvName === array.listItem.parentKeyName) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            }
        })
        //delete all diagrams found
        if (diagramsToRemove.length > 0) {
            setInfoProvDiagrams(infoProvDiagrams.filter((diagram) => {
                return !diagramsToRemove.includes(diagram.name);
            }))
        }
        //clean selectedData
        dataSourceCopy.selectedData = [];
        //clean historizedData
        dataSourceCopy.historizedData = [];
        //clean customData
        dataSourceCopy.customData = [];
        //set listItems to the new value
        dataSourceCopy.listItems = newListItems;
        //set the new dataSource object
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource] = dataSourceCopy;
        setInfoProvDataSources(arCopy);
    }


    /**
     * Handler for continue button that is passed to all sub-component as props.
     * Increments the step by the given index.
     */
    const handleContinue = (index: number) => {
        setStep(step + index);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step by the given index or returns to the dashboard if the step was 0.
     */
    const handleBack = (index: number) => {
        if (step === 0) {
            clearSessionStorage();
            components?.setCurrent("dashboard")
            return;
        }
        setStep(step - index)
    }

    //TODO: find a better solution than copying - useCallback doesnt allow it to be on top level of helpermethods.tsx
    /**
     * Creates the plots array for a selected diagram to be sent to the backend.
     * @param diagram the diagram to be transformed
     */
    const createPlots = React.useCallback((diagram: Diagram) => {
        console.log(diagram.arrayObjects);
        const plotArray: Array<Plots> = [];
        let type: string;
        //transform the type to the string the backend needs
        switch (diagram.variant) {
            case "verticalBarChart": {
                type = "bar";
                break;
            }
            case "horizontalBarChart": {
                type = "barh";
                break;
            }
            case "dotDiagram": {
                type = "scatter";
                break;
            }
            case "lineChart": {
                type = "line";
                break;
            }
            case "pieChart": {
                type = "pie";
                break;
            }
        }
        if (diagram.sourceType === "Array") {
            if (diagram.arrayObjects !== undefined) {
                diagram.arrayObjects.forEach((item) => {
                    const plots = {
                        customLabels: item.customLabels,
                        primitive: !Array.isArray(item.listItem.value),
                        plot: {
                            type: type,
                            x: Array.from(Array(diagram.amount).keys()),
                            y: item.listItem.parentKeyName === "" ? item.listItem.keyName : item.listItem.parentKeyName + "|" + item.listItem.keyName,
                            color: item.color,
                            numericAttribute: item.numericAttribute,
                            stringAttribute: item.stringAttribute,
                            x_ticks: {
                                ticks: item.labelArray
                            }
                        }
                    }
                    plotArray.push(plots);
                })
            }
        } else {
            //"Historized"
            if (diagram.historizedObjects !== undefined) {
                diagram.historizedObjects.forEach((item) => {
                    const plots = {
                        dateLabels: item.dateLabels,
                        plot: {
                            type: type,
                            x: Array.from(Array(diagram.amount).keys()),
                            y: item.name,
                            color: item.color,
                            dateFormat: item.dateFormat,
                            x_ticks: {
                                ticks: item.labelArray
                            }
                        }
                    }
                    plotArray.push(plots);
                })
            }
        }
        return plotArray;
    }, [])

    //TODO: find better option than just copy it
    //TODO: update as soon as the possibility of having new dataSources exists
    /**
     * Method to construct an array of all dataSources names where the user needs to re-enter his authentication data.
     */
    const buildDataSourceSelection = () => {
        const dataSourceSelection: Array<authDataDialogElement> = [];
        //check the current data source and add it as an option
        /*if(!noKey) {
            dataSourceSelection.push({
                name: "current--"+ uniqueId,
                method: method
            })
        }*/
        //check all other data sources
        if (infoProvDataSources !== undefined) {
            infoProvDataSources.forEach((dataSource) => {
                //input is necessary if any method of authentication is being used
                if (!dataSource.noKey) {
                    //add to the selection
                    dataSourceSelection.push({
                        name: dataSource.apiName,
                        method: dataSource.method
                    })
                }
            })
        }
        return dataSourceSelection
    }

    /**
     * Method to send the edited infoprovider to the backend.
     * The backend will now update the infoprovider with the new data.
     */
    const finishEditing = () => {
        postInfoProvider();
    }


    /**
     * Handler for the return of a successful call to the backend (posting info-provider)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccess = (jsonData: any) => {
        //TODO: cleanup sessionStorage
        components?.setCurrent("dashboard")
    }

    /**
     * Handler for unsuccessful call to the backend (posting info-provider)
     * @param err The error returned by the backend
     */
    const handleError = (err: Error) => {
        reportError("Fehler: Senden des Info-Providers an das Backend fehlgeschlagen! (" + err.message + ")");
    }


    const createDataSources = () => {
        const backendDataSources: Array<BackendDataSource> = [];
        infoProvDataSources.forEach((dataSource) => {
            backendDataSources.push({
                datasource_name: dataSource.apiName,
                api: {
                    api_info: {
                        type: "request",
                        //api_key_name: dataSource.method==="BearerToken"?dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1:dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 + "||" + dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput2,
                        //TODO: change when the merge has happened
                        api_key_name: "",
                        url_pattern: dataSource.query,
                    },
                    method: dataSource.noKey ? "noAuth" : dataSource.method,
                    response_type: "json", // TODO Add xml support
                },
                transform: [],
                storing: [],
                formulas: dataSource.customData,
                schedule: {
                    type: dataSource.schedule.type,
                    time: dataSource.schedule.time,
                    date: "",
                    time_interval: dataSource.schedule.interval,
                    weekdays: dataSource.schedule.weekdays
                },
                selected_data: dataSource.selectedData,
                historized_data: dataSource.historizedData,
            })
        });
        return backendDataSources;
    }

    const createBackendDiagrams = () => {
        //TODO: possibly find smarter solution without any type
        const diagramsObject: any = {};
        infoProvDiagrams.forEach((diagram) => {
            diagramsObject[diagram.name] = {
                type: "diagram_custom",
                diagram_config: {
                    type: "custom",
                    name: diagram.name,
                    infoprovider: infoProvName,
                    sourceType: diagram.sourceType,
                    plots: createPlots(diagram)
                }
            }
        })
        return diagramsObject;
    }

    //TODO: test this method when it is used
    /**
     * Method that creates a list of all arrays that are used in diagrams.
     * Necessary for forming the object of the infoprovider sent to the backend.
     */
    const getArraysUsedByDiagrams = () => {
        const arraysInDiagrams: Array<string> = [];
        infoProvDiagrams.forEach((diagram) => {
            if (diagram.sourceType !== "Array") return;
            else if (diagram.arrayObjects !== undefined) {
                diagram.arrayObjects.forEach((array) => {
                    //checking for empty parentKeyName is not necessary since the dataSource name is always included
                    arraysInDiagrams.push(array.listItem.parentKeyName + "|" + array.listItem.keyName)
                })
            }
        })
        return arraysInDiagrams;
    }


    /**
     * Method to post all settings for the Info-Provider made by the user to the backend.
     * The backend will use this data to create the desired Info-Provider.
     */
    const postInfoProvider = useCallFetch("visuanalytics/infoprovider/" + infoProvId,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                infoprovider_name: infoProvName,
                datasources: createDataSources(),
                diagrams: createBackendDiagrams(),
                diagrams_original: infoProvDiagrams,
                arrays_used_in_diagrams: getArraysUsedByDiagrams()
            })
        }, handleSuccess, handleError
    );

    const finishNewDataSource = (dataSource: DataSource, apiKeyInput1: string, apiKeyInput2: string) => {
        setInfoProvDataSources(infoProvDataSources.concat(dataSource));
        const mapCopy = new Map(infoProvDataSourcesKeys)
        setInfoProvDataSourcesKeys(mapCopy.set(dataSource.apiName, {
            apiKeyInput1: apiKeyInput1,
            apiKeyInput2: apiKeyInput2
        }));
        setNewDataSourceMode(false);
    }

    const cancelDataSourceCreation = () => {
        setNewDataSourceMode(false);
    }

    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        if (newDataSourceMode) {
            return (
                <React.Fragment>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Infoproviderbearbeitung
                            </Typography>
                        </Grid>
                    </Grid>
                    <CreateInfoProvider
                        finishDataSourceInEdit={finishNewDataSource}
                        cancelNewDataSourceInEdit={cancelDataSourceCreation}
                    />
                </React.Fragment>
            );
        }
        switch (step) {
            case 0:
                return (
                    <EditSettingsOverview
                        continueHandler={(index: number) => handleContinue(index)}
                        handleBack={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                        infoProvName={infoProvName}
                        setInfoProvName={(name: string) => setInfoProvName(name)}
                        infoProvDataSources={infoProvDataSources}
                        selectedDataSource={selectedDataSource}
                        setSelectedDataSource={(index: number) => setSelectedDataSource(index)}
                        finishNewDataSource={finishNewDataSource}
                        setNewDataSourceMode={setNewDataSourceMode}
                    />
                );
            case 1:
                //TODO: replace test values as soon as merged with branch containing sessionStorage
                return (
                    <EditDataSelection
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                        reportError={reportError}
                        dataSource={infoProvDataSources[selectedDataSource]}
                        apiKeyInput1={infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput1}
                        apiKeyInput2={infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput2}
                        diagrams={infoProvDiagrams}
                        setSelectedData={(selectedData: Array<SelectedDataItem>) => setSelectedData(selectedData)}
                        setHistorizedData={(historizedData: Array<string>) => setHistorizedData(historizedData)}
                        setCustomData={(customData: Array<FormelObj>) => setCustomData(customData)}
                        cleanDataSource={(newListItems: Array<ListItemRepresentation>) => cleanDataSource(newListItems)}
                    />
                );
            case 2:
                return (
                    <EditCustomData
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                        infoProvDataSources={infoProvDataSources}
                        selectedDataSource={selectedDataSource}
                        checkForHistorizedData={checkForHistorizedData}
                        setFormelInformation={(formel: formelContext) => setFormelInformation(formel)}
                    />
                );
            case 3:
                return (
                    <EditSingleFormel
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                        infoProvDataSources={infoProvDataSources}
                        selectedDataSource={selectedDataSource}
                        reportError={reportError}
                        formel={formelInformation}
                    />
                )
            case 4:
                return (
                    <HistorySelection
                        continueHandler={() => setStep(5)}
                        backHandler={() => setStep(2)}
                        selectedData={extractKeysFromSelection(infoProvDataSources[selectedDataSource].selectedData)}
                        customData={infoProvDataSources[selectedDataSource].customData}
                        historizedData={infoProvDataSources[selectedDataSource].historizedData}
                        setHistorizedData={(set: Array<string>) => setHistorizedData(set)}
                        schedule={infoProvDataSources[selectedDataSource].schedule}
                        selectSchedule={(schedule: Schedule) => setSchedule(schedule)}
                        historySelectionStep={historySelectionStep}
                        setHistorySelectionStep={(step: number) => setHistorySelectionStep(step)}
                    />
                )
            case 5:
                return (
                    <Grid>
                        <DiagramCreation
                            continueHandler={() => setStep(0)}
                            backHandler={() => setStep(4)}
                            dataSources={infoProvDataSources}
                            diagrams={infoProvDiagrams}
                            setDiagrams={setInfoProvDiagrams}
                            reportError={reportError}
                            infoProviderName={infoProvName}
                            createPlots={createPlots}
                        />
                    </Grid>
                )

        }
    }

    return (
        <React.Fragment>
            {!newDataSourceMode && (
                <Container maxWidth={"md"}>
                    <Stepper activeStep={step}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Container>
            )}
            {selectContent(step)}
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
            {authDataDialogOpen &&
            <AuthDataDialog
                authDataDialogOpen={authDataDialogOpen}
                setAuthDataDialogOpen={(open: boolean) => setAuthDataDialogOpen(open)}
                method={""}
                apiKeyInput1={""}
                setApiKeyInput1={(input: string) => console.log("NOT IMPLEMENTED: setApiKeyInput1")}
                apiKeyInput2={""}
                setApiKeyInput2={(input: string) => console.log("NOT IMPLEMENTED: setApiKeyInput1")}
                dataSourcesKeys={infoProvDataSourcesKeys}
                setDataSourcesKeys={(map: Map<string, DataSourceKey>) => setInfoProvDataSourcesKeys(map)}
                selectionDataSources={buildDataSourceSelection()}
                apiName={""}
            />
            }
        </React.Fragment>
    );
}