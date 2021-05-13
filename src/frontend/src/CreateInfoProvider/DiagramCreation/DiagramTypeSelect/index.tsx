import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Collapse from "@material-ui/core/Collapse";
import {ListItemRepresentation} from "../../index";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import {ArrayDiagramProperties} from "../index";


interface DiagramTypeSelectProps {
    continueArray: () => void;
    continueHistorized: () => void;
    backHandler: () => void;
    compatibleArrays: Array<ListItemRepresentation>
    compatibleHistorized: Array<string>;
    arrayObjects: Array<ArrayDiagramProperties>;
    setArrayObjects: (array: Array<ArrayDiagramProperties>) => void;
    selectedHistorized: Array<string>;
    setSelectedHistorized: (array: Array<string>) => void;
}


export const DiagramTypeSelect: React.FC<DiagramTypeSelectProps> = (props) => {
    const classes = useStyles();
    //holds the currently selected type
    const [selectedType, setSelectedType] = React.useState("");
    //holds the keys of all selected arrays
    const [selectedArrays, setSelectedArrays] = React.useState<Array<string>>([]);

    /**
     * Creates objects for all selected arrays and returns an array with them
     */
    const createArrayObjects = () => {
        const arrayObjects: Array<ArrayDiagramProperties> = [];
        selectedArrays.forEach((array) => {
            let item: ListItemRepresentation = {} as ListItemRepresentation;
            //find the ListItemRepresentation in the compatible Arrays
            for(let index = 0; index < props.compatibleArrays.length; ++index) {
                const element: ListItemRepresentation = props.compatibleArrays[index];
                if((element.parentKeyName===""?element.keyName:element.parentKeyName + "|" + element.keyName)===array) {
                    item = element;
                    break;
                }
            }
            //this check should always be true but is added for type reasons
            if(Object.keys(item).length!==0) {
                const arrayObject = {
                    listItem: item,
                    numericAttribute: "",
                    stringAttribute: "",
                    labelArray: new Array(1).fill(""),
                    color: "#000000",
                    numericAttributes: [],
                    stringAttributes: [],
                    customLabels: false
                }
                arrayObjects.push(arrayObject);
            }
        })
        return arrayObjects;
    }


    /**
     * Handler called when clicking the continue button.
     * Evaluates if array or historized data was selected and calls the corresponding handler method.
     * Also gets the ListItems that belong to the selected elements and creates their objects
     */
    const continueHandler = () => {
        props.setArrayObjects(createArrayObjects());
        if(selectedType==="Array") props.continueArray();
        else props.continueHistorized();
    }

    /**
     * Handler for type input change.
     * @param event The change event.
     */
    const typeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType((event.target as HTMLInputElement).value);
    }

    /**
     * Adds an item to the set of selected arrays
     * @param data The item to be added
     */
    const addToArraysSelection = (data: string) => {
        const arCopy = selectedArrays.slice()
        arCopy.push(data)
        setSelectedArrays(arCopy);
    };

    /**
     * Removes an item from the set of selected arrays
     * @param data The item to be removed
     */
    const  removeFromArraysSelection = (data: string) => {
        setSelectedArrays(selectedArrays.filter((item) => {
            return item !== data;
        }));
    };

    /**
     * Adds an item to the set of selected historized data
     * @param data The item to be added
     */
    const addToHistorizedSelection = (data: string) => {
        const arCopy = props.selectedHistorized.slice()
        arCopy.push(data)
        props.setSelectedHistorized(arCopy);
    };

    /**
     * Removes an item from the set of selected historized data
     * @param data The item to be removed
     */
    const  removeFromHistorizedSelection = (data: string) => {
        props.setSelectedHistorized(props.selectedHistorized.filter((item) => {
            return item !== data;
        }));
    };


    /**
     * Method that handles clicking on a checkbox of an array.
     * @param data The name of the list item key the checkbox was set for.
     */
    const arrayCheckboxHandler = (data: string) => {
        if (selectedArrays.includes(data)) {
            removeFromArraysSelection(data);
        } else {
            addToArraysSelection(data)
        }
    };


    /**
     * Method that handles clicking on a checkbox of historized data.
     * @param data The name of the list item key the checkbox was set for.
     */
    const historizedCheckboxHandler = (data: string) => {
        if (props.selectedHistorized.includes(data)) {
            removeFromHistorizedSelection(data);
        } else {
            addToHistorizedSelection(data)
        }
    };


    /**
     * Renders an array to be displayed in the array list.
     * @param item The array to be displayed
     */
    const renderArrayListItem = (item: ListItemRepresentation) => {
        const keyString = item.parentKeyName===""?item.keyName:item.parentKeyName + "|" + item.keyName
        return (
            <ListItem key={keyString}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => arrayCheckboxHandler(keyString)} checked={selectedArrays.includes(keyString)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={keyString}
                    secondary={null}
                />
            </ListItem>
        )
    }

    /**
     * Renders an item to be displayed in the historized data list.
     * @param item The item to be displayed
     */
    const renderHistorizedListItem = (item: string) => {
        return (
            <ListItem key={item}>
                <ListItemIcon>
                    <FormControlLabel
                        control={
                            <Checkbox onClick={() => historizedCheckboxHandler(item)} checked={props.selectedHistorized.includes(item)}/>
                        }
                        label={''}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={item}
                    secondary={null}
                />
            </ListItem>
        )
    }


    return(

        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie aus, ob das Diagramm aus einem Array oder aus historisierten Daten erstellt werden soll:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <RadioGroup value={selectedType} onChange={typeChangeHandler}>
                        <Grid item xs={12}>
                            <FormControlLabel value="Array" control={
                                <Radio
                                />
                            } label={"Diagramm basierend auf einem Array"}
                            />
                            <Collapse in={selectedType==="Array"}>
                                <Grid item container xs={12}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            Folgende Arrays des Infoproviders sind kompatibel mit Diagrammen:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                            <List disablePadding={true}>
                                                {props.compatibleArrays.map((item) => renderArrayListItem(item))}
                                            </List>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel value="HistorizedData" control={
                                <Radio
                                />
                            } label={"Diagramm aus historisierten Daten"}
                            />
                            <Collapse in={selectedType==="HistorizedData"}>
                                <Grid item container xs={12}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            Folgende historisierte Daten sind für die Diagrammerstellung geeignet:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                            <List disablePadding={true}>
                                                {props.compatibleHistorized.map((item) => renderHistorizedListItem(item))}
                                            </List>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={!((selectedType==="Array"&&selectedArrays.length!==0)||(selectedType==="HistorizedData"&&props.selectedHistorized.length!==0))} variant="contained" size="large" color="primary" onClick={continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

