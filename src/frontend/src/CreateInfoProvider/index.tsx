import React, {useEffect, useRef, useState} from "react";
import {CenterNotification, centerNotifcationReducer} from "../util/CenterNotification";
import {BasicSettings} from "./BasicSettings";
import {TypeSelection} from "./TypeSelection";
import {HistorySelection} from "./HistorySelection";
import {DataSelection} from "./DataSelection";
import Container from "@material-ui/core/Container";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {SettingsOverview} from "./SettingsOverview";
import {FormelObj} from "./DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj"
import {
    DataSource,
    DataSourceKey,
    ListItemRepresentation,
    Schedule,
    SelectedDataItem,
    AuthDataDialogElement,
    uniqueId,
    Diagram,
    Plots,
    BackendDataSource,
    ArrayProcessingData,
    StringReplacementData,
} from "./types";
import {createCalculates, createReplacements, extractKeysFromSelection} from "./helpermethods";
import {AuthDataDialog} from "./AuthDataDialog";
import {ComponentContext} from "../ComponentProvider";
import {DiagramCreation} from "./DiagramCreation";
import {DataCustomization} from "./DataCustomization";


interface CreateInfoproviderProps {
    finishDataSourceInEdit?: (dataSource: DataSource, apiKeyInput1: string, apiKeyInput2: string) => void;
    cancelNewDataSourceInEdit?: () => void;
    checkDuplicateNameInEdit?: (name: string) => boolean;
}

/*
Wrapper component for the creation of a new info-provider.
This component manages which step is active and displays the corresponding content.
 */
