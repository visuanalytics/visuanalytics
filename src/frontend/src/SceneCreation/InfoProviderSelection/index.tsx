import React from "react";
import {useStyles} from "../style";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Box from "@material-ui/core/Box";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {FrontendInfoProvider, InfoProviderFromBackend} from "../../CreateInfoProvider/types";
import {transformBackendInfoProvider} from "../../CreateInfoProvider/helpermethods";
import {DiagramInfo, HistorizedDataInfo, InfoProviderData} from "../types";
import {Alert} from "@material-ui/lab";
import {getIntervalDisplay} from "../helpermethods";


interface InfoProviderSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProviderList: Array<InfoProviderData>;
    reportError: (message: string) => void;
    setInfoProvider: (infoProvider: FrontendInfoProvider) => void;
    setSelectedDataList: (list: Array<string>) => void;
    setCustomDataList: (list: Array<string>) => void;
    setHistorizedDataList: (list: Array<HistorizedDataInfo>) => void;
    setArrayProcessingList: (list: Array<string>) => void;
    setStringReplacementList: (list: Array<string>) => void;
    setDiagramList: (list: Array<DiagramInfo>) => void;
    fetchImages: () => void;
    step0ContinueDisabled: boolean;
    setStep0ContinueDisabled: (disabled: boolean) => void;
    selectedId: number;
    setSelectedId: (id: number) => void;
    diagramsToFetch: React.MutableRefObject<Array<DiagramInfo>>;
    displayLoadMessage: boolean;
    setDisplayLoadMessage: (display: boolean) => void;
}

export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();


    /**
     * Method that processes the answer of the backend by extracting the lists of selectedData, customData,
     * historizedData, arrayProcessings, stringReplacements and diagrams. Also appends the name of the dataSource to each name if that is necessary.
     * @param infoProvider The object of the Backend, transformed to the frontend representation.
     */
    const processBackendAnswer = (infoProvider: FrontendInfoProvider) => {
        console.log(infoProvider)
        // set the basic variable containing the complete object
        props.setInfoProvider(infoProvider);
        // extract the list of all selectedData, customData, historizedData, arrayProcessings and stringReplacements
        const selectedDataList: Array<string> = [];
        const customDataList: Array<string> = [];
        const historizedDataList: Array<HistorizedDataInfo> = [];
        const arrayProcessingList: Array<string> = [];
        const stringReplacementList: Array<string> = [];
        infoProvider.dataSources.forEach((dataSource) => {
            //go through all selectedData
            //TODO: possibly extract type information
            dataSource.selectedData.forEach((selectedData) => {
                selectedDataList.push(dataSource.apiName + "|" + selectedData.key);
            })
            //go through all formulas
            //TODO: possibly display the complete formula
            dataSource.customData.forEach((customData) => {
                customDataList.push(dataSource.apiName + "|" + customData.formelName);
            })
            // Go through all arrayProcessings
            dataSource.arrayProcessingsList.forEach((arrayProcessing) => {
                arrayProcessingList.push(dataSource.apiName + "|" + arrayProcessing.name);
            })
            // Go through all stringReplacements
            dataSource.stringReplacementList.forEach((stringReplacement) => {
                stringReplacementList.push(dataSource.apiName + "|" + stringReplacement.name);
            })
            //extract the schedule-interval string
            const intervalString = getIntervalDisplay(dataSource.schedule);
            //go through all historized data
            dataSource.historizedData.forEach((historizedData) => {
                historizedDataList.push({
                    name: dataSource.apiName + "|" + historizedData,
                    interval: intervalString
                });
            })
        })
        //go through all diagrams
        const diagramList: Array<DiagramInfo> = [];
        console.log(infoProvider.diagrams===undefined)
        infoProvider.diagrams.forEach((diagram) => {
            //transforms the type into a readable form
            let typeString = "";
            switch(diagram.variant) {
                case "pieChart": {
                    typeString = "Tortendiagramm";
                    break;
                }
                case "lineChart": {
                    typeString = "Liniendiagramm";
                    break;
                }
                case "horizontalBarChart": {
                    typeString = "Balkendiagramm";
                    break;
                }
                case "verticalBarChart": {
                    typeString = "Säulendiagramm";
                    break;
                }

                case "dotDiagram":
                    typeString = "Punktdiagramm";
            }
            diagramList.push({
                name: diagram.name,
                type: typeString,
                url: ""
            })
        })
        //set the states with the new lists
        props.setSelectedDataList(selectedDataList);
        props.setCustomDataList(customDataList);
        props.setHistorizedDataList(historizedDataList);
        props.setArrayProcessingList(arrayProcessingList);
        props.setStringReplacementList(stringReplacementList);
        // set the list of diagrams to still be fetched
        props.diagramsToFetch.current = diagramList;
        return true;
    }


    /**
     * Handler for a successful request to the backend for receiving the API data.
     * Transforms received data to the frontend data format, passes it to the parent component and proceeds to the next step.
     * param @jsonData The JSON-object delivered by the backend
     */
    const handleFetchInfoProviderSuccess = (jsonData: any) => {
        //console.log(jsonData);
        const data = jsonData as InfoProviderFromBackend;
        //transform the infoProvider to frontend format
        processBackendAnswer(transformBackendInfoProvider(data))

        //props.continueHandler();
    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err Error delivered by the backend
     */
    const handleFetchInfoProviderError = (err: Error) => {
        props.reportError("Fehler: Senden der Daten an das Backend fehlgeschlagen! (" + err.message + ")");
    }

    const fetchInfoProviderById = useCallFetch("visuanalytics/infoprovider/" + props.selectedId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json\n"
        }
    }, handleFetchInfoProviderSuccess, handleFetchInfoProviderError);






    /**
     * Renders an radio button item in the list of all available Infoproviders.
     */
    const renderListItem = (infoProvider: InfoProviderData) => {
        return (
            <FormControlLabel className={classes.wrappedLabel} value={infoProvider.infoprovider_id} control={
                <Radio
                />
            } label={infoProvider.infoprovider_name} key={infoProvider.infoprovider_id}
            />
        )
    }

    return (
        <StepFrame
            heading={"Infoprovider auswählen"}
            hintContent={hintContents.typeSelection}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Wählen sie den Infoprovider aus, dessen Daten in der Szenenerstellung zur Verfügung stehen sollen.
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                        <FormControl>
                            <RadioGroup value={props.selectedId}
                                        onChange={(e) => props.setSelectedId(Number(e.target.value))}>
                                {props.infoProviderList.map((infoProvider) => renderListItem(infoProvider))}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.fixedWarningContainer}>
                    { props.displayLoadMessage &&
                    <Alert severity="info">
                        Benötigte Daten werden geladen...<br/> Dies kann einen Moment dauern.
                    </Alert>
                    }
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained"
                                size="large"
                                color={"primary"}
                                onClick={props.backHandler}
                        >
                            abbrechen
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonPrimary}>
                        <Button disabled={ props.step0ContinueDisabled || props.selectedId === 0 } variant="contained"
                                size="large"
                                color={"primary"}
                                onClick={() => {
                                    props.setStep0ContinueDisabled(true);
                                    props.setDisplayLoadMessage(true);
                                    fetchInfoProviderById();
                                    props.fetchImages();
                                }}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </StepFrame>
    );
}
