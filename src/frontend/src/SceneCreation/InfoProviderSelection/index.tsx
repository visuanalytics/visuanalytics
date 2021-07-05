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
import {FrontendInfoProvider, InfoProviderFromBackend, Schedule} from "../../CreateInfoProvider/types";
import {getWeekdayString, transformBackendInfoProvider} from "../../CreateInfoProvider/helpermethods";
import {DiagramInfo, HistorizedDataInfo, InfoProviderData} from "../types";


interface InfoProviderSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProviderList: Array<InfoProviderData>;
    reportError: (message: string) => void;
    setInfoProvider: (infoProvider: FrontendInfoProvider) => void;
    setSelectedDataList: (list: Array<string>) => void;
    setCustomDataList: (list: Array<string>) => void;
    setHistorizedDataList: (list: Array<HistorizedDataInfo>) => void;
    setDiagramList: (list: Array<DiagramInfo>) => void;
    fetchImageList: () => void;
    step0ContinueDisabled: boolean;
    setStep0ContinueDisabled: (disabled: boolean) => void;
    selectedId: number;
    setSelectedId: (id: number) => void;
}

export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();


    /**
     * Method that processes the answer of the backend by extracting the lists of selectedData, customData,
     * historizedData and diagrams. Also appends the name of the dataSource to each name if that is necessary.
     * @param infoProvider The object of the Backend, transformed to the frontend representation.
     */
    const processBackendAnswer = (infoProvider: FrontendInfoProvider) => {
        // set the basic variable containing the complete object
        props.setInfoProvider(infoProvider);
        // extract the list of all selectedData, customData and historizedData
        const selectedDataList: Array<string> = [];
        const customDataList: Array<string> = [];
        const historizedDataList: Array<HistorizedDataInfo> = [];
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
                type: typeString
            })
        })
        //set the states with the new lists
        props.setSelectedDataList(selectedDataList);
        props.setCustomDataList(customDataList);
        props.setHistorizedDataList(historizedDataList);
        props.setDiagramList(diagramList);
    }


    /**
     * Calculates a string that displays the interval scheme of a given schedule
     */
    const getIntervalDisplay = (schedule: Schedule) => {
        //check for weekly
        if (schedule.type === "weekly") {
            if (schedule.weekdays !== undefined && schedule.weekdays.length !== 0) {
                //check if every day is selected
                if(schedule.weekdays.length === 7) {
                    return "24h";
                }
                const weekdayNumbers = schedule.weekdays.slice();
                weekdayNumbers.sort();
                let weekdayStrings = [getWeekdayString(weekdayNumbers[0])];
                for(let i = 1; i < weekdayNumbers.length; i++) {
                    weekdayStrings.push(getWeekdayString(weekdayNumbers[i]));
                }
                return "Wochentage ("  + weekdayStrings.join(", ") + ")";
            }
        }
        //check for daily
        else if (schedule.type === "daily") {
            return "24h"
        }
        //check for interval
        else if (schedule.type === "interval") {
            switch (schedule.interval) {
                case "minute": {
                    return "1m";
                }
                case "quarter": {
                    return "15m";
                }
                case "half": {
                    return "30m";
                }
                case "threequarter": {
                    return "45m";
                }
                case "hour": {
                    return "1h";
                }
                case "quartday": {
                    return "6h";
                }
                case "halfday": {
                    return "12h"
                }
            }
        }
        //TODO: ??? what should happen here?
        return "TO BE DONE"
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
        processBackendAnswer(transformBackendInfoProvider(data));
        props.continueHandler();
    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err Error delivered by the backend
     */
    const handleFetchInfoProviderError = (err: Error) => {
        props.reportError("Fehler: Senden der Daten an das Backend fehlgeschlagen! (" + err.message + ")");;
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
            <FormControlLabel value={infoProvider.infoprovider_id} control={
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
                                    fetchInfoProviderById();
                                    props.fetchImageList();
                                }}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </StepFrame>
    );
}
