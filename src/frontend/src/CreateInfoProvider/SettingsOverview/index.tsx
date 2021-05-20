import React from "react";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {formelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource, Schedule, SelectedDataItem} from "..";
import { ScheduleTypeTable } from "./ScheduleTypeTable";

interface SettingsOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    setStep: (step: number) => void;
    name: string;
    setName: (name: string) => void;
    selectedData: Array<string>;
    customData: Array<formelObj>;
    historizedData: Array<string>;
    schedule: Schedule;
    dataSources: DataSource[];
    setDataSources: (dataSources: DataSource[]) => void;
    storageID: String
    setApiName: (apiName: string) => void;
    setQuery: (query: string) => void;
    setApiKeyInput1: (apiKeyInput1: string) => void;
    setApiKeyInput2: (apiKeyInput2: string) => void;
    setNoKey: (noKey: boolean) => void;
    setMethod: (method: string) => void;
    setApiData: (apiData: {}) => void;
    setSelectedData: (selectedData: SelectedDataItem[]) => void;
    setCustomData: (customData: formelObj[]) => void;
    setHistorizedData: (historizedData: string[]) => void;
    setSchedule: (schedule: Schedule) => void;
    setHistorySelectionStep: (historySelectionStep: number) => void;
}

/**
 * Component that renders the settings overview for the creation of the Infoprovider.
 * @param props The properties passed by the parent.
 */
export const SettingsOverview: React.FC<SettingsOverviewProps> = (props) => {
    const classes = useStyles();

    /**
     * Renders one list item for the list of selected data, custom data or historized data.
     * @param item The entry that should be rendered.
     */
    const renderListItem = (item: string) => {
        return(
            <ListItem key={item} divider={true}>
                <ListItemText primary={item} secondary={null}/>
            </ListItem>
        )
    }

    const prepareForNewDataSource = () => {
        // Clean up the session storage
        sessionStorage.removeItem("apiName-" + props.storageID);
sessionStorage.removeItem("query" + props.storageID);
sessionStorage.removeItem("noKey-" + props.storageID);
sessionStorage.removeItem("method-" + props.storageID);
sessionStorage.removeItem("apiData-" + props.storageID);
sessionStorage.removeItem("selectedData-" + props.storageID);
sessionStorage.removeItem("customData-" + props.storageID);
        sessionStorage.removeItem("historizedData-" + props.storageID);

        // Reset the states that need to be cleaned
        props.setApiName("");
        props.setQuery("");
        props.setApiKeyInput1("");
        props.setApiKeyInput2("");
        props.setNoKey(false);
        props.setMethod("");
        props.setApiData({});
        props.setSelectedData(new Array<SelectedDataItem>());
        props.setCustomData(new Array<formelObj>());
        props.setHistorizedData(new Array<string>());
        props.setSchedule({type: "weekly", interval: "halfday", time: "", weekdays: []});
        props.setHistorySelectionStep(1);
    }

    /**
     * This method is triggered when the user wants to add another data source to the Infoprovider
     */
    const newDataSourceHandler = () => {
        prepareForNewDataSource();
        props.setStep(0);
    }

    // TODO Under selected Data list the added data Sources with names and possebly some other information such as amount of selected data, custom data or historized data
    // TODO Delete data source button next to every data source. (Requires name of data Source, which cannot be set yet)
    return(
        <StepFrame
            heading={"Übersicht"}
            hintContent={hintContents.basicSettings}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Übersicht über ausgewählte Daten
                    </Typography>
                </Grid>
                <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Daten und Formeln
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                            <List disablePadding={true}>
                                {props.selectedData.map((item: string) => renderListItem(item))}
                                {props.customData.map((item: formelObj) => renderListItem(item.formelName))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Zu historisierende Daten
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.smallListFrame}>
                            <List disablePadding={true}>
                                {props.historizedData.map((item: string) => renderListItem(item))}
                            </List>
                        </Box>
                    </Grid>
                    {props.schedule.type !== "" &&
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Historisierungszeiten
                        </Typography>
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5}>
                            {props.schedule.type !== "" &&
                            <Grid item xs={12}>
                                <ScheduleTypeTable schedule={props.schedule}/>
                            </Grid>
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={newDataSourceHandler}>
                            Weitere Datenquelle hinzufügen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                            abschließen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
