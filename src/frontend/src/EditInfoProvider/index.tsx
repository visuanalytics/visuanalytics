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
import {formelContext, InfoProviderObj} from "./types";
import {
    DataSource,
    Diagram,
    ListItemRepresentation,
    Plots,
    SelectedDataItem,
    uniqueId
} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {DiagramCreation} from "../CreateInfoProvider/DiagramCreation";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: InfoProviderObj;
}

//TODO: task list for the team
/*
DONE:
task 0: overview component (Tristan)
task 1: restore formulas (Tristan)
task 2: editing for formulas (Tristan)
task 3: new formulas (Tristan)
task 4: integrate diagram components (Janek)
NOT DONE:
task 5: sessionStorage compatibility with AuthDataDialog (Janek)
task 6: keep the component context on reload (Janek)
task 7: reload data from api in DataSelection and compare if all selectedData-items are contained in the new listItems (Janek)
task 8: component for DataSelection (Janek)
task 9: historized data (Tristan)
task 10: add additional data sources (Daniel)
task 11: delete dependencies (???)
task 12: load data from backend (Janek)
task 13: send data to backend (Janek)
 */

export const EditInfoProvider: React.FC<EditInfoProviderProps> = (/*{ infoProvId, infoProvider}*/) => {

    const components = React.useContext(ComponentContext);

    /**
     * the current step of the creation process, numbered by 0 to 5
     */
    const [step, setStep] = React.useState(0);

    /**
     * The name of the infoprovider that is being edited
     */
    //infoProvider? infoProvider.name : "TristanTest"
    const [infoProvName, setInfoProvName] = React.useState("TristanTest");

    //TODO: mind that keyInput is now in map
    /**
     * The array with DataSources from the infoprovider that is being edited.
     * One DataSource-object holds all information from one api.
     */
    //infoProvider? infoProvider.dataSources : new Array<DataSource>(...)
    //fill with test data
    const [infoProvDataSources, setInfoProvDataSources] = React.useState<Array<DataSource>>(new Array<DataSource>(
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

    /**
     * The array with diagrams from the Infoprovider that is being edited.
     */
    const [infoProvDiagrams, setInfoProvDiagrams] = React.useState<Array<Diagram>>([]);

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
     * Restores all data of the current session when the page is loaded. Used to not loose data on reloading the page.
     * The sets need to be converted back from Arrays that were parsed with JSON.stringify.
     */
    React.useEffect(() => {
        //step - disabled since it makes debugging more annoying
        setStep(Number(sessionStorage.getItem("step-" + uniqueId)||0));
        //infoProvName
        setInfoProvName(sessionStorage.getItem("infoProvName-" + uniqueId)||"");
        //infoProvDataSource
        //TODO: switch to empty array instead of this debugging sample data when the fetching mechanism is implemented
        setInfoProvDataSources(sessionStorage.getItem("infoProvDataSource-" + uniqueId)===null?new Array<DataSource>(
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
        ):JSON.parse(sessionStorage.getItem("infoProvDataSource-" + uniqueId)!));
        //infoProvDiagrams
        setInfoProvDiagrams(sessionStorage.getItem("infoProvDiagrams-" + uniqueId)===null?new Array<Diagram>():JSON.parse(sessionStorage.getItem("infoProvDiagrams-" + uniqueId)!));
        //selectedDataSource
        setSelectedDataSource(Number(sessionStorage.getItem("selectedDataSource-" + uniqueId)||0));
        //formelInformation
        setFormelInformation(sessionStorage.getItem("formelInformation-" + uniqueId)===null?{
            formelName: "",
            parenCount: 0,
            formelAsObjects: new Array<StrArg>(),
            dataFlag: false,
            numberFlag: false,
            opFlag: true,
            leftParenFlag: false,
            rightParenFlag: false
        }:JSON.parse(sessionStorage.getItem("formelInformation-" + uniqueId)!));
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
        sessionStorage.setItem("infoProvDataSource-" + uniqueId, JSON.stringify(infoProvDataSources));
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
        sessionStorage.removeItem("infoProvDataSource-" + uniqueId);
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

    /**
     * Method to send the edited infoprovider to the backend.
     * The backend will now update the infoprovider with the new data.
     */
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
                        continueHandler={(index: number) => handleContinue(index)}
                        handleBack={(index: number) => handleBack(index)}
                        editInfoProvider={editInfoProvider}
                        infoProvName={infoProvName}
                        setInfoProvName={(name: string) => setInfoProvName(name)}
                        infoProvDataSources={infoProvDataSources}
                        selectedDataSource={selectedDataSource}
                        setSelectedDataSource={(index: number) => setSelectedDataSource(index)}
                    />
                );
            case 1:
                return (
                    <EditDataSelection
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={editInfoProvider}
                    />
                );
            case 2:
                return (
                    <EditCustomData
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={editInfoProvider}
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
                        editInfoProvider={editInfoProvider}
                        infoProvDataSources={infoProvDataSources}
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
                        <DiagramCreation
                            continueHandler={() => setStep(0)}
                            backHandler={() => setStep(0)}
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
