import React from "react";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Button from "@material-ui/core/Button";
import {FormControl, Grid, InputLabel, Select, MenuItem, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {formelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource, extractKeysFromSelection, Schedule, SelectedDataItem} from "..";
import { ScheduleTypeTable } from "./ScheduleTypeTable";

interface SettingsOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    setStep: (step: number) => void;
    name: string;
    setName: (name: string) => void;
    dataSources: DataSource[];
    setDataSources: (dataSources: DataSource[]) => void;
    storageID: string
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
 * This component renders the information for the selected data source.
 * @param props The properties passed by the parent.
 */
export const SettingsOverview: React.FC<SettingsOverviewProps> = (props) => {
    const classes = useStyles();

    // The currently selected data source for the settings overview
    const [selectedDataSource, setSelectedDataSource] = React.useState(props.dataSources.length - 1);
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

    /**
     * This method cleans up the session storage and the states, before letting the user create another data source.
     * This is needed, so that the text fields and checkboxes have their default behaviour for new data sources and are not influenced by the last source.
     */
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
        sessionStorage.removeItem("schedule-" + props.storageID);
        sessionStorage.removeItem("historySelectionStep-" + props.storageID);

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
        props.setSchedule({type: "", interval: "", time: "", weekdays: []});
        props.setHistorySelectionStep(1);
    }

    /**
     * This method is triggered when the user wants to add another data source to the Infoprovider
     */
    const newDataSourceHandler = () => {
        prepareForNewDataSource();
        props.setStep(0);
    }

    /**
     * This method refreshes the currently selected data source.
     * It is called when the user changes the selected entry in the data source dropdown.
     * @param event The change event provided by the Select component
     */
    const handleChangeSelectedDataSource = (event: React.ChangeEvent<{value: unknown}>) => {
        setSelectedDataSource(event.currentTarget.value as number);
    }

    /**
     * Renders one entry of the Select component for all data sources.
     * @param dataSource The data source that wants to be rendered.
     * @param dataSourceNumber The index of the data source in the dataSources array.
     */
    const renderDataSource = (dataSource: DataSource, dataSourceNumber: number) => {
        return (
            <MenuItem key={dataSource.apiName} value={dataSourceNumber}>{dataSource.apiName}</MenuItem>
        )
    }

    // TODO: Delete data source button next to every data source.
    //TODO: Three buttons at the button are not displayed correctly when reducing screen width.
    return(
        <StepFrame
            heading={"Übersicht"}
            hintContent={hintContents.basicSettings}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"} label={"Info-Provider Name"}
                               value={props.name}
                               onChange={event => (props.setName(event.target.value))}>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                        Übersicht über ausgewählte Daten
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="select-dataSource-dropDown">Wahl der Datenquelle</InputLabel>
                        <Select value={selectedDataSource} onChange={handleChangeSelectedDataSource}>
                            {props.dataSources.map((item: DataSource, index: number) => renderDataSource(item, index))}
                        </Select>
                    </FormControl>
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
                                {extractKeysFromSelection(props.dataSources[selectedDataSource].selectedData).map((item: string) => renderListItem(item))}
                                {props.dataSources[selectedDataSource].customData.map((item: formelObj) => renderListItem(item.formelName))}
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
                                {props.dataSources[selectedDataSource].historizedData.map((item: string) => renderListItem(item))}
                            </List>
                        </Box>
                    </Grid>
                    {props.dataSources[selectedDataSource].schedule.type !== "" &&
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Historisierungszeiten
                        </Typography>
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5}>
                            {props.dataSources[selectedDataSource].schedule.type !== "" &&
                            <Grid item xs={12}>
                                <ScheduleTypeTable schedule={props.dataSources[selectedDataSource].schedule}/>
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
                        <Button onClick={() => props.setStep(6)}>
                            Zu den Diagrammen
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
