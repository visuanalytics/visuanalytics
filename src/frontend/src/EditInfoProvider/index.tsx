import React from "react";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {ComponentContext} from "../ComponentProvider";
import {EditCustomData} from "./EditCustomData/EditCustomData";
import {StrArg} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {EditSingleFormel} from "./EditCustomData/EditSingleFormel/EditSingleFormel";
import {formelContext} from "./types";
import {
    BackendDataSource,
    DataSource,
    DataSourceKey,
    Diagram,
    FrontendInfoProvider,
    Plots,
    SelectedDataItem,
} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {useCallFetch} from "../Hooks/useCallFetch";
import {CreateInfoProvider} from "../CreateInfoProvider";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: FrontendInfoProvider;
}

export const EditInfoProvider: React.FC<EditInfoProviderProps> = ({ infoProvId, infoProvider}) => {

    const components = React.useContext(ComponentContext);

    //TODO: remove after testing
    /*React.useEffect(() => {
        console.log(infoProvId);
        console.log(infoProvider);
    }, [])*/
    /**
     * The name of the infoprovider that is being edited
     */
    //infoProvider? infoProvider.name : "TristanTest"
    const [infoProvName, setInfoProvName] = React.useState(infoProvider!==undefined ? infoProvider.infoproviderName : "");


    const [newDataSourceMode, setNewDataSourceMode] = React.useState(false);
    //TODO: mind that keyInput is now in map
    //TODO: remove testinput for production
    /**
     * The array with DataSources from the infoprovider that is being edited.
     * One DataSource-object holds all information from one api.
     */
    //infoProvider? infoProvider.dataSources : new Array<DataSource>(...)
    //fill with test data
    const [infoProvDataSource, setInfoProvDataSource] = React.useState<Array<DataSource>>(infoProvider!==undefined ? infoProvider.dataSources : new Array<DataSource>(
        {
            apiName: "apiName",
            query: "query",
            //apiKeyInput1: "apiKeyInput1",
            //apiKeyInput2: "apiKeyInput2",
            noKey: true,
            method: "method",
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
            noKey: true,
            method: "method_2",
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

    const [infoProvDataSourcesKeys, setInfoProvDataSourcesKeys] = React.useState<Map<string, DataSourceKey>>(new Map());

    /**
     * The array with diagrams from the Infoprovider that is being edited.
     */
    //TODO: change to Diagram
    const [infoProvDiagrams/*, setInfoProvDiagrams*/] = React.useState(infoProvider!==undefined ? infoProvider.diagrams : new Array<Diagram>());

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

    /**
     * the current step of the creation process, numbered by 0 to 5
     */
    const [step, setStep] = React.useState(0);

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
        if (infoProvDataSource[selectedDataSource].historizedData.length <= 0) {
            infoProvDataSource[selectedDataSource].schedule = {type: "", interval: "", time: "", weekdays: []}
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

    const reportError = (message: string) => {
        dispatchMessage({type: "reportError", message: message});
    };


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
            components?.setCurrent("dashboard")
            return;
        }
        setStep(step - index)
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
        infoProvDataSource.forEach((dataSource) => {
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

    //TODO: test this method when it is used
    /**
     * Method that creates a list of all arrays that are used in diagrams.
     * Necessary for forming the object of the infoprovider sent to the backend.
     */
    const getArraysUsedByDiagrams = () => {
        const arraysInDiagrams: Array<string> = [];
        infoProvDiagrams.forEach((diagram) => {
            if(diagram.sourceType!=="Array") return;
            else if(diagram.arrayObjects!==undefined) {
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
        setInfoProvDataSource(infoProvDataSource.concat(dataSource));
        const mapCopy = new Map(infoProvDataSourcesKeys)
        setInfoProvDataSourcesKeys(mapCopy.set(dataSource.apiName, {
            apiKeyInput1: apiKeyInput1,
            apiKeyInput2: apiKeyInput2
        }));
        setNewDataSourceMode(false);
    }

    /**
     * Returns the rendered component based on the current step.
     * @param step The number of the current step
     */
    const selectContent = (step: number) => {
        if(newDataSourceMode) {
            return (
                <CreateInfoProvider finishDataSourceInEdit={finishNewDataSource}/>
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
                        infoProvDataSources={infoProvDataSource}
                        selectedDataSource={selectedDataSource}
                        setSelectedDataSource={(index: number) => setSelectedDataSource(index)}
                        finishNewDataSource={finishNewDataSource}
                        setNewDataSourceMode={setNewDataSourceMode}
                    />
                );
            case 1:
                return (
                    <EditDataSelection
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                    />
                );
            case 2:
                return (
                    <EditCustomData
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={finishEditing}
                        infoProvDataSources={infoProvDataSource}
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
                        infoProvDataSources={infoProvDataSource}
                        selectedDataSource={selectedDataSource}
                        reportError={reportError}
                        formel={formelInformation}
                    />
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
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </React.Fragment>
    );
}
