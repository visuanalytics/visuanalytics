import React from "react";
import {useStyles} from "../../style";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    TextField
} from "@material-ui/core";
import {AudioElement, MinimalDataSource, MinimalInfoProvider} from "../../types";
import DeleteIcon from "@material-ui/icons/Delete";
import {extractKeysFromSelection} from "../../../CreateInfoProvider/helpermethods"
import {FormelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import { Schedule } from "../../../CreateInfoProvider/types";
import {ScheduleTypeTable} from "../../../CreateInfoProvider/SettingsOverview/ScheduleTypeTable";
import Box from "@material-ui/core/Box";

/**
 * This interface contains the values the component gets, passed in by props
 */
interface EditTextDialogProps {
    sceneName: string;
    openEditTextDialog: boolean;
    setOpenEditTextDialog: (openEditTextDialog: boolean) => void;
    spokenText: Array<AudioElement>;
    setSpokenText: (newText: Array<AudioElement>) => void;
    minimalInfoproviders: Array<MinimalInfoProvider>;
}

/**
 * Component that renders the information and input fields for adding TTS to a scene
 * This component could have been added to `SceneCard` directly, but was out sourced, for better readability.
 * @param props The props, the component gets passed in
 */
export const EditTextDialog: React.FC<EditTextDialogProps> = (props) => {
    const classes = useStyles();

    // The state, which holds the value for a pause that should be added. Please not, that this state is not used for modifying existing pauses
    const [newPause, setNewPause] = React.useState<number | undefined>(0);

    // This state holds all information for the audio of the scene. Audio canbe text or pause at the moment. If non spoken text is provided, an audio element with no text is generated for the state
    const [audioElements, setAudioElements] = React.useState<Array<AudioElement>>(props.spokenText.length === 0 ? [{
        type: "text",
        text: ""
    }] : props.spokenText);

    // This state holds an array with values for all given infoproviders if their data should be extended or not. The default value should be no extension
    const [showInfoproviderData, setShowInfoproviderData] = React.useState<Array<boolean>>(new Array(props.minimalInfoproviders.length).fill(false));

    // This state holds the last index from audioElements, which was edited and was of type text. This will be needed for inserting Infoprovider data
    const [lastEditedTTSTextIndex, setLastEditedTTSTextIndex] = React.useState<number>(0);

    // State, that defines, if the dialog for setting intervals for historized data should be shown or not
    const [showAddHistorizedDialog, setShowHistorizedDialog] = React.useState(false);

    // Holds the selected value of the clicked historized element, needed for the interval selection and inserting process of historized data
    const [selectedHistorizedElement, setSelectedHistorizedElement] = React.useState("");

    // Holds the schedule that applies for the selected historized element
    const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule>({type: "", time: "", interval: "", weekdays: []});

    // This state holds the interval which a user wants to use for the historized element
    const [selectedInterval, setSelectedInterval] = React.useState<number | undefined>(0);

    /**
     * Changes the value of the last edited text element in the audioElements.
     * @param selectedIndex The index that belongs to the last clicked TTS-textfield
     */
    const handleClickOnTTSTextField = (selectedIndex: number) => {
        setLastEditedTTSTextIndex(selectedIndex);
    }

    /**
     * Inserts the data from an selected element or from custom data.
     * For both categories the insertion process is equal, so there is no need of two methods.
     * The item is always inserted to the textfield, which was clicked last by the mouse.
     * @param item The item name that should be added to the textfield. This sthould be the full path, beginning with the infoprovider name
     */
    const insertSelectedOrCustomData = (item: string) => {
        const arrCopy = audioElements.slice();
        arrCopy[lastEditedTTSTextIndex].text = arrCopy[lastEditedTTSTextIndex].text + "{:" + item + ":} ";
        setAudioElements(arrCopy);
    }

    /**
     * Inserts historized data in the last clicked TTS-textfield.
     * After finishing this, the used states are reset to their default values, as declared above.
     */
    const insertHistorizedData = () => {
        if(selectedInterval !== undefined) {
            const arrCopy = audioElements.slice();
            arrCopy[lastEditedTTSTextIndex].text = arrCopy[lastEditedTTSTextIndex].text + "{:" + selectedHistorizedElement + "{" + selectedInterval.toString() + "}" + ":} ";
            setAudioElements(arrCopy);
            setSelectedInterval(0);
            setShowHistorizedDialog(false);
        }
    }

    /**
     * Toggles, if the data of a clicked infoprovider should be visible or not.
     * @param index
     */
    const toggleInfoproviderData = (index: number) => {
        const arrCopy = showInfoproviderData.slice();
        arrCopy[index] = !arrCopy[index];
        setShowInfoproviderData(arrCopy);
    }

    /**
     * Adds a new textfield to the edit dialog.
     * Before this textfield, the selected pause from the user is inserted.
     * After this operation the newPause state will be reseted to its default value
     */
    const addNewText = () => {
        const arrCopy = audioElements.slice();
        arrCopy.push({
            type: "pause",
            duration: newPause
        }, {
            type: "text",
            text: ""
        });
        setAudioElements(arrCopy);
        setNewPause(0);
    }

    /**
     * Deletes a block of pause and text
     * In almost all cases the textfield left of the button will be deleted and the following pause
     * Just in the case that the textfield is the last element, the pause before this field will be deleted.
     * @param index The index of the textfield for which the button was clicked
     */
    const deleteText = (index: number) => {
        const arrCopy = audioElements.slice();
        if(index >= audioElements.length - 2) arrCopy.splice(index - 1, 2);
        else arrCopy.splice(index, 2);
        setAudioElements(arrCopy);
    }

    /**
     * Everytime a user changes an existing text element or pause this method will be called to update the corresponding fields and states
     * The ID of the target is used to identifiy the index in the audioElements-array.
     * If the type of the element, which should be added is pause, the value of the event will be converted to a number, othervice the string will be used without further conversions
     * @param event The event sent from the element
     */
    const changeElement = (event: React.ChangeEvent<HTMLInputElement>) => {
        const editedElement = Number(event.target.id);
        const arrCopy = audioElements.slice();
        if(arrCopy[editedElement].type === "text") arrCopy[editedElement].text = event.target.value;
        else if(arrCopy[editedElement].type === "pause") arrCopy[editedElement].duration = Number(event.target.value);
        setAudioElements(arrCopy);
    }

    /**
     * Writes the audioElements to the higher state and closes the dialog for adding and editing text and audio
     */
    const saveNewAudio = () => {
        props.setSpokenText(audioElements.slice());
        props.setOpenEditTextDialog(false);
    }

    /**
     * Checks if all textfields are set with an valid input
     * "valid" means that no textfield is empty and that the pause is not less than 0ms
     */
    const isInvalidCombination = () => {
        for(let i = 0; i < audioElements.length; i++) {
            if(audioElements[i].type === "text" && audioElements[i].text === "") return true;
            else if(audioElements[i].type === "pause" && (audioElements[i].duration === undefined || audioElements[i].duration! < 0)) return true;
        }
        return false;
    }

    /**
     * If the user selected an historized element and decides to not insert it, this method will be called to clear all states
     * After the clean up the dialog for historized data interval selection will be closed as well.
     */
    const cancelHistorizedDataAdding = () => {
        setSelectedSchedule({type: "", time: "", interval: "", weekdays: []});
        setSelectedHistorizedElement("");
        setSelectedInterval(0);
        setShowHistorizedDialog(false);
    }

    /**
     * This method renders the input fields for the audio element which is passed in
     * The given index of the element will be used as the ID for the input fields
     * Dependend on the type of the current element, different fields will be rendered. This way it is not required to have two methods.
     * @param id This is the index of the element from the audioElements-array.
     * @param audioElement The audio element which should be rendered
     */
    const renderEditElement = (id: number, audioElement: AudioElement) => {
        if(audioElement.type === "text" && audioElement.text !== undefined) {
            return (
                <Grid container key={id} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item xs={12} md={10}>
                        <TextField fullWidth error={audioElement.text === ""} id={id.toString()} label="TTS-Text" multiline rowsMax={3} value={audioElement.text} onChange={changeElement} onClick={() => handleClickOnTTSTextField(id)}/>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <IconButton aria-label="Abschnitt löschen" disabled={audioElements.length <= 2} onClick={() => deleteText(id)} className={classes.redDeleteIcon}>
                            <DeleteIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            )
        } else if(audioElement.type === "pause" && audioElement.duration !== undefined) {
            return (
                <Grid key={id} item xs={10} className={classes.elementLargeMargin}>
                    <TextField fullWidth error={audioElement.duration === undefined || audioElement.duration < 0} id={id.toString()} label="Pause in ms" type="number" defaultValue={audioElement.duration} onChange={changeElement}/>
                </Grid>
            )
        }
    }

    /**
     * Method, which is called, when the user clicks on a historized element
     * This is needed to prepare all states and then opening the dialog for the interval selection
     * @param item The string (item name) which belonges to the historized element
     * @param schedule The corresponding schedule object for the selected element
     */
    const handleClickOnHistorizedData = (item: string, schedule: Schedule) => {
        setSelectedHistorizedElement(item);
        setSelectedSchedule(schedule);
        setShowHistorizedDialog(true);
    }

    //TODO: possibly find better solution than abusing span
    /**
     * Renders clickable buttons for the historized data of an infoprovider, so they can be inserted into textfields
     * @param item The item name
     * @param schedule The corresponding schedule for the rendered element, this is needed for passing to the next dialog if clicked
     */
    const renderHistorizedData = (item: string, schedule: Schedule) => {
        return (
            <ListItem key={item}>
                <Button variant="contained" size="large" onClick={() => handleClickOnHistorizedData(item, schedule)}>
                    <span className={classes.overflowButtonText}>{item}</span>
                </Button>
            </ListItem>
        );
    }

    //TODO: possibly find better solution than abusing span
    /**
     * This method renders clickable buttons for inserting selected and custom data from an infoprovider into a textfield.
     * @param item The name of the item that should be rendered
     */
    const renderSelectedDataAndCustomData = (item: string) => {
        return (
            <ListItem key={item}>
                <Button variant="contained" size="large" onClick={() => insertSelectedOrCustomData(item)}>
                    <span className={classes.overflowButtonText}>{item}</span>
                </Button>
            </ListItem>
        );
    }

    /**
     * Renders all information for a single data source of an infoprovider. This information includes, selected, custom and historized data
     * @param dataSource The data source that should be rendered
     * @param infoProviderName The infoprovider name that belonges to the data source. This is needed for constructing the whole path of an item
     */
    const renderDataSource = (dataSource: MinimalDataSource, infoProviderName: string) => {
        return (
            <Grid item container xs={12}>
                <Grid item xs={12}>
                    <Typography variant="body1" className={classes.categoryText}>
                        Gewählte Daten
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List key={dataSource.apiName + "-SelectedData"} disablePadding={true}>
                        {extractKeysFromSelection(dataSource.selectedData).map((item: string) => renderSelectedDataAndCustomData(infoProviderName + "|" + dataSource.apiName + "|" + item))}
                    </List>
                </Grid>
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <Typography variant="body1" className={classes.categoryText}>
                        Formeln
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.elementLargeMargin}>
                    <List key={dataSource.apiName + "-CustomData"} disablePadding={true}>
                        {dataSource.customData.map((item: FormelObj) => renderSelectedDataAndCustomData(item.formelName))}
                    </List>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" className={classes.categoryText}>
                        Historisierte Daten
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List key={dataSource.apiName + "-HistorizedData"} disablePadding={true}>
                        {dataSource.historizedData.map((item: string) => renderHistorizedData(item, dataSource.schedule))}
                    </List>
                </Grid>
            </Grid>
        );
    }

    /**
     * Renders all information for one infoprovider
     * @param dataSources The data sources the infoprovider holds
     * @param infoproviderName The name of the infoprovider that should be rendered
     * @param infoproviderIndex The index of the infoprovider in the array. This is needed for toggeling the visibility of its data
     */
    const renderInfoproviderData = (dataSources: Array<MinimalDataSource>, infoproviderName: string, infoproviderIndex: number) => {
        return (
            <Grid key={infoproviderName} item container xs={12}>
                <Grid item container xs={12}>
                    <Grid item xs={12} md={10}>
                        <Typography variant="h6" className={classes.infoProvNameTitle}>
                            {infoproviderName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        {!showInfoproviderData[infoproviderIndex] &&
                        <IconButton aria-label="Infoprovider-Daten ausklappen" onClick={() => toggleInfoproviderData(infoproviderIndex)}>
                            <ExpandMore/>
                        </IconButton>
                        }
                        {showInfoproviderData[infoproviderIndex] &&
                        <IconButton aria-label="Infoprovider-Daten einklappen" onClick={() => toggleInfoproviderData(infoproviderIndex)}>
                            <ExpandLess/>
                        </IconButton>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={showInfoproviderData[infoproviderIndex]}>
                        {dataSources.map((dataSource: MinimalDataSource) => renderDataSource(dataSource, infoproviderName))}
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <Divider className={classes.greyDivider}/>
                </Grid>
            </Grid>
        );
    }

    /**
     * This renders the representation of the component
     * The rendering also includes the second dialog which is used for selecting intervals for historized elements
     */
    return (
        <React.Fragment>
            <Dialog aria-labelledby="EditTextDialog-Title" maxWidth="md" open={props.openEditTextDialog}>
                <DialogTitle id="EditTextDialog-Title">Text für {props.sceneName} bearbeiten</DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item xs={12}>
                            Fügen Sie hier Texte und Pausen zur gewählten Szene <strong>{props.sceneName}</strong> hinzu.
                        </Grid>
                        <Grid container justify="space-between" className={classes.elementLargeMargin}>
                            <Grid item xs={12} md={5}>
                                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.editDialogListFrame}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Elemente</Typography>
                                    </Grid>
                                    {audioElements.map((audioElement: AudioElement, index: number) => renderEditElement(index, audioElement))}
                                    <Grid item xs={12}>
                                        <Divider  className={classes.greyDivider} />
                                    </Grid>
                                    <Grid item xs={12} className={classes.elementLargeMargin}>
                                        <Typography variant="h6">
                                            Neuer Text-Abschnitt
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField fullWidth error={newPause === undefined || newPause < 0} label="Pause vor nächstem Text in ms" type="number" value={newPause} onChange={event => setNewPause(event.target.value === "" ? undefined : Number(event.target.value))}/>
                                    </Grid>
                                    <Grid item xs={12} className={classes.blockableButtonPrimaryMarginTop}>
                                        <Button variant="contained" color="primary" disabled={newPause === undefined || newPause < 0 || audioElements[audioElements.length - 1].text === ""} onClick={addNewText}>
                                            Neuen Abschnitt hinzufügen
                                        </Button>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item container xs={12} md={6}>
                                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.editDialogListFrame}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">
                                            API-Daten
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={12}>
                                        {props.minimalInfoproviders.map((minimalInfoprovider: MinimalInfoProvider, infoproviderIndex: number) => renderInfoproviderData(minimalInfoprovider.dataSources, minimalInfoprovider.infoproviderName, infoproviderIndex))}
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.elementLargeMargin}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => props.setOpenEditTextDialog(false)}>
                                Abbrechen
                            </Button>
                        </Grid>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button variant="contained" color="secondary" disabled={isInvalidCombination()} onClick={saveNewAudio}>
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog aria-labelledby="AddHistorizedDialog-Title" open={showAddHistorizedDialog}>
                <DialogTitle id="AddHistorizedDialog-Title">
                    Intervallauswahl für {selectedHistorizedElement}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item>
                            <Typography variant="body1">
                                Legen Sie bitte das Intervall fest, welches für die TTS verwendet werden soll. Die Zahl 0 meint dabei das aktuellste Intervall, die Zahl 1 das Vorletzte, usw.
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">
                                Informationen zu Historisierungszeitpunkten des gewählten Elements:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ScheduleTypeTable schedule={selectedSchedule}/>
                        </Grid>
                        <Grid item>
                            <TextField error={selectedInterval === undefined || selectedInterval < 0} label="Wahl des Intervalls für das einzufügende Element" type="number" value={selectedInterval} onChange={event => setSelectedInterval(event.target.value === "" ? undefined : Number(event.target.value))}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.elementLargeMargin}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => cancelHistorizedDataAdding()}>
                                Abbrechen
                            </Button>
                        </Grid>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button variant="contained" color="secondary" disabled={selectedInterval === undefined || selectedInterval < 0} onClick={() => insertHistorizedData()}>
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
