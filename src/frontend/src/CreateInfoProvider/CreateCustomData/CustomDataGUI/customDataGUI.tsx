import {CreateCustomData} from "../index";
import React from "react";
import {Box, Button, Grid, TextareaAutosize, TextField} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import {StrArg} from "./StringRep/StrArg";
import Checkbox from "@material-ui/core/Checkbox";
import {RemoveRedEye} from "@material-ui/icons";
import {useStyles} from "../../DataSelection/style";

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
                        <Button variant={"outlined"} size={"small"} disabled={props.dataFlag}
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
                <div>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('+')}>
                        +
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('-')}>
                        -
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('*')}>
                        *
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('/')}>
                        /
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.opFlag}
                            onClick={() => props.handleOperatorButtons('%')}>
                        %
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={true}
                            onClick={() => props.handleLeftBracket('(')}>
                        (
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={true}
                            onClick={() => props.handleRightBracket(')')}>
                        )
                    </Button>
                </div>
            </React.Fragment>
        )
    };

    const makeNumberButtons = () => {
        return (
            <React.Fragment>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                            onClick={() => props.handleNumberButton('9')}>
                        9
                    </Button>
                </div>
            </React.Fragment>
        )
    };

    return (
        <React.Fragment>
            <Grid item container xs={12} justify="space-between" className={classes.elementMargin}>
                <Grid>
                    <div>
                        <Grid item xs={12}>
                            <Grid>
                                <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"}
                                           required={true} onChange={event => (setText(event.target.value))}>
                                    {'Name'}
                                </TextField>
                                <Box borderColor="primary.main" border={4} borderRadius={5}
                                     className={classes.listFrame}>
                                    {props.input}
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid>
                            {makeCalculateButtons()}
                        </Grid>
                        <br/>
                        <Grid>
                            {makeNumberButtons()}
                        </Grid>
                        <br/>
                        <Grid item container xs={12} justify="space-between" className={classes.elementMargin}>
                            <Grid>
                                <Button variant={"contained"} size={"medium"} color={"secondary"}
                                        onClick={() => props.handleDelete()}>
                                    Löschen
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant={"contained"} size={"medium"} color={"secondary"}
                                        onClick={() => props.handleSafe(text)}>
                                    Speichern!
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid>
                    <List>
                        {Array.from(props.customData).sort((a, b) => a.localeCompare(b)).map(renderListItem)}
                    </List>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
