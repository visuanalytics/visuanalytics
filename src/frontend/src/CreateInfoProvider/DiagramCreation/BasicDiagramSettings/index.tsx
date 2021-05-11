import React from "react";
import { useStyles } from "../style";
import Grid from "@material-ui/core/Grid";
import {ListItemRepresentation, diagramType} from "../../index";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import {InsertEmoticon, BugReport, Face, LinkedCamera, MailOutline} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {Alert} from "@material-ui/lab";

interface BasicDiagramSettingsProps {
    currentArray: ListItemRepresentation;
    diagramType: diagramType;
    setDiagramType: (type: diagramType) => void;
    amount: number;
    setAmount: (amount: number) => void;
}

//TODO: no warning display for historized option

/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const BasicDiagramSettings: React.FC<BasicDiagramSettingsProps> = (props) => {
    const classes = useStyles();

    /**
     * Returns the diagram for the currently selected type be be displayed
     */
    const diagramIconSelector = () => {
        switch(props.diagramType) {
            case "verticalBarChart": {
                return ( <InsertEmoticon style={{ fontSize: 60 }}/>)
            }
            case "horizontalBarChart": {
                return ( <BugReport style={{ fontSize: 60 }}/>)
            }
            case "pieChart": {
                return ( <Face style={{ fontSize: 60 }}/>)
            }
            case "dotDiagram": {
                return ( <LinkedCamera style={{ fontSize: 60 }}/>)
            }
            case "lineChart": {
                return ( <MailOutline style={{ fontSize: 60 }}/>)
            }
        }
    }

    /**
     * Handler method for changing the selected diagram type.
     * @param e The event that was caused by the change.
     */
    const diagramTypeChangeHandler = (e: React.ChangeEvent<{value: unknown}>) => {
        props.setDiagramType(e.target.value as diagramType);
    }

    //TODO: possibly find better solution: backspace is not able to remove whole selection making it impossible to manually type a single digit without leading zero
    /**
     * Handler method for changing the selected amount.
     * @param e The event that was caused by the change.
     * Checks if the input is higher than 1 since the attributes alone cant prevent illegal keyboard inputs.
     */
    const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(Number(e.target.value)>=1) props.setAmount(Number(e.target.value))
    }

    return(
        <React.Fragment>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie aus den zu erstellenden Diagrammtyp:
                </Typography>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item xs={7}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="diagramType">Diagrammtyp</InputLabel>
                        <Select
                            labelId="diagramType"
                            id="diagramTypeSelect"
                            value={props.diagramType}
                            onChange={diagramTypeChangeHandler}
                            label="Diagrammtyp"
                        >
                            <MenuItem value={"verticalBarChart"}>Säulendiagramm</MenuItem>
                            <MenuItem value={"horizontalBarChart"}>Balkendiagramm</MenuItem>
                            <MenuItem value={"pieChart"}>Tortendiagramm</MenuItem>
                            <MenuItem value={"dotDiagram"}>Punktdiagramm</MenuItem>
                            <MenuItem value={"lineChart"}>Liniendiagramm</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    {diagramIconSelector()}
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-between">
                <Grid item>
                    <Typography>
                        Anzahl der Elemente:
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <TextField type="number" variant="outlined"  margin="normal" label="Anzahl"  inputProps={{ min: 1}} value={props.amount} onChange={amountHandler}/>
                </Grid>
                <Grid item xs={6}>
                    {props.amount>props.currentArray.arrayLength&&
                    <Alert severity="warning">
                        <strong>Warnung:</strong> Die gewählte Größe überschreitet die Array-Größe bei den Testdaten.
                    </Alert>
                    }
                </Grid>
            </Grid>
        </React.Fragment>
    )
};