export const CreateInfoProvider: React.FC<CreateInfoproviderProps> = (props) => {
    const components = React.useContext(ComponentContext);

    //console.log(props.finishDataSourceInEdit);

    //const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const steps = props.finishDataSourceInEdit === undefined ? [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Datenverarbeitungen",
        "Historisierung",
        "Gesamtübersicht",
        "Diagrammerstellung"
    ] : [
        "Datenquellen-Typ",
        "API-Einstellungen",
        "Datenauswahl",
        "Datenverarbeitungen",
        "Historisierung",
    ];

    //the current step of the creation process, numbered by 0 to 6
    const [createStep, setCreateStep] = React.useState(0);
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
    //holds the data delivered from the currently created API -> DOESNT SEEM TO BE NEEDED ANYMORE
    //const [apiData, setApiData] = React.useState({});
    // contains selected data from DataSelection
    const [selectedData, setSelectedData] = React.useState(new Array<SelectedDataItem>());
    // contains all data created custom in step 4
    const [customData, setCustomData] = React.useState(new Array<FormelObj>());
    // contains all data that was selected for historization
    const [historizedData, setHistorizedData] = React.useState(new Array<string>());
    // Contains the JSON for historization schedule selection
    const [schedule, setSchedule] = useState<Schedule>({type: "", interval: "", time: "", weekdays: []});
    //holds all list item representations generated in step 2, stored he to be passed to diagrams
    const [listItems, setListItems] = React.useState<Array<ListItemRepresentation>>([]);
    //holds all diagrams created by the user
    const [diagrams, setDiagrams] = React.useState<Array<Diagram>>([]);
    //represents the current historySelectionStep: 1 is data selection, 2 is time selection
    const [historySelectionStep, setHistorySelectionStep] = React.useState(1);
    //represents the current step in data customization: 0 is array processing, 1 is formula and 2 is string processing
    const [dataCustomizationStep, setDataCustomizationStep] = React.useState(0);
    // Holds an array of all data sources for the Infoprovider
    const [dataSources, setDataSources] = React.useState<Array<DataSource>>([]);
    //Holds the values of apiKeyInput1 and apiKeyInput2 of each dataSource - map where dataSource name is the key
    const [dataSourcesKeys, setDataSourcesKeys] = React.useState<Map<string, DataSourceKey>>(new Map());
    //flag for opening the dialog that restores authentication data on reload
    const [authDataDialogOpen, setAuthDataDialogOpen] = React.useState(false);
    //list of all array processings defined
    const [arrayProcessingsList, setArrayProcessingsList] = React.useState<Array<ArrayProcessingData>>([]);
    //list of all string replacement processings defined
    const [stringReplacementList, setStringReplacementList] = React.useState<Array<StringReplacementData>>([]);
    //true when the button for submitting in settingsOverview is blocked because a posting is running - stored here because methods here need to change it
    const [submitInfoProviderDisabled, setSubmitInfoProviderDisabled] = React.useState(false);


    /**
     * Method to check if there is api auth data to be lost when the user refreshes the page.
     * Needs to be separated from authDialogNeeded since this uses state while authDialogNeeded uses sessionStorage
     */
    const checkKeyExistence = React.useCallback(() => {
        //check the current data source
        if ((!noKey) && (apiKeyInput1 !== "" || apiKeyInput2 !== "")) return true;
        //check all other data sources
        for (let index = 0; index < dataSources.length; index++) {
            const dataSource = dataSources[index];
            if (dataSourcesKeys.get(dataSource.apiName) !== undefined) {
                if ((!dataSource.noKey) && (dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 !== "" || dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput2 !== "")) return true;
            }
        }
        return false;
    }, [dataSources, dataSourcesKeys, noKey, apiKeyInput1, apiKeyInput2])

    /**
     * Checks if displaying a dialog for reentering authentication data on loading the component is necessary.
     * This will be the case if the current dataSource has not selected noKey or if any of the previously existing dataSources has noKey.
     * Needs to run based on sessionStorage since it is called in the first render.
     */
    const authDialogNeeded = () => {
        const data: Array<DataSource> = sessionStorage.getItem("dataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("dataSources-" + uniqueId)!)
        const noKeyCurrent: boolean = sessionStorage.getItem("noKey-" + uniqueId) === "true";
        //will only trigger if the user has selected a method and noKey - this makes sure he already got to step 2 in the current datasource
        const methodCurrent: string = sessionStorage.getItem("method-" + uniqueId) || "";
        if ((!noKeyCurrent) && methodCurrent !== "") return true;
        else {
            for (let index = 0; index < data.length; index++) {
                if (!data[index].noKey) return true;
            }
        }
        return false;
    }

    /**
     * Method to construct an array of all dataSources names where the user needs to re-enter his authentication data.
     */
    const buildDataSourceSelection = () => {
        const dataSourceSelection: Array<AuthDataDialogElement> = [];
        //check the current data source and add it as an option - not used when in SettingsOverview!
        if (createStep < 5 && !noKey && method !== "") {
            dataSourceSelection.push({
                name: "current--" + uniqueId,
                method: method
            })
        }
        //check all other data sources
        if (dataSources !== undefined) {
            dataSources.forEach((dataSource) => {
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


    /**
     * Restores all data of the current session when the page is loaded. Used to not loose data on reloading the page.
     * The sets need to be converted back from Arrays that were parsed with JSON.stringify.
     */
    React.useEffect(() => {
        //createStep - disabled since it makes debugging more annoying
        setCreateStep(Number(sessionStorage.getItem("createStep-" + uniqueId) || 0));
        //name
        setName(sessionStorage.getItem("name-" + uniqueId) || "");
        //apiName
        setApiName(sessionStorage.getItem("apiName-" + uniqueId) || "");
        //query
        setQuery(sessionStorage.getItem("query-" + uniqueId) || "");
        //noKey
        setNoKey(sessionStorage.getItem("noKey-" + uniqueId) === "true");
        //method
        setMethod(sessionStorage.getItem("method-" + uniqueId) || "");
        //apiData
        //(JSON.parse(sessionStorage.getItem("apiData-" + uniqueId)||"{}"));
        //selectedData
        setSelectedData(sessionStorage.getItem("selectedData-" + uniqueId) === null ? new Array<SelectedDataItem>() : JSON.parse(sessionStorage.getItem("selectedData-" + uniqueId)!));
        //customData
        setCustomData(sessionStorage.getItem("customData-" + uniqueId) === null ? new Array<FormelObj>() : JSON.parse(sessionStorage.getItem("customData-" + uniqueId)!));
        //historizedData
        setHistorizedData(sessionStorage.getItem("historizedData-" + uniqueId) === null ? new Array<string>() : JSON.parse(sessionStorage.getItem("historizedData-" + uniqueId)!));
        //listItems (less calculations will be necessary this way)
        setListItems(sessionStorage.getItem("listItems-" + uniqueId) === null ? new Array<ListItemRepresentation>() : JSON.parse(sessionStorage.getItem("listItems-" + uniqueId)!));
        //diagrams (less calculations will be necessary this way)
        setDiagrams(sessionStorage.getItem("diagrams-" + uniqueId) === null ? new Array<Diagram>() : JSON.parse(sessionStorage.getItem("diagrams-" + uniqueId)!));
        //schedule
        setSchedule(sessionStorage.getItem("schedule-" + uniqueId) === null ? {
            type: "",
            interval: "",
            time: "",
            weekdays: []
        } : JSON.parse(sessionStorage.getItem("schedule-" + uniqueId)!))
        //historySelectionStep
        setHistorySelectionStep(Number(sessionStorage.getItem("historySelectionStep-" + uniqueId) || 1));
        //dataCustomizationStep
        setDataCustomizationStep(Number(sessionStorage.getItem("dataCustomizationStep-" + uniqueId) || 0));
        // Already created data sources
        setDataSources(sessionStorage.getItem("dataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("dataSources-" + uniqueId)!));
        //listItems
        setListItems(sessionStorage.getItem("listItems-" + uniqueId) === null ? new Array<ListItemRepresentation>() : JSON.parse(sessionStorage.getItem("listItems-" + uniqueId)!));
        //arrayProcessingsList
        setArrayProcessingsList(sessionStorage.getItem("arrayProcessingsList-" + uniqueId) === null ? new Array<ArrayProcessingData>() : JSON.parse(sessionStorage.getItem("arrayProcessingsList-" + uniqueId)!));
        //stringReplacementList
        setStringReplacementList(sessionStorage.getItem("stringReplacementList-" + uniqueId) === null ? new Array<StringReplacementData>() : JSON.parse(sessionStorage.getItem("stringReplacementList-" + uniqueId)!));


        //create default values in the key map for all dataSources
        //necessary to not run into undefined values
        const map = new Map();
        const data: Array<DataSource> = sessionStorage.getItem("dataSources-" + uniqueId) === null ? new Array<DataSource>() : JSON.parse(sessionStorage.getItem("dataSources-" + uniqueId)!)
        data.forEach((dataSource) => {
            map.set(dataSource.apiName, {
                apiKeyInput1: "",
                apiKeyInput2: ""
            })
        });
        setDataSourcesKeys(map);
        //open the dialog for reentering authentication data
        if (authDialogNeeded()) {
            setAuthDataDialogOpen(true);
        }
    }, [])

    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("createStep-" + uniqueId, createStep.toString());
    }, [createStep])
    //store name in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("name-" + uniqueId, name);
    }, [name])
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
        sessionStorage.setItem("noKey-" + uniqueId, noKey ? "true" : "false");
    }, [noKey])
    //store method in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("method-" + uniqueId, method);
    }, [method])
    //store apiData in sessionStorage
    /* React.useEffect(() => {
         sessionStorage.setItem("apiData-" + uniqueId, JSON.stringify(apiData));
     }, [apiData])*/
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
    //store listItems in sessionStorage by converting into an array and use JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("listItems-" + uniqueId, JSON.stringify(listItems));
    }, [listItems])
    React.useEffect(() => {
        sessionStorage.setItem("diagrams-" + uniqueId, JSON.stringify(diagrams));
    }, [diagrams])
    //store schedule in sessionStorage by using JSON.stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("schedule-" + uniqueId, JSON.stringify(schedule));
    }, [schedule])
    //store historySelectionStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("historySelectionStep-" + uniqueId, historySelectionStep.toString());
    }, [historySelectionStep])
    //store dataCustomizationStep in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("dataCustomizationStep-" + uniqueId, dataCustomizationStep.toString());
    }, [dataCustomizationStep])
    // Store data sources in session storage by using JSON-stringify on it
    React.useEffect(() => {
        sessionStorage.setItem("dataSources-" + uniqueId, JSON.stringify(dataSources));
    }, [dataSources])
    // Store listItems in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("listItems-" + uniqueId, JSON.stringify(listItems));
    }, [listItems])
    // Store arrayProcessingsList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("arrayProcessingsList-" + uniqueId, JSON.stringify(arrayProcessingsList));
    }, [arrayProcessingsList])
    // Store stringReplacementList in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("stringReplacementList-" + uniqueId, JSON.stringify(stringReplacementList));
    }, [stringReplacementList])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("createStep-" + uniqueId);
        sessionStorage.removeItem("name-" + uniqueId);
        sessionStorage.removeItem("apiName-" + uniqueId);
        sessionStorage.removeItem("query-" + uniqueId);
        sessionStorage.removeItem("noKey-" + uniqueId);
        sessionStorage.removeItem("method-" + uniqueId);
        //sessionStorage.removeItem("apiData-" + uniqueId);
        sessionStorage.removeItem("selectedData-" + uniqueId);
        sessionStorage.removeItem("customData-" + uniqueId);
        sessionStorage.removeItem("historizedData-" + uniqueId);
        sessionStorage.removeItem("listItems-" + uniqueId);
        sessionStorage.removeItem("diagrams-" + uniqueId);
        sessionStorage.removeItem("dataSources-" + uniqueId);
        sessionStorage.removeItem("listItems-" + uniqueId);
        sessionStorage.removeItem("historySelectionStep-" + uniqueId);
        sessionStorage.removeItem("dataCustomizationStep-" + uniqueId);
        sessionStorage.removeItem("schedule-" + uniqueId);
        sessionStorage.removeItem("arrayProcessingsList-" + uniqueId);
        sessionStorage.removeItem("stringReplacementList-" + uniqueId);
    }


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
     * Handler for the return of a successful call to the backend (posting info-provider)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccessPostInfoProvider = React.useCallback((jsonData: any) => {
        clearSessionStorage();
        setSubmitInfoProviderDisabled(false);
        components?.setCurrent("dashboard")
    }, [components]);

    /**
     * Handler for unsuccessful call to the backend (posting info-provider)
     * @param err The error returned by the backend
     */
    const handleErrorPostInfoProvider = React.useCallback((err: Error) => {
        setSubmitInfoProviderDisabled(false);
        reportError("Fehler: Senden des Info-Providers an das Backend fehlgeschlagen! (" + err.message + ")");
    }, []);


    /**
     * Method that creates the array of dataSources in the backend format for
     * the existing data sources.
     */
    const createDataSources = React.useCallback(() => {
        const backendDataSources: Array<BackendDataSource> = [];
        dataSources.forEach((dataSource) => {
            //this check should be prevented, but there is some bug behaviour where this method is called too often and errors happen
            if (dataSourcesKeys.get(dataSource.apiName) !== undefined) {
                backendDataSources.push({
                    datasource_name: dataSource.apiName,
                    api: {
                        api_info: {
                            type: "request",
                            api_key_name: dataSource.method === "BearerToken" ? dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 : dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput1 + "||" + dataSourcesKeys.get(dataSource.apiName)!.apiKeyInput2,
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
                    listItems: dataSource.listItems
                })
            }
        });
        return backendDataSources;
    }, [dataSources, dataSourcesKeys]);

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
                //when the diagram uses customLabels, we need to use the method that adds the ticks on the last cycle
                if(diagram.customLabels) {
                    //loop through all arrays used in the diagram
                    for (let index = 0; index < diagram.arrayObjects.length; index++) {
                        const item = diagram.arrayObjects[index];
                        const plots = {
                            customLabels: true,
                            primitive: !Array.isArray(item.listItem.value),
                            plot: {
                                type: type,
                                x: Array.from(Array(diagram.amount).keys()),
                                y: "{_req|" + (item.listItem.parentKeyName === "" ? item.listItem.keyName : item.listItem.parentKeyName + "|" + item.listItem.keyName) + "}",
                                color: item.color,
                                numericAttribute: item.numericAttribute,
                                stringAttribute: "",
                                x_ticks: {
                                    //only set the ticks on the last Plot - this is necessary to render it last when layering the Plots in the diagrams
                                    ticks: index === diagram.arrayObjects.length-1 ? diagram.labelArray : []
                                }
                            }
                        }
                        plotArray.push(plots);
                    }
                } else {
                    //this diagram uses a stringAttribute to generate its labels - find the Plot that belongs to its array and add it last
                    //this behaviour is necessary in order to render the diagrams in the correct order in backend Plot layering
                    let plotWithStringAttribute = {} as Plots;
                    //loop through all arrays used in the diagram
                    for (let index = 0; index < diagram.arrayObjects.length; index++) {
                        const item = diagram.arrayObjects[index];
                        const isArrayWithAttribute = (item.listItem.parentKeyName === "" ? item.listItem.keyName : item.listItem.parentKeyName + "|" + item.listItem.keyName) === diagram.stringAttribute.array;
                        const plots = {
                            customLabels: false,
                            primitive: !Array.isArray(item.listItem.value),
                            plot: {
                                type: type,
                                x: Array.from(Array(diagram.amount).keys()),
                                y: "{_req|" + (item.listItem.parentKeyName === "" ? item.listItem.keyName : item.listItem.parentKeyName + "|" + item.listItem.keyName) + "}",
                                color: item.color,
                                numericAttribute: item.numericAttribute,
                                stringAttribute: isArrayWithAttribute ? diagram.stringAttribute.key : "",
                                x_ticks: {
                                    //only set the ticks on the last Plot - this is necessary to render it last when layering the Plots in the diagrams
                                    ticks: []
                                }
                            }
                        }
                        //if the current array is the one that contains the string attribute, dont push it instantly to the plots array
                        if (isArrayWithAttribute) plotWithStringAttribute = plots;
                        else plotArray.push(plots);
                    }
                    //push the array with the stringAttribute as the last item so it will be last in backend layering
                    plotArray.push(plotWithStringAttribute);
                }
            }
        } else {
            //"Historized"
            if (diagram.historizedObjects !== undefined) {
                for (let index = 0; index < diagram.historizedObjects.length; index++) {
                    const item = diagram.historizedObjects[index];
                    const plots = {
                        plot: {
                            type: type,
                            x: item.intervalSizes,
                            y: "{_req|" + item.name.replaceAll("|", "_") + "_HISTORY}",
                            color: item.color,
                            x_ticks: {
                                //only set the ticks on the last Plot - this is necessary to render it last when layering the Plots in the diagrams
                                ticks: index === diagram.historizedObjects.length-1 ? diagram.labelArray : []
                            }
                        }
                    }
                    plotArray.push(plots);
                }
            }
        }
        return plotArray;
    }, [])

    /**
     * Method that generates the object 'diagram' the backend needs
     * for the configuration of the infoprovider by using the values from
     * the created diagram and transforming them to the backend format.
     */
    const createBackendDiagrams = React.useCallback(() => {
        const diagramsObject: any = {};
        diagrams.forEach((diagram) => {
            diagramsObject[diagram.name] = {
                type: "diagram_custom",
                diagram_config: {
                    type: "custom",
                    name: diagram.name,
                    infoprovider: name,
                    sourceType: diagram.sourceType,
                    plots: createPlots(diagram)
                }
            }
        })
        return diagramsObject;
    }, [createPlots, diagrams, name]);


    /**
     * Method that creates a list of all arrays that are used in diagrams.
     * Necessary for forming the object of the infoprovider sent to the backend.
     */
    const getArraysUsedByDiagrams = React.useCallback(() => {
        const arraysInDiagrams: Array<string> = [];
        diagrams.forEach((diagram) => {
            if (diagram.sourceType !== "Array") return;
            else if (diagram.arrayObjects !== undefined) {
                diagram.arrayObjects.forEach((array) => {
                    //checking for empty parentKeyName is not necessary since the dataSource name is always included
                    arraysInDiagrams.push(array.listItem.parentKeyName + "|" + array.listItem.keyName)
                })
            }
        })
        return arraysInDiagrams;
    }, [diagrams]);


    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since it seemingly caused method calls on each render.
     */
    const postInfoProvider = React.useCallback(() => {
        //("fetcher called");
        let url = "visuanalytics/infoprovider"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                infoprovider_name: name,
                datasources: createDataSources(),
                diagrams: createBackendDiagrams(),
                diagrams_original: diagrams,
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
    }, [createBackendDiagrams, createDataSources, diagrams, getArraysUsedByDiagrams, handleErrorPostInfoProvider, handleSuccessPostInfoProvider, name])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    /**
     * Method that checks if the given name is already in use for a data source in this info-provider
     * @param name Name that should be checked.
     * Return true if the name is already in use for this Info-Provider
     */
    const checkNameDuplicate = (name: string) => {
        for (let i = 0; i < dataSources.length; i++) {
            if (dataSources[i].apiName === name) return true;
        }
        return false;
    }

    /**
     * Handler for continue button that is passed to all sub-component as props.
     * Increments the step.
     */
    const handleContinue = () => {
        if (createStep === 5) {
            if (name.length <= 0) {
                reportError("Bitte geben Sie dem Infoprovider einen Namen!");
            } else {
                setSubmitInfoProviderDisabled(true);
                postInfoProvider();
            }
        } else if (createStep === 4 && props.finishDataSourceInEdit !== undefined) {

            props.finishDataSourceInEdit({
                apiName: apiName,
                query: query,
                noKey: noKey,
                method: method,
                selectedData: selectedData,
                customData: customData,
                historizedData: historizedData,
                schedule: schedule,
                listItems: listItems,
                arrayProcessingsList: arrayProcessingsList,
                stringReplacementList: stringReplacementList
            }, apiKeyInput1, apiKeyInput2);
            clearSessionStorage();
        } else {
            setCreateStep(createStep + 1);
            /*console.log(JSON.stringify({
                infoprovider_name: name,
                api: {
                    type: "request",
                    api_key_name: method === "BearerToken" ? apiKeyInput1 : apiKeyInput1 + "||" + apiKeyInput2,
                    url_pattern: query,
                },
                method: noKey ? "noAuth" : method,
                transform: extractKeysFromSelection(selectedData),
                storing: historizedData,
                customData: customData
            }));*/
        }
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        if (createStep === 0 && props.cancelNewDataSourceInEdit !== undefined) {
            clearSessionStorage();
            props.cancelNewDataSourceInEdit();
        } else if (createStep === 0) {
            clearSessionStorage();
            components?.setCurrent("dashboard")
        }
        setCreateStep(createStep - 1)
    }


    /**
     * Adds a new data source to the state of the Infoprovider.
     * If a data source already exists, it will be swapped out when this method is called.
     */
    const addToDataSources = () => {
        //store keys in dataSourcesKeys
        const mapCopy = new Map(dataSourcesKeys);
        setDataSourcesKeys(mapCopy.set(apiName, {
            apiKeyInput1: apiKeyInput1,
            apiKeyInput2: apiKeyInput2
        }))

        const dataSource: DataSource = {
            apiName: apiName,
            query: query,
            noKey: noKey,
            method: method,
            selectedData: selectedData,
            customData: customData,
            historizedData: historizedData,
            schedule: schedule,
            listItems: listItems,
            arrayProcessingsList: arrayProcessingsList,
            stringReplacementList: stringReplacementList
        };
        for (let i = 0; i < dataSources.length; i++) {
            if (dataSources[i].apiName === apiName) {
                let newDataSources = dataSources.slice();
                newDataSources[i] = dataSource;
                setDataSources(newDataSources);
                return;
            }
        }
        setDataSources(dataSources.concat(dataSource));
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
                        alreadyHasDataSources={dataSources.length > 0}
                    />
                );
            case 1:
                return (
                    <BasicSettings
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        //setApiData={setApiData}
                        checkNameDuplicate={props.checkDuplicateNameInEdit === undefined ? checkNameDuplicate : props.checkDuplicateNameInEdit}
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
                        apiName={apiName}
                        setApiName={(name: string) => setApiName(name)}
                        reportError={reportError}
                        setSelectedData={setSelectedData}
                        setCustomData={setCustomData}
                        setHistorizedData={setHistorizedData}
                        setSchedule={setSchedule}
                        setHistorySelectionStep={setHistorySelectionStep}
                        diagrams={diagrams}
                        setDiagrams={(diagrams: Array<Diagram>) => setDiagrams(diagrams)}
                        setListItems={(array: Array<ListItemRepresentation>) => setListItems(array)}
                        setArrayProcessingsList={(processings: Array<ArrayProcessingData>) => setArrayProcessingsList(processings)}
                        setStringReplacementList={(replacements: Array<StringReplacementData>) => setStringReplacementList(replacements)}
                        isInEditMode={false}
                    />
                );
            case 2:
                return (
                    <DataSelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={selectedData}
                        setSelectedData={(set: Array<SelectedDataItem>) => setSelectedData(set)}
                        listItems={listItems}
                        //setListItems={(array: Array<ListItemRepresentation>) => setListItems(array)}
                        historizedData={historizedData}
                        setHistorizedData={(array: Array<string>) => setHistorizedData(array)}
                        customData={customData}
                        setCustomData={(array: Array<FormelObj>) => setCustomData(array)}
                        diagrams={diagrams}
                        setDiagrams={(array: Array<Diagram>) => setDiagrams(array)}
                        apiName={apiName}
                    />
                );
            case 3:
                return (
                    <DataCustomization
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        dataCustomizationStep={dataCustomizationStep}
                        setDataCustomizationStep={(step: number) => setDataCustomizationStep(step)}
                        selectedData={selectedData}
                        setSelectedData={(array: Array<SelectedDataItem>) => setSelectedData(array)}
                        customData={customData}
                        setCustomData={(array: Array<FormelObj>) => setCustomData(array)}
                        reportError={reportError}
                        listItems={listItems}
                        historizedData={historizedData}
                        setHistorizedData={(array: Array<string>) => setHistorizedData(array)}
                        diagrams={diagrams}
                        setDiagrams={(array: Array<Diagram>) => setDiagrams(array)}
                        apiName={apiName}
                        arrayProcessingsList={arrayProcessingsList}
                        setArrayProcessingsList={(processings: Array<ArrayProcessingData>) => setArrayProcessingsList(processings)}
                        stringReplacementList={stringReplacementList}
                        setStringReplacementList={(replacements: Array<StringReplacementData>) => setStringReplacementList(replacements)}
                    />
                )
            case 4:
                return (
                    <HistorySelection
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        selectedData={extractKeysFromSelection(selectedData)}
                        customData={customData}
                        arrayProcessingsList={arrayProcessingsList}
                        stringReplacementList={stringReplacementList}
                        historizedData={historizedData}
                        setHistorizedData={(set: Array<string>) => setHistorizedData(set)}
                        schedule={schedule}
                        selectSchedule={setSchedule}
                        historySelectionStep={historySelectionStep}
                        setHistorySelectionStep={(step: number) => setHistorySelectionStep(step)}
                        addToDataSources={addToDataSources}
                        diagrams={diagrams}
                        setDiagrams={(array: Array<Diagram>) => setDiagrams(array)}
                        apiName={apiName}
                        newDataSourceInEditMode={props.finishDataSourceInEdit !== undefined}
                    />
                )
            case 5:
                return (
                    <SettingsOverview
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        setStep={setCreateStep}
                        name={name}
                        setName={(name: string) => setName(name)}
                        dataSources={dataSources}
                        setDataSources={setDataSources}
                        apiName={apiName}
                        setApiName={setApiName}
                        setQuery={setQuery}
                        setApiKeyInput1={setApiKeyInput1}
                        setApiKeyInput2={setApiKeyInput2}
                        setNoKey={setNoKey}
                        setMethod={setMethod}
                        //setApiData={setApiData}
                        setSelectedData={setSelectedData}
                        setCustomData={setCustomData}
                        setHistorizedData={setHistorizedData}
                        setSchedule={setSchedule}
                        setHistorySelectionStep={setHistorySelectionStep}
                        setListItems={(array: Array<ListItemRepresentation>) => setListItems(array)}
                        diagrams={diagrams}
                        setDiagrams={(array: Array<Diagram>) => setDiagrams(array)}
                        dataSourcesKeys={dataSourcesKeys}
                        setDataSourcesKeys={(map: Map<string, DataSourceKey>) => setDataSourcesKeys(map)}
                        setArrayProcessingsList={(processings: Array<ArrayProcessingData>) => setArrayProcessingsList(processings)}
                        setStringReplacementList={(replacements: Array<StringReplacementData>) => setStringReplacementList(replacements)}
                        submitInfoProviderDisabled={submitInfoProviderDisabled}
                        setDataCustomizationStep={(step: number) => setDataCustomizationStep(step)}
                    />
                )
            case 6:
                return (
                    <DiagramCreation
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        dataSources={dataSources}
                        diagrams={diagrams}
                        setDiagrams={(array: Array<Diagram>) => setDiagrams(array)}
                        reportError={reportError}
                        infoProviderName={name}
                        createPlots={(diagram: Diagram) => createPlots(diagram)}
                    />
                )

        }
    }

    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                <Stepper activeStep={createStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>
            {selectContent(createStep)}
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
                method={method}
                apiKeyInput1={apiKeyInput1}
                setApiKeyInput1={(input: string) => setApiKeyInput1(input)}
                apiKeyInput2={apiKeyInput2}
                setApiKeyInput2={(input: string) => setApiKeyInput2(input)}
                dataSourcesKeys={dataSourcesKeys}
                setDataSourcesKeys={(map: Map<string, DataSourceKey>) => setDataSourcesKeys(map)}
                selectionDataSources={buildDataSourceSelection()}
                apiName={apiName}
            />
            }
        </React.Fragment>
    );
}