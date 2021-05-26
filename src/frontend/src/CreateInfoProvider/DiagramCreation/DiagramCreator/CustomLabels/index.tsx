import React from "react";
import {useStyles} from "../../style";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import {ArrayDiagramProperties, HistorizedDiagramProperties} from "../../index";
import {FormControlLabel} from "@material-ui/core";

interface CustomLabelsProps {
    amount: number;
    arrayObjects?: Array<ArrayDiagramProperties>
    selectedArrayOrdinal?: number;
    historizedObjects?: Array<HistorizedDiagramProperties>
    selectedHistorizedOrdinal?: number;
    changeObjectInArrayObjects?: (object: ArrayDiagramProperties, ordinal: number) => void;
    changeObjectInHistorizedObjects?: (object: HistorizedDiagramProperties, ordinal: number) => void;
}

export const CustomLabels: React.FC<CustomLabelsProps> = (props) => {
    const classes = useStyles();

    /**
     * Event handler for changing one of the input fields. Behaves differently
     * @param event The event caused by the change, holding the new value.
     * @param ordinal The ordinal of the element whose value was changed.
     */
    const labelChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, ordinal: number) => {
        if (props.arrayObjects !== undefined && props.selectedArrayOrdinal !== undefined && props.changeObjectInArrayObjects !== undefined) {
            const newLabels = [...props.arrayObjects[props.selectedArrayOrdinal].labelArray];
            newLabels[ordinal] = event.target.value;
            const objCopy = {
                ...props.arrayObjects[props.selectedArrayOrdinal],
                labelArray: newLabels
            }
            props.changeObjectInArrayObjects(objCopy, props.selectedArrayOrdinal);
        } else if (props.historizedObjects !== undefined && props.selectedHistorizedOrdinal !== undefined && props.changeObjectInHistorizedObjects !== undefined) {
            const newLabels = [...props.historizedObjects[props.selectedHistorizedOrdinal].labelArray];
            newLabels[ordinal] = event.target.value;
            const objCopy = {
                ...props.historizedObjects[props.selectedHistorizedOrdinal],
                labelArray: newLabels
            }
            props.changeObjectInHistorizedObjects(objCopy, props.selectedHistorizedOrdinal);
        }
    }

    /**
     * Renders a list of text-fields for setting the custom labels.
     * @param ordinal Number of the item/text-field  to be displayed
     * Differentiates between such with arrayObject as value and such with historizedObject as value.
     * The code is duplicated for better readability and maintainability for possible changes.
     */
    const renderLabelInput = (ordinal: number) => {
        if (props.arrayObjects !== undefined && props.selectedArrayOrdinal !== undefined) {
            return (
                <ListItem key={"Wert_" + (ordinal + 1)} divider={true}>
                    <FormControlLabel
                        className={Array.isArray(props.arrayObjects[props.selectedArrayOrdinal].listItem.value) ? classes.creatorFormControlLabel : classes.creatorFormControlLabelWide}
                        control={
                            <TextField variant="outlined" margin="normal" label={"Beschriftung Wert " + (ordinal + 1)}
                                       value={props.arrayObjects[props.selectedArrayOrdinal].labelArray[ordinal]}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => labelChangeHandler(e, ordinal)}
                                       className={Array.isArray(props.arrayObjects[props.selectedArrayOrdinal].listItem.value) ? classes.inputFieldWithLabel : classes.inputFieldWithLabelWide}
                            />
                        }
                        label={"Wert " + (ordinal + 1) + ":"}
                        labelPlacement="start"
                    />
                </ListItem>
            )
        } else if (props.historizedObjects !== undefined && props.selectedHistorizedOrdinal !== undefined) {
            return (
                <ListItem key={"Wert_" + (ordinal + 1)} divider={true}>
                    <FormControlLabel
                        className={classes.creatorFormControlLabel}
                        control={
                            <TextField variant="outlined" margin="normal" label={"Beschriftung Wert " + (ordinal + 1)}
                                       value={props.historizedObjects[props.selectedHistorizedOrdinal].labelArray[ordinal]}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => labelChangeHandler(e, ordinal)}
                                       className={classes.inputFieldWithLabel}
                            />
                        }
                        label={"Wert " + (ordinal + 1) + ":"}
                        labelPlacement="start"
                    />
                </ListItem>
            )
        }
    }


    return (
        <Grid item xs={12}>
            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
                <List disablePadding={true}>
                    {Array.from(Array(props.amount).keys()).map((ordinal) => renderLabelInput(ordinal))}
                </List>
            </Box>
        </Grid>
    )
};
