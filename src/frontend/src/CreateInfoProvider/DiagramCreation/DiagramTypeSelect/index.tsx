import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {WeekdaySelector} from "../../HistorySelection/HistoryScheduleSelection/WeekdaySelector";
import Collapse from "@material-ui/core/Collapse";
import {ListItemRepresentation} from "../../index";
import {FormLabel, RadioGroup} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";


interface DiagramTypeSelectProps {
    continueArray: () => void;
    continueHistorized: () => void;
    backHandler: () => void;
    compatibleArrays: Array<ListItemRepresentation>
    compatibleHistorized: Array<string>;
    currentArray: ListItemRepresentation;
    setCurrentArray: (item: ListItemRepresentation) => void;
    currentHistorized: string;
    setCurrentHistorized: (data: string) => void;
};


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const DiagramTypeSelect: React.FC<DiagramTypeSelectProps> = (props) => {
    const classes = useStyles();
    //holds the currently selected type
    const [selectedType, setSelectedType] = React.useState("");
    //this is only a workaround since versions using state checks to test if something was selected had strange behaviour
    const [arrayChosen, setArrayChosen] = React.useState(false);

    /**
     * Renders an array to be displayed in the array list.
     * @param item The array to be displayed
     */
    const renderArrayListItem = (item: ListItemRepresentation) => {
        return (
            <FormControlLabel value={item.parentKeyName===""?item.keyName:item.parentKeyName + "|" + item.keyName} control={
                <Radio
                />
            } label={item.parentKeyName===""?item.keyName:item.parentKeyName + "|" + item.keyName} key={item.parentKeyName===""?item.keyName:item.parentKeyName + "|" + item.keyName}
            />
        )
    }

    /**
     * Renders an item to be displayed in the historized data list.
     * @param item The item to be displayed
     */
    const renderHistorizedListItem = (item: string) => {
        return (
            <FormControlLabel value={item} control={
                <Radio
                />
            } label={item} key={item}
            />
        )
    }

    /**
     * Handler called when clicking the continue button.
     * Evaluates if array or historized data was selected and calls the corresponding handler method.
     */
    const continueHandler = () => {
        if(selectedType==="Array") props.continueArray();
        else props.continueHistorized();
    }


    const typeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType((event.target as HTMLInputElement).value);
    }

    /**
     * Handler method for a change on the array selection.
     * @param event The change event
     */
    const arrayChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.compatibleArrays.forEach((item) => {
            if(item.parentKeyName + item.keyName==event.target.value) props.setCurrentArray(item)
        })
        setArrayChosen(true);
        //console.log(props.currentArray);
        //console.log((event.target as HTMLInputElement).value);
        //props.setCurrentArray(JSON.parse((event.target as HTMLInputElement).value));
    };
    /**
     * Handler method for a change on the historized data selection.
     * @param event The change event
     */
    const historizedChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setCurrentHistorized(event.target.value);
        //console.log(props.currentHistorized);
    };

    return(

        <Grid container>
            <Grid item xs={12}>
                <FormControl className={classes.fullWidthFormControl}>
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
                                            Folgende Arrays dieser API sind kompatibel mit Diagrammen:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                                            <FormControl>
                                                <RadioGroup onChange={arrayChangeHandler}>
                                                    {props.compatibleArrays.map((item) => renderArrayListItem(item))}
                                                </RadioGroup>
                                            </FormControl>
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
                                            <FormControl>
                                                <RadioGroup value={props.currentHistorized} onChange={historizedChangeHandler}>
                                                    {props.compatibleHistorized.map((item) => renderHistorizedListItem(item))}
                                                </RadioGroup>
                                            </FormControl>
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
                    <Button disabled={!((selectedType==="Array"&&arrayChosen)||(selectedType==="HistorizedData"&&props.currentHistorized!==""))} variant="contained" size="large" color="primary" onClick={continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
