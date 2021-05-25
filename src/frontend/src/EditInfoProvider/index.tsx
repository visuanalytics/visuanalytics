import React, {useState} from "react";
import {formelObj} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource, Schedule, SelectedDataItem} from "../CreateInfoProvider";
import {centerNotifcationReducer, CenterNotification} from "../util/CenterNotification";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Grid} from "@material-ui/core";
import {EditSettingsOverview} from "./EditSettingsOverview/EditSettingsOverview";
import {EditDataSelection} from "./EditDataSelection/EditDataSelection";
import {useStyles} from "./style";
import {ComponentContext} from "../ComponentProvider";
import {InfoProviderObj} from "../Dashboard/TabsContent/InfoProviderOverview/infoProviderOverview";
import {EditCustomData} from "./EditCustomData/EditCustomData";

interface EditInfoProviderProps {
    infoProvId?: number;
    infoProvider?: InfoProviderObj;
}

export const EditInfoProvider: React.FC<EditInfoProviderProps> = ({infoProvId, infoProvider}) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    //infoProvider? infoProvider.name : "TristanTest"
    const [infoProvName, setInfoProvName] = React.useState("TristanTest");

    //infoProvider? infoProvider.dataSources : new Array<DataSource>()
    //fill with test data
    const [infoProvDataSource, setInfoProvDataSource] = React.useState<Array<DataSource>>(new Array<DataSource>(
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
            customData: new Array<formelObj>(new formelObj("formel1_2", "7 - 1"), new formelObj("formel2_2", "25 * formel1_2")),
            historizedData: new Array<string>("formel1_2", "Array2|Data0"),
            schedule: {type: "weekly", interval: "", time: "16:00", weekdays: [0, 1]}
        },
    ));

    //TODO: change to Diagram
    const [infoProvDiagrams, setInfoProvDiagrams] = React.useState(infoProvider? infoProvider.diagrams: new Array<string>());

    const [selectedDataSource, setSelectedDataSource] = React.useState(0);

    const [customDataEdit, setCustomDataEdit] = React.useState(infoProvDataSource[selectedDataSource].customData);


//the current step of the creation process, numbered by 0 to 5
    const [step, setStep] = React.useState(0);

    const steps = [
        "Überblick",
        "API-Daten",
        "Formeln",
        "Diagramme",
        "Historisierung"
    ];

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
     * Increments the step.
     */
    const handleContinue = () => {
        setStep(step + 1);
    }

    /**
     * Handler for back button that is passed to all sub-components as props.
     * Decrements the step or returns to the dashboard if the step was 0.
     */
    const handleBack = () => {
        setStep(step - 1)
    }


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
                        continueHandler={handleContinue}
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
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        editInfoProvider={editInfoProvider}
                    />
                );
            case 2:
                return (
                    <EditCustomData
                        continueHandler={handleContinue}
                        backHandler={handleBack}
                        editInfoProvider={editInfoProvider}
                        customDataEdit={customDataEdit}
                    />
                );
            case 3:
                return (
                    <Grid>

                    </Grid>
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
            {infoProvId}
            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
        </React.Fragment>
    );
}
