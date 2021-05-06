import React from "react";
import {useStyles} from "../style";
import {SelectedDataItem} from "../../index";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import {formelObj} from "./formelObjects/formelObj";

interface CustomDataGUIProps {
    selectedData: Array<SelectedDataItem>;
    customData: Array<formelObj>;
    input: string;
    name: string;
    setName: (name: string) => void;
    handleOperatorButtons: (operator: string) => void;
    handleDataButtons: (data: string) => void;
    handleNumberButton: (number: string) => void;
    handleRightParen: (paren: string) => void;
    handleLeftParen: (paren: string) => void;
    handleDelete: () => void;
    fullDelete: () => void;
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
                        <Button variant={"contained"} size={"medium"} disabled={props.dataFlag}
                                onClick={() => props.handleDataButtons(data)}>
                            {data}
                        </Button>
                    }
                    label={''}
                />
            </ListItem>
        );
    };

    const makeButtons = () => {
        return (
            <Grid container>
                <Grid item container xs={12} justify={"space-evenly"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('+')}>
                            +
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('-')}>
                            -
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('*')}>
                            *
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('/')}>
                            /
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <br/>
                </Grid>
                <Grid item container xs={12} justify={"space-evenly"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('7')}>
                            7
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('8')}>
                            8
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('9')}
                                className={classes.blockableButtonSecondary}>
                            9
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.opFlag}
                                onClick={() => props.handleOperatorButtons('%')}>
                            %
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <br/>
                </Grid>
                <Grid item container xs={12} justify={"space-evenly"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('4')}>
                            4
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('5')}>
                            5
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('6')}
                                className={classes.blockableButtonSecondary}>
                            6
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button disabled={props.leftParenFlag}
                                onClick={() => props.handleLeftParen('(')}
                                variant={"contained"}
                                size={"large"} color={"primary"}
                        >
                            (
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <br/>
                </Grid>
                <Grid item container xs={12} justify={"space-evenly"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('1')}>
                            1
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('2')}>
                            2
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('3')}
                                className={classes.blockableButtonSecondary}>
                            3
                        </Button>
                    </Grid>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button disabled={(props.rightParenCount >= props.leftParenCount) || props.rightParenFlag}
                                variant={"contained"} size={"large"}
                                color={"primary"}
                                onClick={() => props.handleRightParen(')')}>
                            )
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <br/>
                </Grid>
                <Grid item container xs={12} justify={"space-around"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('0')}>
                            0
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"small"} color={"secondary"} className={classes.blockableButtonPrimary}
                                onClick={() => props.handleDelete()}>
                            Zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"small"} color={"secondary"} className={classes.blockableButtonPrimary}
                                onClick={() => props.fullDelete()}>
                            Löschen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={6}>
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"} label={"Name"} value={props.name}
                               onChange={event => (props.setName(event.target.value))}>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant={"h5"} align={"center"} className={classes.header}>
                        <br/>
                        Ihre Api-Daten:
                    </Typography>
                </Grid>
                <Grid container item xs={6} justify={"flex-start"}>
                    <Box borderColor="primary.main" border={4} borderRadius={5}
                         className={classes.listFrame}>
                        {props.input}
                    </Box>
                    <Grid item xs={12}>
                        {makeButtons()}
                    </Grid>
                </Grid>
                <Grid item container xs={6} justify={"flex-end"}>
                    <Box borderColor="primary.main"
                         border={4}
                         borderRadius={5}
                         className={classes.listFrameData}>
                        <List>
                            {props.customData.slice().sort((a, b) => a.formelName.localeCompare(b.formelName)).map((name) => renderListItem(name.formelName))}
                            {props.selectedData.slice().sort((a, b) => a.key.localeCompare(b.key)).map((item) => renderListItem(item.key))}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
