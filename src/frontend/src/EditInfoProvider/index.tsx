import React, {useEffect, useRef} from "react";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {ComponentContext} from "../ComponentProvider";
import {StrArg} from "../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {FormelContext/*, InfoProviderObj*/} from "./types";
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
    uniqueId, ArrayProcessingData, StringReplacementData
} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {DiagramCreation} from "../CreateInfoProvider/DiagramCreation";
import {AuthDataDialog} from "../CreateInfoProvider/AuthDataDialog";
import {HistorySelection} from "../CreateInfoProvider/HistorySelection";
import {createCalculates, createReplacements, extractKeysFromSelection} from "../CreateInfoProvider/helpermethods";
import {Schedule} from "./types";
import {CreateInfoProvider} from "../CreateInfoProvider";
import {EditBasicSettings} from "./EditBasicSettings";
import {EditDataCustomization} from "./EditDataCustomization";


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

task 5: sessionStorage compatibility with AuthDataDialog (Janek)
task 7: reload data from api in DataSelection and compare if all selectedData-items are contained in the new listItems (Janek)
task 8: component for DataSelection (Janek)
task 10: add additional data sources (Daniel)

task 12: load data from backend (Janek)
task 13: send data to backend (Janek)
NOT DONE:
task 9: historized data (Tristan)
task 11: delete dependencies (???)
 */


