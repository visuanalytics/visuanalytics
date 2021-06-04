import React from "react";
import {formelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource, SelectedDataItem} from "../CreateInfoProvider";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {ComponentContext} from "../ComponentProvider";
import {InfoProviderObj} from "../Dashboard/TabsContent/InfoProviderOverview/infoProviderOverview";
import {EditCustomData, formelContext} from "./EditCustomData/EditCustomData";
import {StrArg} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {EditSingleFormel} from "./EditCustomData/EditSingleFormel/EditSingleFormel";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: InfoProviderObj;
}

export const EditInfoProvider: React.FC<EditInfoProviderProps> = ({ infoProvId, infoProvider}) => {

    const components = React.useContext(ComponentContext);

    /**
     * The name of the infoprovider that is being edited
     */
    //infoProvider? infoProvider.name : "TristanTest"
    const [infoProvName, setInfoProvName] = React.useState("TristanTest");

    /**
     * The array with DataSources from the infoprovider that is being edited.
     * One DataSource-object holds all information from one api.
     */
    //infoProvider? infoProvider.dataSources : new Array<DataSource>(...)
    //fill with test data
    const [infoProvDataSource] = React.useState<Array<DataSource>>(new Array<DataSource>(
        {
            apiName: "apiName",
            query: "query",
            apiKeyInput1: "apiKeyInput1",
            apiKeyInput2: "apiKeyInput2",
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
            customData: new Array<formelObj>(new formelObj("formel1", "26 * 2"), new formelObj("formel2", "formel1 * formel1")),
            historizedData: new Array<string>("formel1", "formel2"),
            schedule: {type: "weekly", interval: "", time: "18:00", weekdays: [4, 5]}
        },
        {
            apiName: "apiName2",
            query: "query2",
            apiKeyInput1: "apiKeyInput1_2",
            apiKeyInput2: "apiKeyInput2_2",
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
            customData: new Array<formelObj>(new formelObj("formel1_2", "(26 % data / ((7 + 5) * 8) + data2 - 3432412f) * 2"), new formelObj("formel2_2", "25 * formel1_2 / (3 * (Array2|Data0 - 5))")),
            historizedData: new Array<string>("formel1_2", "Array2|Data0"),
            schedule: {type: "weekly", interval: "", time: "16:00", weekdays: [0, 1]}
        },
    ));

    /**
     * The array with diagrams from the Infoprovider that is being edited.
     */
    //TODO: change to Diagram
    const [infoProvDiagrams, setInfoProvDiagrams] = React.useState(infoProvider ? infoProvider.diagrams : new Array<string>());

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



//the current step of the creation process, numbered by 0 to 5
    const [step, setStep] = React.useState(0);

    const steps = [
        "Überblick",
        "API-Daten",
        "Formeln",
        "Einzelne Formel bearbeiten",
        "Diagramme",
        "Historisierung"
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
                        infoProvDataSources={infoProvDataSource}
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
                        editInfoProvider={editInfoProvider}
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
