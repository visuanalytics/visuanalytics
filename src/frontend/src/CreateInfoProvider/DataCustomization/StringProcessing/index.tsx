import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import {StepFrame} from "../../StepFrame";
import Box from "@material-ui/core/Box";
import {
    Button,
    Divider,
    IconButton,
    TextField,
    Typography
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import DeleteIcon from "@material-ui/icons/Delete";
import {getListItemsNames} from "../../helpermethods";
import {ArrayProcessingData, Diagram, ListItemRepresentation, StringReplacementData} from "../../types";
import {FormelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {hintContents} from "../../../util/hintContents";


interface StringProcessingProps {
    continueHandler: (index: number) => void;
    backHandler: () => void;
    reportError: (message: string) => void;
    stringReplacementList: Array<StringReplacementData>;
    setStringReplacementList: (replacements: Array<StringReplacementData>) => void;
    arrayProcessingsList: Array<ArrayProcessingData>
    listItems: Array<ListItemRepresentation>;
    customData: Array<FormelObj>;
    setCustomData: (customData: Array<FormelObj>) => void;
    diagrams: Array<Diagram>;
    setDiagrams: (diagrams: Array<Diagram>) => void;
    historizedData: Array<string>
    setHistorizedData: (historizedData: Array<string>) => void;
    apiName: string;
}


/**
 * Component for processing of strings - user can define replacing of certain sequences by others.
 */
export const StringProcessing: React.FC<StringProcessingProps> = (props) => {

    const classes = useStyles();

    //name of the currently created element given by the user
    const [name, setName] = React.useState("");
    //index of the string selected for the current replacement operation
    const [selectedStringIndex, setSelectedStringIndex] = React.useState(-1);
    //holds the string to be replaced
    const [replaceString, setReplaceString] = React.useState("");
    //holds to the string to be inserted instead
    const [withString, setWithString] = React.useState("");
    //list of all strings available
    const [availableStrings, setAvailableStrings] = React.useState<Array<string>>(["string_1", "string_2", "string_3"]);

    /**
     * Method that calculates all available strings for the list representation.
     * @param listItems The list with the frontend representation of the api data.
     * @param noArray True when the search is for an object inside an array and arrays should be ignored
     */
    const getAvailableStrings = React.useCallback((listItems: Array<ListItemRepresentation>, noArray: boolean) => {
        let availableStrings: Array<string> = [];

        listItems.forEach((listItem) => {
            if(noArray) {
                //only search for primitive string values and objects
                if(!listItem.arrayRep && !Array.isArray(listItem.value) && listItem.value === "Text")
                    availableStrings.push(listItem.parentKeyName === "" ? listItem.keyName : listItem.parentKeyName + "|" + listItem.keyName);
                else if(!listItem.arrayRep && Array.isArray(listItem.value))
                    availableStrings = availableStrings.concat(getAvailableStrings(listItem.value, true));
            } else {
                //check if it is an array
                if(listItem.arrayRep) {
                    if(Array.isArray(listItem.value)) {
                        //array containing object - recursive search with ignoring array is necessary
                        availableStrings = availableStrings.concat(getAvailableStrings(listItem.value, true));

                    } else {
                        //array containing primitives
                        if(listItem.value === "Text")
                            availableStrings.push(listItem.parentKeyName === "" ? listItem.keyName : listItem.parentKeyName + "|" + listItem.keyName)
                    }
                } else if(Array.isArray(listItem.value)) {
                    //object - recursive search without ignoring arrays is necessary
                    availableStrings = availableStrings.concat(getAvailableStrings(listItem.value, false));
                } else {
                    //the value is a primitive value
                    if(listItem.value === "Text") availableStrings.push(listItem.parentKeyName === "" ? listItem.keyName : listItem.parentKeyName + "|" + listItem.keyName)
                }
            }
        })
        return availableStrings;
    }, [])

    //extract listItems from props to use in dependencies
    const listItems = props.listItems;

    /**
     * Get the available strings when mounting
     */
    React.useEffect(() => {
        setAvailableStrings(getAvailableStrings(listItems, false));
    }, [listItems, getAvailableStrings])


    /**
     * Method that checks if a name is already used by another processing,
     * api data or formula
     * @param name The name to be checked.
     */
    const checkNameDuplicate = (name: string) => {
        //check all array processings
        for (let index = 0; index < props.arrayProcessingsList.length; index++) {
            if(name === props.arrayProcessingsList[index].name) return true;
        }
        //check all string replacements
        for (let index = 0; index < props.stringReplacementList.length; index++) {
            if(name === props.stringReplacementList[index].name) return true;
        }
        //check api data names
        if(getListItemsNames(props.listItems).includes(name)) return true;
        //check formula names
        for (let index = 0; index < props.customData.length; index++) {
            if(name === props.customData[index].formelName) return true;
        }
        return false;
    }

    /**
     * Handler method for the "save" button that adds the current replacement to the list
     * of created replacements.
     */
    const addReplacement = () => {
        //check for name duplicate first
        if(checkNameDuplicate(name)) {
            props.reportError("Der gewählte Name ist bereits vergeben!")
            return;
        }

        const arCopy = props.stringReplacementList.slice();
        arCopy.push({
            name: name,
            string: availableStrings[selectedStringIndex],
            replace: replaceString,
            with: withString
        })
        props.setStringReplacementList(arCopy);
        setName("");
        setSelectedStringIndex(-1);
        setReplaceString("");
        setWithString("");
    }

    /**
     * Method that handles clicking the remove icon for a replacement.
     * Checks if any delete dependencies exist - if so, they will be deleted as well.
     * Otherwise just the string replacement object will be deleted.
     * @param index The index of the element to be deleted.
     */
    const removeReplacementHandler = (index: number) => {
        //remove the element from historizedData
        if(props.historizedData.includes(props.stringReplacementList[index].name)) {
            props.setHistorizedData(props.historizedData.filter((data) => {
                return data !== props.stringReplacementList[index].name;
            }))
        }
        //remove the processing from the list of replacements
        const arCopy = props.stringReplacementList.slice();
        arCopy.splice(index, 1);
        props.setStringReplacementList(arCopy);
    }


    /**
     * Method that renders an entry in the list of available strings.
     * @param stringName The name of the string to be rendered.
     * @param index The index of the string in the list of all strings.
     */
    const renderStringListItem = (stringName: string, index: number) => {
        return (
            <Grid item container xs={12} key={stringName}>
                <Grid item xs={2}>
                    <Radio
                        checked={selectedStringIndex === index}
                        onChange={() => setSelectedStringIndex(index)}
                        value={index}
                        inputProps={{ 'aria-label': stringName }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="body1" className={classes.radioButtonListWrapText}>
                        {stringName}
                    </Typography>
                </Grid>
            </Grid>

        )
    }



    /**
     * Method that renders an entry in the list of all replacements created by the user.
     * @param replacement The object of the replacement to be displayed.
     * @param index The index of the entry in the list.
     */
    const renderProcessingsListEntry = (replacement: StringReplacementData, index: number) => {
        return (
            <React.Fragment key={replacement.name}>
                <Grid item container xs={12}>
                    <Grid item xs={8}>
                        <Typography className={classes.processingListingText}>
                            {replacement.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <IconButton className={classes.redDeleteIcon}
                                    onClick={() => removeReplacementHandler(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </React.Fragment>
        )
    }


    return (
        <StepFrame
            heading="String-Ersetzungen"
            hintContent={hintContents.stringProcessing}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Eine String-Ersetzung kann erstellt werden, indem man einen String aus der Liste auswählt und festlegt, welche Zeichenketten auf welche Art und Weise ersetzt werden sollen.
                    </Typography>
                    {/*<Typography variant="body1" className={classes.elementLargeMargin}>
                        Die zu ersetzende Zeichenkette kann dabei auch ein regulärer Ausdruck sein, welcher der zugehörigen <a href="https://docs.python.org/3/library/re.html" target="_blank" rel="noreferrer">Python Syntax</a>  entspricht:
                    </Typography>*/}
                </Grid>
                <Grid item container xs={12} md={8} justify="space-between" style={{height: "100%"}}>
                    <Grid item xs={12}>
                        <TextField fullWidth margin="normal" variant="filled" color="primary"
                                   label={"Name der String-Ersetzung"} value={name}
                                   onChange={(e) =>
                                       setName(e.target.value.replace(" ", "_"))
                                   }/>
                    </Grid>
                    <Grid item container xs={12} md={6} className={classes.elementLargeMargin}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Strings
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} className={classes.elementLargeMargin}>
                            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.mediumListFrame}>
                                {availableStrings.map((string, index) => renderStringListItem(string, index))}
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                        <Grid item xs={12} style={{height: "1%"}}>
                            <Typography variant="h5">
                                Ersetzen von:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth margin="normal" variant="filled" color="primary"
                                       label={"Zu ersetzender Substring"} value={replaceString}
                                       onChange={(e) =>
                                           setReplaceString(e.target.value)
                                       }/>
                        </Grid>
                        <Grid item xs={12} style={{height: "1%"}}>
                            <Typography variant="h5">
                                Ersetzen mit:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth margin="normal" variant="filled" color="primary"
                                       label={"Einzusetzender String"} value={withString}
                                       onChange={(e) =>
                                           setWithString(e.target.value)
                                       }/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} justify="space-around" className={classes.elementLargeMargin}>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button color="secondary" variant="contained" size="large"
                                    disabled={name === "" || selectedStringIndex < 0 || replaceString === ""}
                                    onClick={() => addReplacement()}
                            >
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={3}>
                    <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                        <Grid item container xs={12}>
                            {props.stringReplacementList.map((processing, index) => renderProcessingsListEntry(processing, index))}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button variant="contained" size="large" color="primary" onClick={() => props.continueHandler(2)}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}
