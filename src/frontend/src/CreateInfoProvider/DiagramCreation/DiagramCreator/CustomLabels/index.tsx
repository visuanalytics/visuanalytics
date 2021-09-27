import React from "react";
import { useStyles } from "../../style";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import { FormControlLabel } from "@material-ui/core";

interface CustomLabelsProps {
  amount: number;
  labelArray: Array<string>;
  setLabelArray: (labels: Array<string>) => void;
}

/**
 * Component that generates the input fields for custom labels in diagram creation.
 * Used by diagram creation with arrays and diagram creation with historized data.
 */
export const CustomLabels: React.FC<CustomLabelsProps> = (props) => {
  const classes = useStyles();

  /**
   * Event handler for changing one of the input fields.
   * @param event The event caused by the change, holding the new value.
   * @param ordinal The ordinal of the element whose value was changed.
   */
  const labelChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    ordinal: number
  ) => {
    const arCopy = props.labelArray.slice();
    arCopy[ordinal] = event.target.value;
    props.setLabelArray(arCopy);
  };

  /**
   * Renders a list of text-fields for setting the custom labels.
   * @param ordinal Number of the item/text-field  to be displayed
   * Differentiates between such with arrayObject as value and such with historizedObject as value.
   * The code is duplicated for better readability and maintainability for possible changes.
   */
  const renderLabelInput = (ordinal: number) => {
    return (
      <ListItem key={"Wert_" + (ordinal + 1)} divider={true}>
        <FormControlLabel
          className={classes.creatorFormControlLabel}
          control={
            <TextField
              variant="outlined"
              margin="normal"
              label={"Beschriftung Wert " + (ordinal + 1)}
              value={props.labelArray[ordinal]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                labelChangeHandler(e, ordinal)
              }
              className={classes.inputFieldWithLabel}
            />
          }
          label={"Wert " + (ordinal + 1) + ":"}
          labelPlacement="start"
        />
      </ListItem>
    );
  };

  return (
    <Grid item xs={12}>
      <Box
        borderColor="primary.main"
        border={4}
        borderRadius={5}
        className={classes.choiceListFrame}
      >
        <List disablePadding={true}>
          {Array.from(Array(props.amount).keys()).map((ordinal) =>
            renderLabelInput(ordinal)
          )}
        </List>
      </Box>
    </Grid>
  );
};
