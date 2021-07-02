import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {FormelObj} from "../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {ScheduleTypeTable} from "../../CreateInfoProvider/SettingsOverview/ScheduleTypeTable";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {DataSource, DataSourceKey, Diagram} from "../../CreateInfoProvider/types";
import {extractKeysFromSelection} from "../../CreateInfoProvider/helpermethods";


interface EditSettingsOverviewProps {
    continueHandler: (index: number) => void;
    handleBack: (index: number) => void;
    editInfoProvider: () => void;
    infoProvName: string;
    setInfoProvName: (name: string) => void;
    infoProvDataSources: Array<DataSource>;
    setInfoProvDataSources: (dataSources: Array<DataSource>) => void;
    selectedDataSource: number;
    setSelectedDataSource: (index: number) => void;
    finishNewDataSource: (dataSource: DataSource, apiKeyInput1: string, apiKeyInput2: string) => void;
    setNewDataSourceMode: (addNewDataSource: boolean) => void;
    infoProvDiagrams: Array<Diagram>;
    setInfoProvDiagrams: (diagrams: Array<Diagram>) => void;
    infoProvDataSourcesKeys: Map<string, DataSourceKey>
    setInfoProvDataSourcesKeys: (keys: Map<string, DataSourceKey>) => void;
}

export const EditSettingsOverview: React.FC<EditSettingsOverviewProps> = (props) => {

    console.log(props.infoProvDataSources);

    const classes = useStyles();

    /**
     * Boolean that is used to open and close the cancel-dialog
     */
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    //true when the dialog for deleting a datasource is open
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    //holds the name of all diagrams that need to be removed when deleting the current selection
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);
    /**
     * Handler method for clicking the delete data source button.
     * Gets the currently selected datasource by the selectedDataSource state and checks if deleting it
     * will delete any diagrams.
     * Opens the dialog asking the user for confirmation afterwards
     */
    const deleteDataSourceHandler = () => {
        const diagramsToRemove: Array<string> = [];
        const dataSourceName = props.infoProvDataSources[props.selectedDataSource].apiName;
        props.infoProvDiagrams.forEach((diagram) => {
            if(diagram.sourceType==="Array" && diagram.arrayObjects!==undefined) {
                //diagram with arrays
                for (let index = 0; index < diagram.arrayObjects.length; index ++) {
                    if(diagram.arrayObjects[index].listItem.parentKeyName.split("|")[0]===dataSourceName) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            } else if(diagram.sourceType==="Historized" && diagram.historizedObjects!==undefined) {
                //diagrams with historized
                for (let index = 0; index < diagram.historizedObjects.length; index ++) {
                    if(diagram.historizedObjects[index].name.split("|")[0]===dataSourceName) {
                        diagramsToRemove.push(diagram.name);
                        break;
                    }
                }
            }
        })
        if(diagramsToRemove.length > 0) setDiagramsToRemove(diagramsToRemove);
        setDeleteDialogOpen(true);
    }

    /**
     * Method that deletes the currently selected dataSource.
     * Checks if the state diagramsToRemove contains any items and removes them too, if necessary.
     * Also sets the selected dataSource to the now last dataSource in the dataSources array.
     */
    const deleteSelectedDataSource = () => {
        //delete the dataSource
        props.setInfoProvDataSources(props.infoProvDataSources.filter((dataSource) => {
            return dataSource.apiName!==props.infoProvDataSources[props.selectedDataSource].apiName;
        }));
        //remove its entries from the key map
        const mapCopy = new Map(props.infoProvDataSourcesKeys);
        if (mapCopy.get(props.infoProvDataSources[props.selectedDataSource].apiName) !== undefined) {
            mapCopy.delete(props.infoProvDataSources[props.selectedDataSource].apiName)
        }
        props.setInfoProvDataSourcesKeys(mapCopy);
        props.setSelectedDataSource(props.infoProvDataSources.length - 2);
        //if diagrams need to be removed, remove them
        if(diagramsToRemove.length > 0) {
            props.setInfoProvDiagrams(props.infoProvDiagrams.filter((diagram) => {
                return !diagramsToRemove.includes(diagram.name);
            }))
        }
        //reset the states
        setDiagramsToRemove([]);
        setDeleteDialogOpen(false);
    }


    /**
     * Method that is called when the use confirms the cancel in the confirm-cancel-dialog
     */
    const confirmCancel = () => {
        props.handleBack(1);
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
     * This method refreshes the currently selected data source.
     * It is called when the user changes the selected entry in the data source dropdown.
     * @param event The change event provided by the Select component
     */
    const handleChangeSelectedDataSource = (event: React.ChangeEvent<{ value: unknown }>) => {
        props.setSelectedDataSource(Number(event.target.value));

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


    return (
        <StepFrame
            heading={'Bearbeiten eines Infoproviders:'}
            hintContent={"Überblick"}>
            <Grid container justify={"space-evenly"}>
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"}
                                   label={"Info-Provider Name"}
                                   value={props.infoProvName}
                                   onChange={event => (props.setInfoProvName(event.target.value.replace(' ', '_')))}>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                            Übersicht über ausgewählte Daten
                        </Typography>
                        <Grid item className={classes.elementLargeMargin}>
                            <Button disabled={props.infoProvDataSources.length <= 1} variant="contained" size="large" className={classes.redDeleteButton} onClick={deleteDataSourceHandler}>
                                Datenquelle Löschen
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="select-dataSource-dropDown">Wahl der Datenquelle</InputLabel>
                            <Select value={props.selectedDataSource} onChange={handleChangeSelectedDataSource}>
                                {props.infoProvDataSources.map((item: DataSource, index: number) => renderDataSource(item, index))}
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
                                    {extractKeysFromSelection(props.infoProvDataSources[props.selectedDataSource].selectedData).map((item: string) => renderListItem(item))}
                                    {props.infoProvDataSources[props.selectedDataSource].customData.map((item: FormelObj) => renderListItem(item.formelName))}
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
                            <Box borderColor="primary.main" border={4} borderRadius={5}
                                 className={classes.smallListFrame}>
                                <List disablePadding={true}>
                                    {props.infoProvDataSources[props.selectedDataSource].historizedData.map((item: string) => renderListItem(item))}
                                </List>
                            </Box>
                        </Grid>
                        {props.infoProvDataSources[props.selectedDataSource].schedule.type !== "" &&
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Historisierungszeiten
                            </Typography>
                        </Grid>
                        }
                        <Grid item xs={12}>
                            <Box borderColor="primary.main" border={4} borderRadius={5}
                                 className={classes.smallListFrame}>
                                {props.infoProvDataSources[props.selectedDataSource].schedule.type !== "" &&
                                <Grid item xs={12}>
                                    <ScheduleTypeTable
                                        schedule={props.infoProvDataSources[props.selectedDataSource].schedule}/>
                                </Grid>
                                }
                            </Box>
                        </Grid>
                    </Grid>


                    <Grid item container xs={12} justify="space-between">
                        <Grid item>
                            <Button variant={"contained"} size={"large"}
                                    className={classes.redButton}
                                    onClick={() => setCancelDialogOpen(true)}>
                                Abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"secondary"}
                                    onClick={() => props.editInfoProvider()}>
                                Speichern
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="large" color="primary" onClick={() => props.continueHandler(1)}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} justify="space-around" className={classes.elementLargeMargin}>
                        <Grid item>
                            <Button variant="contained" size="large" color="primary"
                                    onClick={() => props.setNewDataSourceMode(true)}>
                                Neue Datenquelle hinzufügen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"secondary"}
                                    onClick={() => props.continueHandler(6)}>
                                Diagramme
                            </Button>
                        </Grid>
                    </Grid>
                    <Dialog onClose={() => setCancelDialogOpen(false)} aria-labelledby="deleteDialog-title"
                            open={cancelDialogOpen}>
                        <DialogTitle id="deleteDialog-title">
                            Wollen Sie wirklich Abbrechen?
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Ihre Änderungen gehen verloren!
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Grid container justify="space-between">
                                <Grid item>
                                    <Button variant="contained" color={"primary"}
                                            onClick={() => setCancelDialogOpen(false)}>
                                        zurück
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained"
                                            onClick={() => confirmCancel()}
                                            className={classes.redButton}>
                                        Abbrechen
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
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
                    Löschen von "{props.infoProvDataSources[props.selectedDataSource].apiName}" bestätigen
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Die Datenquelle "{props.infoProvDataSources[props.selectedDataSource].apiName}" wird unwiderruflich gelöscht.
                    </Typography>
                    { diagramsToRemove.length > 0 &&
                    <Typography gutterBottom>
                        Das Löschen der Datenquelle wird außerdem alle Diagramme löschen, die diese Datenquelle nutzen.<br/><br/><br/>Folgende Diagramme sind betroffen: <strong>{diagramsToRemove.join(", ")}</strong>
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
                                    onClick={() => deleteSelectedDataSource()}
                                    className={classes.redDeleteButton}>
                                Löschen bestätigen
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>
    )
}
