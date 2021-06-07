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
import {DataSource, DataSourceKey, Diagram, SelectedDataItem, uniqueId} from "../CreateInfoProvider/types";
import {FormelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: InfoProviderObj;
}

export const EditInfoProvider: React.FC<EditInfoProviderProps> = (/*{ infoProvId, infoProvider}*/) => {

    const components = React.useContext(ComponentContext);

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

    //Holds the values of apiKeyInput1 and apiKeyInput2 of each dataSource - map where dataSource name is the key
    const [infoProvDataSourcesKeys, setInfoProvDataSourcesKeys] = React.useState<Map<string, DataSourceKey>>(new Map());

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


    React.useEffect(() => {
        //create default values in the key map for all dataSources
        //necessary to not run into undefined values
        const map = new Map();
        const data: Array<DataSource> = sessionStorage.getItem("infoProvDataSources-" + uniqueId)===null?new Array<DataSource>():JSON.parse(sessionStorage.getItem("infoProvDataSources-" + uniqueId)!)
        data.forEach((dataSource) => {
            map.set(dataSource.apiName, {
                apiKeyInput1: "",
                apiKeyInput2: ""
            })
        });
        setInfoProvDataSourcesKeys(map);
    }, [])

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
     * Handler method for changing the selectedData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param dataSource The new selectedData
     */
    const setSelectedData = (selectedData: Array<SelectedDataItem>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].selectedData = selectedData;
        setInfoProvDataSources(arCopy);
    }

    /**
     * Handler method for changing the historizedData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param dataSource The new selectedData
     */
    const setHistorizedData = (historizedData: Array<string>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].historizedData = historizedData;
        setInfoProvDataSources(arCopy);
    }

    /**
     * Handler method for changing the customData of the current data source in infoProvDataSources.
     * Used for the EditDataSelection step.
     * @param dataSource The new selectedData
     */
    const setCustomData = (customData: Array<FormelObj>) => {
        const arCopy = infoProvDataSources.slice();
        arCopy[selectedDataSource].customData = customData;
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
            components?.setCurrent("dashboard")
            return;
        }
        setStep(step - index)
    }

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
                //TODO: replace test values as soon as merged with branch containing sessionStorage
                return (
                    <EditDataSelection
                        continueHandler={(index: number) => handleContinue(index)}
                        backHandler={(index: number) => handleBack(index)}
                        editInfoProvider={editInfoProvider}
                        reportError={reportError}
                        dataSource={infoProvDataSources[selectedDataSource]}
                        apiKeyInput1={/*infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput1*/"Test"}
                        apiKeyInput2={/*infoProvDataSourcesKeys.get(infoProvDataSources[selectedDataSource].apiName)!.apiKeyInput2*/"Test"}
                        diagrams={infoProvDiagrams}
                        setSelectedData={(selectedData: Array<SelectedDataItem>) => setSelectedData(selectedData)}
                        setHistorizedData={(historizedData: Array<string>) => setHistorizedData(historizedData)}
                        setCustomData={(customData: Array<FormelObj>) => setCustomData(customData)}
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
