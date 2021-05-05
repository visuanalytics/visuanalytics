import React from "react";
import {Box, Button, Grid, TextareaAutosize, TextField, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import {StrArg} from "./StringRep/StrArg";
import Checkbox from "@material-ui/core/Checkbox";
import {RemoveRedEye} from "@material-ui/icons";
import {useStyles} from "../../style";
import {SelectedDataItem} from "../../index";

interface CustomDataGUIProps {
    selectedData: Array<SelectedDataItem>;
    customData: Array<string>;
    input: string;
    handleOperatorButtons: (operator: string) => void;
    handleDataButtons: (data: string) => void;
    handleNumberButton: (number: string) => void;
    handleRightParen: (paren: string) => void;
    handleLeftParen: (paren: string) => void;
    handleDelete: () => void;
    handleSave: (formel: string) => void;
    dataFlag: boolean;
    opFlag: boolean;
    numberFlag: boolean;
    rightParenFlag: boolean;
    leftParenFlag: boolean;
    leftParenCount: number;
    rightParenCount: number;
}

export const CustomDataGUI: React.FC<CustomDataGUIProps> = (props) => {

    /**
     * safes and represents the name-field for a new formel.
     */
    const [text, setText] = React.useState<string>('');

    const classes = useStyles();

    /**
     * Renders the dataButtons. All content from selectedData and customData is shown.
     * @param data the name of the data-value
     */
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

    /**
     * creates the operatorButtons and the right and left parenButtons
     */
    const makeCalculateButtons = () => {
        return (
            <Grid container>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('+')}>
                            +
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('-')}>
                            -
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('*')}>
                            *
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('/')}>
                            /
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"secondary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('%')}>
                            %
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button disabled={props.leftParenFlag}
                                onClick={() => props.handleLeftParen('(')}
                                variant={"contained"}
                                size={"large"} color={"secondary"}
                        >
                            (
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button disabled={(props.rightParenCount >= props.leftParenCount) || props.rightParenFlag}
                                variant={"contained"} size={"large"}
                                color={"secondary"}
                                onClick={() => props.handleRightParen(')')}>
                            )
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    /**
     * creates the numberButtons
     */
    const makeNumberButtons = () => {
        return (
            <Grid container>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('0')}>
                            0
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('1')}>
                            1
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('2')}>
                            2
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('3')}>
                            3
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('4')}>
                            4
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('5')}>
                            5
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('6')}>
                            6
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('7')}>
                            7
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('8')}>
                            8
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"medium"} color={"secondary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('9')} className={classes.blockableButtonSecondary}>
                            9
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={6}>
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"}
                               required={true} onChange={event => (setText(event.target.value))}>
                        {'Name'}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant={"h5"} align={"center"}>
                        <br/>
                        Ihre Api-Daten:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Box borderColor="primary.main" border={4} borderRadius={5}
                         className={classes.listFrame}>
                        {props.input}
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box borderColor="primary.main"
                         border={4}
                         borderRadius={5}
                         className={classes.listFrame}>
                        <List>
                            {props.customData.slice().sort((a, b) => a.localeCompare(b)).map(renderListItem)}
                            {props.selectedData.slice().sort((a, b) => a.key.localeCompare(b.key)).map((item) => renderListItem(item.key))}
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {makeCalculateButtons()}
                </Grid>
                <Grid item xs={12}>
                    {makeNumberButtons()}
                </Grid>
                <Grid item container xs={12} justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant={"contained"} size={"medium"} color={"secondary"}
                                onClick={() => props.handleDelete()}>
                            Löschen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"medium"} color={"secondary"}
                                onClick={() => props.handleSave(text)}>
                            Speichern
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
