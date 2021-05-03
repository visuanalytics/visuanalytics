import {CreateCustomData} from "../index";
import React from "react";
import {Box, Button, Grid, TextareaAutosize, TextField, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import {StrArg} from "./StringRep/StrArg";
import Checkbox from "@material-ui/core/Checkbox";
import {RemoveRedEye} from "@material-ui/icons";
import {useStyles} from "../../style";

interface CustomDataGUIProps {
    customData: Set<string>;
    input: string;
    handleOperatorButtons: (operator: string) => void;
    handleDataButtons: (data: string) => void;
    handleNumberButton: (number: string) => void;
    handleRightBracket: (bracket: string) => void;
    handleLeftBracket: (bracket: string) => void;
    handleDelete: () => void;
    handleSafe: (formel: string) => void;
    dataFlag: boolean;
    opFlag: boolean;
    numberFlag: boolean;
    rightBracketFlag: boolean;
    leftBracketFlag: boolean;
    canRightBracketBePlaced: boolean;
}

export const CustomDataGUI: React.FC<CustomDataGUIProps> = (props) => {

    const [text, setText] = React.useState<string>('');
    const classes = useStyles();

    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                <FormControlLabel
                    control={
                        <Button variant={"outlined"} size={"medium"} disabled={props.dataFlag}
                                onClick={() => props.handleDataButtons(data)}>
                            {data}
                        </Button>
                    }
                    label={''}
                />
            </ListItem>
        );
    };

    const makeCalculateButtons = () => {
        return (
            <React.Fragment>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('+')}>
                        +
                    </Button>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('-')}>
                        -
                    </Button>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('*')}>
                        *
                    </Button>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('/')}>
                        /
                    </Button>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('%')}>
                        %
                    </Button>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.leftBracketFlag}
                            onClick={() => props.handleLeftBracket('(')}>
                        (
                    </Button>
                    <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.canRightBracketBePlaced}
                            onClick={() => props.handleRightBracket(')')}>
                        )
                    </Button>
                </Grid>
            </React.Fragment>
        )
    };

    const makeNumberButtons = () => {
        return (
            <React.Fragment>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('0')}>
                        0
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('1')}>
                        1
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('2')}>
                        2
                    </Button>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('3')}>
                        3
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('4')}>
                        4
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('5')}>
                        5
                    </Button>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('6')}>
                        6
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('7')}>
                        7
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('8')}>
                        8
                    </Button>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('9')}>
                        9
                    </Button>
                </Grid>
            </React.Fragment>
        )
    };

    const nameField = () => {
        return(
            <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"}
                       required={true} onChange={event => (setText(event.target.value))}>
                {'Name'}
            </TextField>
        );
    }

    return (
        <React.Fragment>
            <Grid xs={6}>
                {nameField()}
            </Grid>
            <Grid xs={6}>
                <Typography variant={"h5"} align={"center"}>
                    <br/>
                    Ihre Api-Daten:
                </Typography>
            </Grid>
            <Grid xs={6}>
                <Box borderColor="primary.main" border={4} borderRadius={5}
                     className={classes.listFrame}>
                    {props.input}
                </Box>
            </Grid>
            <Grid xs={6}>
                <Box borderColor="primary.main"
                     border={4}
                     borderRadius={5}
                     className={classes.listFrame}>
                    <List>
                        {Array.from(props.customData).sort((a, b) => a.localeCompare(b)).map(renderListItem)}
                    </List>
                </Box>
            </Grid>
            <Grid xs={12} justify={"center"}>
                {makeCalculateButtons()}
            </Grid>
            <Grid xs={12}>
                {makeNumberButtons()}
            </Grid>
            <Grid item container xs={12} justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid>
                    <Button variant={"contained"} size={"medium"} color={"secondary"}
                            onClick={() => props.handleDelete()}>
                        Löschen
                    </Button>
                </Grid>
                <Grid>
                    <Button variant={"contained"} size={"medium"} color={"secondary"}
                            onClick={() => props.handleSafe(text)}>
                        Speichern
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
