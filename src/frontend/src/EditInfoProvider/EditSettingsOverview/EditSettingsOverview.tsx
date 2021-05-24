import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";
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
import {ComponentContext} from "../../ComponentProvider";
import {DataSource, extractKeysFromSelection} from "../../CreateInfoProvider";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import {formelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {ScheduleTypeTable} from "../../CreateInfoProvider/SettingsOverview/ScheduleTypeTable";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";


interface EditSettingsOverviewProps {
    continueHandler: () => void;
    editInfoProvider: () => void;
    infoProvName: string;
    setInfoProvName: (name: string) => void;
    infoProvDataSources: Array<DataSource>;
}

export const EditSettingsOverview: React.FC<EditSettingsOverviewProps> = (props) => {

    const classes = useStyles();

    const components = React.useContext(ComponentContext);

    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    const [selectedDataSource, setSelectedDataSource] = React.useState(0);

    const confirmCancel = () => {
        components?.setCurrent("dashboard")
    }

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

    return (
        <StepFrame
            heading={'Bearbeiten eines Infoproviders:'}
            hintContent={"Überblick"}>
            <Grid container justify={"space-evenly"}>
                Overview
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>

                    <Grid item xs={12}>
                        <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"} label={"Info-Provider Name"}
                                   value={props.infoProvName}
                                   onChange={event => (props.setInfoProvName(event.target.value))}>
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
                            <Select value={props.infoProvDataSources} onChange={handleChangeSelectedDataSource}>
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
                                    {extractKeysFromSelection(props.infoProvDataSources[selectedDataSource].selectedData).map((item: string) => renderListItem(item))}
                                    {props.infoProvDataSources[selectedDataSource].customData.map((item: formelObj) => renderListItem(item.formelName))}
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
                                    {props.infoProvDataSources[selectedDataSource].historizedData.map((item: string) => renderListItem(item))}
                                </List>
                            </Box>
                        </Grid>
                        {props.infoProvDataSources[selectedDataSource].schedule.type !== "" &&
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Historisierungszeiten
                            </Typography>
                        </Grid>
                        }
                        <Grid item xs={12}>
                            <Box borderColor="primary.main" border={4} borderRadius={5}>
                                {props.infoProvDataSources[selectedDataSource].schedule.type !== "" &&
                                <Grid item xs={12}>
                                    <ScheduleTypeTable schedule={props.infoProvDataSources[selectedDataSource].schedule}/>
                                </Grid>
                                }
                            </Box>
                        </Grid>
                    </Grid>


                    <Grid item container xs={12} justify={"space-between"}>
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
                            <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                    <Dialog onClose={() => setCancelDialogOpen(false)} aria-labelledby="deleteDialog-title"
                            open={cancelDialogOpen}>
                        <DialogTitle id="deleteDialog-title">
                            Abbrechen!
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Wollen sie wirklich abbrechen?
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
        </StepFrame>
    )
}
