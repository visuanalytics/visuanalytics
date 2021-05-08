import React from "react";
import { useStyles } from "../../style";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {WeekdaySelector} from "../../HistorySelection/HistoryScheduleSelection/WeekdaySelector";
import Collapse from "@material-ui/core/Collapse";
import {ListItemRepresentation} from "../../index";
import {FormLabel, RadioGroup} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";


interface DiagramTypeSelectProps {
    continueHandler: () => void;
    backHandler: () => void;
    historizedData: Array<string>;
    compatibleArrays: Array<ListItemRepresentation>
    currentArray: ListItemRepresentation;
    setCurrentArray: (item: ListItemRepresentation) => void;
};


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const DiagramTypeSelect: React.FC<DiagramTypeSelectProps> = (props) => {
    const classes = useStyles();

    const [selectedType, setSelectedType] = React.useState("");


    const renderArrayListItem = (item: ListItemRepresentation) => {
        return (
            <FormControlLabel value={item.parentKeyName + item.keyName} control={
                <Radio
                />
            } label={item.parentKeyName + item.keyName}
            />
        )
    }

    const renderHistorizedListItem = () => {

    }


    const typeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType((event.target as HTMLInputElement).value);
    }

    const arrayChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.compatibleArrays.forEach((item) => {
            if(item.parentKeyName + item.keyName==event.target.value) props.setCurrentArray(item)
        })
        //console.log((event.target as HTMLInputElement).value);
        //props.setCurrentArray(JSON.parse((event.target as HTMLInputElement).value));
    };

    return(

        <Grid container>
            <FormControl component="fieldset">
                <RadioGroup value={selectedType} onChange={typeChangeHandler}>
                <Grid item xs={12}>
                    <FormControlLabel value="Array" control={
                        <Radio
                        />
                    } label={"Diagramm basierend auf einem Array"}
                    />
                    <Collapse in={selectedType==="Array"}>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Arrays</FormLabel>
                                <RadioGroup value={props.currentArray.keyName} onChange={arrayChangeHandler}>
                                    {props.compatibleArrays.map((item) => renderArrayListItem(item))}
                                </RadioGroup>
                            </FormControl>
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
                        <Grid item xs={12}>

                        </Grid>
                    </Collapse>
                </Grid>
                </RadioGroup>
            </FormControl>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};