export const EditInfoProvider: React.FC<EditInfoProviderProps> = (props) => {


    const components = React.useContext(ComponentContext);

    //stores a copy of the passed infoProviderID - necessary since it is passed via context switch and wont be kept on reload
    const [infoProvId, setInfoProvId] = React.useState(props.infoProvId !== undefined ? props.infoProvId : 0);
    /**
     * the current step of the creation process, numbered by 0 to 5
     */
    const [editStep, setEditStep] = React.useState(0);
    /**
     * The name of the infoprovider that is being edited
     */
    const [infoProvName, setInfoProvName] = React.useState(props.infoProvider !== undefined ? props.infoProvider.infoproviderName : "");

    const [newDataSourceMode, setNewDataSourceMode] = React.useState(false);

    //holds the dataSources of the edited infoProvider
    //always gets the value from the sessionStorage, but if it is not defined (first entering), the data is fetched from the props
    const [infoProvDataSources, setInfoProvDataSources] = React.useState<Array<DataSource>>(sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? props.infoProvider!.dataSources : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!));
    //Holds the values of apiKeyInput1 and apiKeyInput2 of each dataSource - map where dataSource name is the key
    const [infoProvDataSourcesKeys, setInfoProvDataSourcesKeys] = React.useState<Map<string, DataSourceKey>>(props.infoProvider !== undefined ? props.infoProvider.dataSourcesKeys : new Map<string, DataSourceKey>());
    /**
     * The array with diagrams from the Infoprovider that is being edited.
     */
    const [infoProvDiagrams, setInfoProvDiagrams] = React.useState(props.infoProvider !== undefined ? props.infoProvider.diagrams : new Array<Diagram>());
    /**
     * The index to select the right DataSource that is wanted to edit
     */
    const [selectedDataSource, setSelectedDataSource] = React.useState(0);
    /**
     * formel-information to initialize the EditSingleFormelGUI
     */
    const [formelInformation, setFormelInformation] = React.useState<FormelContext>({
        formelName: "",
        parenCount: 0,
        formelAsObjects: new Array<StrArg>(),
        dataFlag: false,
        numberFlag: false,
        opFlag: true,
        leftParenFlag: false,
        rightParenFlag: false,
        usedFormulaAndApiData: []
    });
    //flag for opening the dialog that restores authentication data on reload
    const [authDataDialogOpen, setAuthDataDialogOpen] = React.useState(false);
    //represents the current step in the historization selection
    const [historySelectionStep, setHistorySelectionStep] = React.useState(1);
    //represents the current step in data customization: 0 is array processing, 1 is formula and 2 is string processing
    const [dataCustomizationStep, setDataCustomizationStep] = React.useState(0);
    //true when the button for submitting the infoprovider is blocked because a request is running
    const [submitInfoProviderDisabled, setSubmitInfoProviderDisabled] = React.useState(false);
    //TODO: document this!!
    //array that contains a boolean for each dataSource indicating if refetching of api-data for checkup has already been done on them
    const [refetchDoneList, setRefetchDoneList] = React.useState<Array<boolean>>(new Array(sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? props.infoProvider!.dataSources.length : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!).length).fill(false))
    console.log(refetchDoneList)


    //TODO: add current state variables if needed
    /**
     * Method to check if there is api auth data to be lost when the user refreshes the page.
     * Needs to be separated from authDialogNeeded since this uses state while authDialogNeeded uses sessionStorage
     */
    const checkKeyExistence = React.useCallback(() => {
        //check the current data source
        //if((!noKey)&&(apiKeyInput1!==""||apiKeyInput2!=="")) return true;
        //check all other data sources
        console.log(infoProvDataSources);
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
        const data: Array<DataSource> = sessionStorage.getItem("infoProvDataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!)
        //const noKeyCurrent: boolean = sessionStorage.getItem("noKey-" + uniqueId)==="true";
        //will only trigger if the user has selected a method and noKey - this makes sure he already got to editStep 2 in the current datasource
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
        if (sessionStorage.getItem("firstEntering-" + uniqueId) !== null) {
            //infoProvId
            //TODO: check if the 0 case can be problematic - it should not since this if-block is only rendered AFTER the first render and so the id is set in the sessionStorage
            setInfoProvId(Number(sessionStorage.getItem("infoProvId-" + uniqueId) || 0));
            //editStep - disabled since it makes debugging more annoying
            setEditStep(Number(sessionStorage.getItem("editStep-" + uniqueId) || 0));
            //infoProvName
            setInfoProvName(sessionStorage.getItem("infoProvName-" + uniqueId) || "");
            //newDataSourceMode
            setNewDataSourceMode(sessionStorage.getItem("newDataSourceMode-" + uniqueId) === "true");
            //infoProvDataSource doesnt need to be fetched since it works with the initial value
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
            //historySelectionStep
            setHistorySelectionStep(Number(sessionStorage.getItem("historySelectionStep-" + uniqueId) || 0));
            //dataCustomizationStep
            setDataCustomizationStep(Number(sessionStorage.getItem("dataCustomizationStep-" + uniqueId) || 0));
            //refetchDoneList
            setRefetchDoneList(sessionStorage.getItem("refetchDoneList-" + uniqueId) === null ? new Array<boolean>() : JSON.parse(sessionStorage.getItem("refetchDoneList-" + uniqueId)!));

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
        } else {
            //leave a marker in the sessionStorage to identify if this is the first entering
            //necessary to not overwrite the map on first entering
            sessionStorage.setItem("firstEntering-" + uniqueId, "false");
        }
    }, [])

    //store infoProvId in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvId-" + uniqueId, infoProvId!.toString());
    }, [infoProvId])
    //store editStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("editStep-" + uniqueId, editStep.toString());
    }, [editStep])
    //store infoProvName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("infoProvName-" + uniqueId, infoProvName);
    }, [infoProvName])
    //store newDataSourceMode in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("noKey-" + uniqueId, newDataSourceMode ? "true" : "false");
    }, [newDataSourceMode])
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
    //store historySelectionStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("historySelectionStep-" + uniqueId, historySelectionStep.toString());
    }, [historySelectionStep])
    //store dataCustomizationStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("dataCustomizationStep-" + uniqueId, dataCustomizationStep.toString());
    }, [dataCustomizationStep])
    const refetchDoneListChange = refetchDoneList.toString();
    //store refetchDoneList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("refetchDoneList-" + uniqueId, JSON.stringify(refetchDoneList));
    }, [refetchDoneListChange, refetchDoneList]) //TODO: find out why this behaviour needs toString to get triggered

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("infoProvId-" + uniqueId);
        sessionStorage.removeItem("editStep-" + uniqueId);
        sessionStorage.removeItem("infoProvName-" + uniqueId);
        sessionStorage.removeItem("newDataSourceMode-" + uniqueId);
        sessionStorage.removeItem("infoProvDataSources-" + uniqueId);
        sessionStorage.removeItem("infoProvDiagrams-" + uniqueId);
        sessionStorage.removeItem("selectedDataSource-" + uniqueId);
        sessionStorage.removeItem("formelInformation-" + uniqueId);
        sessionStorage.removeItem("historySelectionStep-" + uniqueId);
        sessionStorage.removeItem("dataCustomizationStep-" + uniqueId);
        sessionStorage.removeItem("firstEntering-" + uniqueId);
        sessionStorage.removeItem("historizedObjects-" + uniqueId);
        sessionStorage.removeItem("diagramSource-" + uniqueId);
        sessionStorage.removeItem("arrayObjects-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        sessionStorage.removeItem("diagramStep-" + uniqueId);
        sessionStorage.removeItem("refetchDoneList-" + uniqueId);
    }

    const steps = [
        "Überblick",
        "API-Einstellungen",
        "API-Daten",
        "Datenverarbeitung",
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
     * Checks if a given API name already exists in the data sources
     * This is needed for changing basic settings
     * @param name The name of the data source which should be checked for duplicate
     */
    const checkNameDuplicate = (name: string) => {
        for (let i = 0; i < infoProvDataSources.length; i++) {
            if (infoProvDataSources[i].apiName === name && i !== selectedDataSource) return true;
        }
        return false;
    }

    /**
     * Method for updating the query of the selected data source
     * Needed when editing the selected data source
     * @param query The new query for the selected data source
     */
    const setQuery = (query: string) => {
        const arrCopy = infoProvDataSources.slice();
        arrCopy[selectedDataSource].query = query;
        setInfoProvDataSources(arrCopy);
    }

    /**
     * Sets the first field from api Keys
     * Needed when editing the basic settings
     * @param key The content from the first key input field
     */
    const setApiKeyInput1 = (key: string) => {
        const key2 = infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)
        const keyMap = new Map(infoProvDataSourcesKeys);
        setInfoProvDataSourcesKeys(keyMap.set(infoProvDataSources[selectedDataSource].apiName, {
            apiKeyInput1: key,
            apiKeyInput2: key2 === undefined ? "" : key2.apiKeyInput2
        }));
    }

    /**
     * Sets the second field from api Keys
     * Needed when editing the basic settings
     * @param key The content from the second key input field
     */
    const setApiKeyInput2 = (key: string) => {
        const key1 = infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)
        const keyMap = new Map(infoProvDataSourcesKeys);
        setInfoProvDataSourcesKeys(keyMap.set(infoProvDataSources[selectedDataSource].apiName, {
            apiKeyInput1: key1 === undefined ? "" : key1.apiKeyInput1,
            apiKeyInput2: key
        }));
    }

    /**
     * Updates the noKey property of the selected data source
     * Needed for editing the basic settings
     * @param noKey Value for the property of noKey for the selected data source
     */
    const setNoKey = (noKey: boolean) => {
        const arrCopy = infoProvDataSources.slice();
        arrCopy[selectedDataSource].noKey = noKey;
        setInfoProvDataSources(arrCopy);
    }

    /**
     * Method which updates the authentication method for the selected data source
     * Needed when editing the basic settings
     * @param method The new authentication method for the selected data source
     */
    const setMethod = (method: string) => {
        const arrCopy = infoProvDataSources.slice();
        arrCopy[selectedDataSource].method = method;
        setInfoProvDataSources(arrCopy);
    }

    /**
     * Method for updating the name for the selected data source
     * This is needed for editing the basic settings
     * @param apiName The new api name for the selected data ource
     */
    const setApiName = (apiName: string) => {
        const arrCopy = infoProvDataSources.slice();
        arrCopy[selectedDataSource].apiName = apiName;
        setInfoProvDataSources(arrCopy);
    }
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
     * Handler method for changing the arrayProcessingsList of the current data source in infoProvDataSources.
     * Used for the integration of ArrayProcessing.
     * @param arrayProcessingsList The new list of array processings.
     */
    const setArrayProcessingsList = (arrayProcessingsList: Array<ArrayProcessingData>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].arrayProcessingsList = arrayProcessingsList;
        setInfoProvDataSources(arCopy);
    }
    /**
     * Handler method for changing the stringReplacementList of the current data source in infoProvDataSources.
     * Used for the integration of StringProcessing.
     * @param stringReplacementList The new list of string replacements.
     */
    const setStringReplacementList = (stringReplacementList: Array<StringReplacementData>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].stringReplacementList = stringReplacementList;
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
        setEditStep(editStep + index);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step by the given index or returns to the dashboard if the step was 0.
     */
    const handleBack = (index: number) => {
        if (editStep === 0) {
            clearSessionStorage();
            components?.setCurrent("dashboard")
            return;
        }
        setEditStep(editStep - index)
    }


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
        setSubmitInfoProviderDisabled(true);
        postInfoProvider();
    }


    /**
     * Handler for the return of a successful call to the backend (posting info-provider)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccessPostInfoProvider = React.useCallback((jsonData: any) => {
        setSubmitInfoProviderDisabled(false);
        components?.setCurrent("dashboard");
        clearSessionStorage();
    }, [components]);

    /**
     * Handler for unsuccessful call to the backend (posting info-provider)
     * @param err The error returned by the backend
     */
    const handleErrorPostInfoProvider = React.useCallback((err: Error) => {
        setSubmitInfoProviderDisabled(false);
        reportError("Fehler: Senden des Info-Providers an das Backend fehlgeschlagen! (" + err.message + ")");
    }, [reportError]);


    //TODO: find out why this method is called too often
    const createDataSources = React.useCallback(() => {
        const backendDataSources: Array<BackendDataSource> = [];
        infoProvDataSources.forEach((dataSource) => {
            //this check should be prevented, but there is some bug behaviour where this method is called too often and errors happen
            if (infoProvDataSourcesKeys.get(dataSource.apiName) !== undefined) {
                backendDataSources.push({
                    datasource_name: dataSource.apiName,
                    api: {
                        api_info: {
                            type: "request",
                            api_key_name: dataSource.method === "BearerToken" ? infoProvDataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 : infoProvDataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 + "||" + infoProvDataSourcesKeys.get(dataSource.apiName)!.apiKeyInput2,
                            url_pattern: dataSource.query,
                        },
                        method: dataSource.noKey ? "noAuth" : dataSource.method,
                        response_type: "json", // TODO Add xml support
                    },
                    transform: [],
                    storing: [],
                    formulas: dataSource.customData,
                    calculates: createCalculates(dataSource.arrayProcessingsList, dataSource.apiName),
                    replacements: createReplacements(dataSource.stringReplacementList, dataSource.apiName),
                    schedule: {
                        type: dataSource.schedule.type,
                        time: dataSource.schedule.time,
                        date: "",
                        timeInterval: dataSource.schedule.interval,
                        weekdays: dataSource.schedule.weekdays
                    },
                    selected_data: dataSource.selectedData,
                    historized_data: dataSource.historizedData,
                    arrayProcessingsList: dataSource.arrayProcessingsList,
                    stringReplacementList: dataSource.stringReplacementList,
                    //TODO: ADD THIS TO DOCUMENTATION!!!
                    listItems: dataSource.listItems
                })
            }
        });
        return backendDataSources;
    }, [infoProvDataSources, infoProvDataSourcesKeys]);

    /**
     * Creates the plots array for a selected diagram to be sent to the backend.
     * @param diagram the diagram to be transformed
     */
    const createPlots = React.useCallback((diagram: Diagram) => {
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
                            x: item.intervalSizes,
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


    const createBackendDiagrams = React.useCallback(() => {
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
    }, [createPlots, infoProvDiagrams, infoProvName]);


    //TODO: test this method when it is used
    /**
     * Method that creates a list of all arrays that are used in diagrams.
     * Necessary for forming the object of the infoprovider sent to the backend.
     */
    const getArraysUsedByDiagrams = React.useCallback(() => {
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
    }, [infoProvDiagrams]);

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);


    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since it seemingly caused method calls on each render.
     */
    const postInfoProvider = React.useCallback(() => {
        //("fetcher called");
        let url = "visuanalytics/infoprovider/" + infoProvId
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
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
            }),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleSuccessPostInfoProvider(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleErrorPostInfoProvider(err)
        }).finally(() => clearTimeout(timer));
    }, [infoProvId, createBackendDiagrams, createDataSources, infoProvDiagrams, getArraysUsedByDiagrams, handleErrorPostInfoProvider, handleSuccessPostInfoProvider, infoProvName])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    //TODO: documentation is missing!!!! @Daniel
    const finishNewDataSource = (dataSource: DataSource, apiKeyInput1: string, apiKeyInput2: string) => {
        setInfoProvDataSources(infoProvDataSources.concat(dataSource));
        const mapCopy = new Map(infoProvDataSourcesKeys)
        setInfoProvDataSourcesKeys(mapCopy.set(dataSource.apiName, {
            apiKeyInput1: apiKeyInput1,
            apiKeyInput2: apiKeyInput2
        }));
        setNewDataSourceMode(false);
        //add an entry for the new dataSource to the refetchDoneList - true as value since it was just fetched while creating
        const arCopy = refetchDoneList;
        arCopy.push(true);
        setRefetchDoneList(arCopy);
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
                        setInfoProvDataSources={(dataSources: Array<DataSource>) => setInfoProvDataSources(dataSources)}
                        selectedDataSource={selectedDataSource}
                        setSelectedDataSource={(index: number) => setSelectedDataSource(index)}
                        finishNewDataSource={finishNewDataSource}
                        setNewDataSourceMode={setNewDataSourceMode}
                        infoProvDiagrams={infoProvDiagrams}
                        setInfoProvDiagrams={(diagrams: Array<Diagram>) => setInfoProvDiagrams(diagrams)}
                        infoProvDataSourcesKeys={infoProvDataSourcesKeys}
                        setInfoProvDataSourcesKeys={(keys: Map<string, DataSourceKey>) => setInfoProvDataSourcesKeys(keys)}
                        submitInfoProviderDisabled={submitInfoProviderDisabled}
                    />
                );
            case 1:
                return (
                    <EditBasicSettings
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        checkNameDuplicate={checkNameDuplicate}
                        query={infoProvDataSources[selectedDataSource].query}
                        setQuery={setQuery}
                        apiKeyInput1={infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName) === undefined ? "" : infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput1}
                        setApiKeyInput1={setApiKeyInput1}
                        apiKeyInput2={infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName) === undefined ? "" : infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput2}
                        setApiKeyInput2={setApiKeyInput2}
                        noKey={infoProvDataSources[selectedDataSource].noKey}
                        setNoKey={setNoKey}
                        method={infoProvDataSources[selectedDataSource].method}
                        setMethod={setMethod}
                        apiName={infoProvDataSources[selectedDataSource].apiName}
                        setApiName={setApiName}
                        reportError={reportError}
                        setSelectedData={setSelectedData}
                        setCustomData={setCustomData}
                        setHistorizedData={setHistorizedData}
                        setSchedule={setSchedule}
                        setHistorySelectionStep={setHistorySelectionStep}
                        diagrams={infoProvDiagrams}
                        setDiagrams={(diagrams: Array<Diagram>) => setInfoProvDiagrams(diagrams)}
                        setListItems={(listItems: Array<ListItemRepresentation>) => {
                            return
                        }}
                    />
                )
            case 2:
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
                        setDiagrams={(diagrams: Array<Diagram>) => setInfoProvDiagrams(diagrams)}
                        setSelectedData={(selectedData: Array<SelectedDataItem>) => setSelectedData(selectedData)}
                        setHistorizedData={(historizedData: Array<string>) => setHistorizedData(historizedData)}
                        setCustomData={(customData: Array<FormelObj>) => setCustomData(customData)}
                        cleanDataSource={(newListItems: Array<ListItemRepresentation>) => cleanDataSource(newListItems)}
                        infoProvDataSources={infoProvDataSources}
                        selectedDataSource={selectedDataSource}
                        dataCustomizationStep={dataCustomizationStep}
                        setDataCustomizationStep={(step: number) => setDataCustomizationStep(step)}
                        refetchDoneList={refetchDoneList}
                        setRefetchDoneList={(list: Array<boolean>) => setRefetchDoneList(list)}
                    />
                );
            case 3:
                return (
                    <EditDataCustomization
                        continueHandler={() => handleContinue(1)}
                        backHandler={() => handleBack(1)}
                        dataCustomizationStep={dataCustomizationStep}
                        setDataCustomizationStep={(step: number) => setDataCustomizationStep(step)}
                        reportError={reportError}
                        infoProvName={infoProvName}
                        infoProvDataSources={infoProvDataSources}
                        setInfoProvDataSources={(dataSources: Array<DataSource>) => setInfoProvDataSources(dataSources)}
                        selectedDataSource={selectedDataSource}
                        infoProvDiagrams={infoProvDiagrams}
                        setInfoProvDiagrams={(array: Array<Diagram>) => setInfoProvDiagrams(array)}
                        listItems={infoProvDataSources[selectedDataSource].listItems}
                        customData={infoProvDataSources[selectedDataSource].customData}
                        arrayProcessingsList={infoProvDataSources[selectedDataSource].arrayProcessingsList}
                        stringReplacementList={infoProvDataSources[selectedDataSource].stringReplacementList}
                        setHistorizedData={(array: Array<string>) => setHistorizedData(array)}
                        setSelectedData={(array: Array<SelectedDataItem>) => setSelectedData(array)}
                        setCustomData={(array: Array<FormelObj>) => setCustomData(array)}
                        setArrayProcessingsList={(processings: Array<ArrayProcessingData>) => setArrayProcessingsList(processings)}
                        setStringReplacementList={(replacements: Array<StringReplacementData>) => setStringReplacementList(replacements)}
                        finishEditing={finishEditing}
                        checkForHistorizedData={checkForHistorizedData}
                        formel={formelInformation}
                        setFormelInformation={(formelInformation: FormelContext) => setFormelInformation(formelInformation)}
                    />
                );
            case 4:
                return (

                    <HistorySelection
                        continueHandler={() => setEditStep(0)}
                        backHandler={() => setEditStep(3)}
                        selectedData={extractKeysFromSelection(infoProvDataSources[selectedDataSource].selectedData)}
                        customData={infoProvDataSources[selectedDataSource].customData}
                        arrayProcessingsList={infoProvDataSources[selectedDataSource].arrayProcessingsList}
                        stringReplacementList={infoProvDataSources[selectedDataSource].stringReplacementList}
                        historizedData={infoProvDataSources[selectedDataSource].historizedData}
                        setHistorizedData={(set: Array<string>) => setHistorizedData(set)}
                        schedule={infoProvDataSources[selectedDataSource].schedule}
                        selectSchedule={(schedule: Schedule) => setSchedule(schedule)}
                        historySelectionStep={historySelectionStep}
                        setHistorySelectionStep={(step: number) => setHistorySelectionStep(step)}
                        diagrams={infoProvDiagrams}
                        setDiagrams={(diagrams: Array<Diagram>) => setInfoProvDiagrams(diagrams)}
                        apiName={infoProvDataSources[selectedDataSource].apiName}
                        newDataSourceInEditMode={false}
                    />
                )
            case 5:
                return (
                    <Grid>
                        <DiagramCreation
                            continueHandler={() => setEditStep(0)}
                            backHandler={() => setEditStep(0)}
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
                    <Stepper activeStep={editStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Container>
            )}
            {selectContent(editStep)}
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
