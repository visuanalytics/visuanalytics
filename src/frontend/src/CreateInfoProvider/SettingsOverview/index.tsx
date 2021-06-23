import React from "react";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Button from "@material-ui/core/Button";
import {
    FormControl,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    DialogTitle,
    DialogContent, DialogActions, Dialog
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {ScheduleTypeTable} from "./ScheduleTypeTable";

import {
    DataSource,
    DataSourceKey,
    Diagram,
    ListItemRepresentation,
    Schedule,
    SelectedDataItem,
    uniqueId
} from "../types";
import {extractKeysFromSelection} from "../helpermethods";

interface SettingsOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    setStep: (step: number) => void;
    name: string;
    setName: (name: string) => void;
    dataSources: DataSource[];
    setDataSources: (dataSources: DataSource[]) => void;
    apiName: string;
    setApiName: (apiName: string) => void;
    setQuery: (query: string) => void;
    setApiKeyInput1: (apiKeyInput1: string) => void;
    setApiKeyInput2: (apiKeyInput2: string) => void;
    setNoKey: (noKey: boolean) => void;
    setMethod: (method: string) => void;
    //setApiData: (apiData: {}) => void;
    setSelectedData: (selectedData: SelectedDataItem[]) => void;
    setCustomData: (customData: FormelObj[]) => void;
    setHistorizedData: (historizedData: string[]) => void;
    setSchedule: (schedule: Schedule) => void;
    setHistorySelectionStep: (historySelectionStep: number) => void;
    setListItems: (array: Array<ListItemRepresentation>) => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    dataSourcesKeys: Map<string, DataSourceKey>;
    setDataSourcesKeys: (map: Map<string, DataSourceKey>) => void;
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
    //true when the dialog for deleting a datasource is open
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    //holds the name of all diagrams that need to be removed when deleting the current selection
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);

    //TODO: document delete mechanism
    /**
     * Handler method for clicking the delete data source button.
     * Gets the currently selected datasource by the selectedDataSource state and checks if deleting it
     * will delete any diagrams.
     * Opens the dialog asking the user for confirmation afterwards
     */
    const deleteDataSourceHandler = () => {
        //TODO: search for diagrams depending on this
        const diagramsToRemove: Array<string> = [];
        const dataSourceName = props.dataSources[selectedDataSource].apiName;
        props.diagrams.forEach((diagram) => {
            if (diagram.sourceType === "Array" && diagram.arrayObjects !== undefined) {
                //diagram with arrays
                for (let index = 0; index < diagram.arrayObjects.length; index++) {
                    if (diagram.arrayObjects[index].listItem.parentKeyName.split("|")[0] === dataSourceName) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            } else if (diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                //diagrams with historized
                for (let index = 0; index < diagram.historizedObjects.length; index++) {
                    if (diagram.historizedObjects[index].name.split("|")[0] === dataSourceName) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            }
        })
        if (diagramsToRemove.length > 0) setDiagramsToRemove(diagramsToRemove);
        setDeleteDialogOpen(true);
    }

    /**
     * Method that deletes the currently selected dataSource.
     * Checks if the state diagramsToRemove contains any items and removes them too, if necessary.
     * Also sets the selected dataSource to the now last dataSource in the dataSources array.
     */
    const deleteSelectedDataSource = (deleteDiagrams: boolean) => {
        //delete the dataSource
        props.setDataSources(props.dataSources.filter((dataSource) => {
            return dataSource.apiName !== props.dataSources[selectedDataSource].apiName;
        }));
        //remove its entries from the key map
        const mapCopy = new Map(props.dataSourcesKeys);
        if (mapCopy.get(props.dataSources[selectedDataSource].apiName) !== undefined) {
            mapCopy.delete(props.dataSources[selectedDataSource].apiName)
        }
        props.setDataSourcesKeys(mapCopy);

        props.dataSources.length <= 1 ? setSelectedDataSource(0) : setSelectedDataSource(props.dataSources.length - 2)

        if (deleteDiagrams) {
            //if diagrams need to be removed, remove them
            if (diagramsToRemove.length > 0) {
                props.setDiagrams(props.diagrams.filter((diagram) => {
                    return !diagramsToRemove.includes(diagram.name);
                }))
            }
            //reset the states
            setDiagramsToRemove([]);
        }

        setDeleteDialogOpen(false);
    }

    const manageBackDelete = () => {

        let dataSourceTmp = props.dataSources[selectedDataSource];
        let dataSourceKeysTmp = props.dataSourcesKeys.get(props.dataSources[selectedDataSource].apiName);

        deleteSelectedDataSource(false);

        props.setApiName(dataSourceTmp.apiName);
        props.setQuery(dataSourceTmp.query);
        props.setNoKey(dataSourceTmp.noKey);
        props.setMethod(dataSourceTmp.method);
        props.setSelectedData(dataSourceTmp.selectedData);
        props.setCustomData(dataSourceTmp.customData);
        props.setHistorizedData(dataSourceTmp.historizedData);
        props.setSchedule(dataSourceTmp.schedule)

        if (dataSourceKeysTmp) {
            props.setApiKeyInput1(dataSourceKeysTmp.apiKeyInput1);
            props.setApiKeyInput2(dataSourceKeysTmp.apiKeyInput2);
        }

        props.backHandler();

    }

    /**
     * Renders one list item for the list of selected data, custom data or historized data.
     * @param item The entry that should be rendered.
     */
    const renderListItem = (item: string) => {
        return (
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
        sessionStorage.removeItem("apiName-" + uniqueId);
        sessionStorage.removeItem("query" + uniqueId);
        sessionStorage.removeItem("noKey-" + uniqueId);
        sessionStorage.removeItem("method-" + uniqueId);
        //sessionStorage.removeItem("apiData-" + uniqueId);
        sessionStorage.removeItem("selectedData-" + uniqueId);
        sessionStorage.removeItem("customData-" + uniqueId);
        sessionStorage.removeItem("historizedData-" + uniqueId);
        sessionStorage.removeItem("schedule-" + uniqueId);
        sessionStorage.removeItem("historySelectionStep-" + uniqueId);
        sessionStorage.removeItem("listItems-" + uniqueId);

        // Reset the states that need to be cleaned
        props.setApiName("");
        props.setQuery("");
        props.setApiKeyInput1("");
        props.setApiKeyInput2("");
        props.setNoKey(false);
        props.setMethod("");
        //props.setApiData({});
        props.setSelectedData(new Array<SelectedDataItem>());
        props.setCustomData(new Array<FormelObj>());
        props.setHistorizedData(new Array<string>());
        props.setSchedule({type: "", interval: "", time: "", weekdays: []});
        props.setHistorySelectionStep(1);
        props.setListItems(new Array<ListItemRepresentation>());
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
    const handleChangeSelectedDataSource = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDataSource(event.target.value as number);
    }

    /**
     * Displays the history content of the current dataSource. Used to only show the boxes when data was historized.
     */
    const getHistoryContent = () => {
        if(props.dataSources[selectedDataSource].historizedData.length > 0) {
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.smallListFrame}>
                            <List disablePadding={true}>
                                {props.dataSources[selectedDataSource].historizedData.map((item: string) => renderListItem(item))}
                            </List>
                        </Box>
                    </Grid>
                    {props.dataSources[selectedDataSource].schedule.type !== "" &&
                    <Grid item xs={12} className={classes.elementSmallMargin}>
                        <Typography variant="h6">
                            Historisierungszeiten
                        </Typography>
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.smallListFrame}>
                            {props.dataSources[selectedDataSource].schedule.type !== "" &&
                            <Grid item xs={12}>
                                <ScheduleTypeTable schedule={props.dataSources[selectedDataSource].schedule}/>
                            </Grid>
                            }
                        </Box>
                    </Grid>
                </React.Fragment>
            )
        } else {
            return (
                <Typography variant="body1">
                    Es wurden für diese Datenquelle keine Daten zur Historisierung ausgewählt.
                </Typography>
            )
        }
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

    //TODO: Three buttons at the button are not displayed correctly when reducing screen width.
    return (
        <StepFrame
            heading={"Übersicht"}
            hintContent={hintContents.basicSettings}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"}
                               label={"Info-Provider Name"}
                               value={props.name}
                               onChange={event => (props.setName(event.target.value.replace(' ', '_')))}>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                        Übersicht über ausgewählte Daten
                    </Typography>
                </Grid>
                <Grid item container xs={12} md={6} justify="space-around">
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="select-dataSource-dropDown">Wahl der Datenquelle</InputLabel>
                            <Select value={selectedDataSource} onChange={handleChangeSelectedDataSource}>
                                {props.dataSources.map((item: DataSource, index: number) => renderDataSource(item, index))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item container className={classes.elementLargeMargin} justify="space-around">
                        <Grid item className={classes.blockableButtonDelete}>
                            <Button disabled={props.dataSources.length <= 1}
                                    variant="contained" size="large"
                                    onClick={deleteDataSourceHandler} className={classes.redDeleteButton}>
                                Datenquelle Löschen
                            </Button>
                        </Grid>
                    </Grid>

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
                                {props.dataSources[selectedDataSource].customData.map((item: FormelObj) => renderListItem(item.formelName))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={5} className={classes.historizedOverviewContainer}>
                    <Grid item xs={12}>
                        <Typography variant="h5" >
                            Zu historisierende Daten
                        </Typography>
                    </Grid>
                    <Grid item container xs={12} className={props.dataSources[selectedDataSource].historizedData.length === 0 ? classes.elementExtraLargeMargin : classes.elementLargeMargin}>
                        {getHistoryContent()}
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={() => {
                            manageBackDelete();
                        }}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={() =>
                            newDataSourceHandler()
                        }>
                            Weitere Datenquelle hinzufügen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={() => props.setStep(6)}>
                            Diagramme
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant="contained" size="large" color="secondary" onClick={props.continueHandler}>
                            abschließen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={() => {
                setDeleteDialogOpen(false);
                window.setTimeout(() => {
                    setDiagramsToRemove([]);
                }, 200);
            }} aria-labelledby="deleteDialog-title"
                    open={deleteDialogOpen}>
                <DialogTitle id="deleteDialog-title">
                    Löschen von "{props.dataSources[selectedDataSource].apiName}" bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Die Datenquelle "{props.dataSources[selectedDataSource].apiName}" wird unwiderruflich gelöscht.
                    </Typography>
                    {diagramsToRemove.length > 0 &&
                    <Typography gutterBottom>
                        Das Löschen der Datenquelle wird außerdem alle Diagramme löschen, die diese Datenquelle
                        nutzen.<br/><br/><br/>Folgende Diagramme sind
                        betroffen: <strong>{diagramsToRemove.join(", ")}</strong>
                    </Typography>
                    }
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                        window.setTimeout(() => {
                                            setDiagramsToRemove([]);
                                        }, 200);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => deleteSelectedDataSource(true)}
                                    className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>
    );
}
