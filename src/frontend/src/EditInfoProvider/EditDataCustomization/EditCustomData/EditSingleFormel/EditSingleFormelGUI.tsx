import React from "react";
import {useStyles} from "../../../style";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import {FormelObj} from "../../../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {ArrayProcessingData, SelectedDataItem} from "../../../../CreateInfoProvider/types";
import {Collapse, IconButton} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

interface EditSingleFormelGUIProps {
    selectedData: Array<SelectedDataItem>;
    customData: Array<FormelObj>;
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
    oldFormelName: string;
    arrayProcessingsList: Array<ArrayProcessingData>;
}

export const EditSingleFormelGUI: React.FC<EditSingleFormelGUIProps> = (props) => {

    const classes = useStyles();

    const [showCustomData, setShowCustomData] = React.useState(false);
    const [showSelectedData, setShowSelectedData] = React.useState(false);
    const [showArrayProcessings, setShowArrayProcessings] = React.useState(false);

    /**
     * Renders the Buttons for selected-data. All content from selectedData that has 'Zahl' as type is shown.
     * @param data the name of the data-value
     */
    const renderListItemSelectedData = (data: SelectedDataItem) => {

        if (data.type === "Zahl" || data.type === "Gleitkommazahl" || (data.type === "Array" && data.arrayValueType !== undefined && (data.arrayValueType === "Zahl" || data.arrayValueType === "Gleitkommazahl"))) {


            return (
                <ListItem key={data.key}>
                    <Button variant={"contained"} size={"medium"} disabled={props.dataFlag}
                            onClick={() => props.handleDataButtons(data.key)}>
                        <span className={classes.overflowButtonText}>{(data.key + " (" + data.type + ")")}</span>
                    </Button>
                </ListItem>
            );
        }

    };

    /**
     * Renders the Buttons for custom-data. All content from customData is shown with delete-option
     * @param data the name of the data-value
     */
    const renderListItemCustomData = (data: string) => {
        if (data !== props.oldFormelName){

            return (
                <ListItem key={data}>
                    <Button variant={"contained"} size={"medium"} disabled={props.dataFlag}
                            onClick={() => props.handleDataButtons(data)}>
                        <span className={classes.overflowButtonText}>{data + " (Formel)"}</span>
                    </Button>
                </ListItem>
            );
        }

    };

    /**
     * Method that renders a array-processing as a button in the list of data
     * to add to a formula.
     * @param processing The name of the processing
     */
    const renderArrayProcessing = (processing: string) => {
        return (
            <ListItem key={processing}>
                <Button variant={"contained"} size={"medium"} disabled={props.dataFlag}
                        onClick={() => props.handleDataButtons(processing)}>
                    <span className={classes.overflowButtonText}>{processing}</span>
                </Button>
            </ListItem>
        )
    }

    /**
     * Renders the buttons shown in the CustomData-GUI
     */
    const makeButtons = () => {
        return (
            <Grid container>
                <Grid item container xs={12} justify={"space-around"}>
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
                <Grid item container xs={12} justify={"space-around"}>
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
                <Grid item container xs={12} justify={"space-around"}>
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
                <Grid item container xs={12} justify={"space-around"}>
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
                <Grid item container xs={3} justify={"center"}>
                    <Grid item className={classes.blockableButtonSecondary}>
                        <Button variant={"contained"} size={"large"} color={"primary"} disabled={props.numberFlag}
                                onClick={() => props.handleNumberButton('0')}>
                            0
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container xs={9} justify={"space-around"}>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"primary"}
                                className={classes.delete}
                                onClick={() => props.handleDelete()}>
                            Zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"primary"}
                                className={classes.delete}
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
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"} label={"Name"}
                               value={props.name}
                               onChange={event => (props.setName(event.target.value.replace(' ', '_')))}>
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
                         className={classes.tinyListFrame}>
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
                        <Grid item container xs={12}>
                            <Grid item xs={10}>
                                <Typography variant="h6" className={classes.customDataSelectionTitle}>
                                    Formeln
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {!showCustomData &&
                                <IconButton aria-label="Formeln ausklappen" onClick={() => setShowCustomData(!showCustomData)}>
                                    <ExpandMore/>
                                </IconButton>
                                }
                                {showCustomData &&
                                <IconButton aria-label="Formeln einklappen" onClick={() => setShowCustomData(!showCustomData)}>
                                    <ExpandLess/>
                                </IconButton>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={showCustomData}>
                                    <List>
                                        {props.customData.slice().sort((a, b) => a.formelName.localeCompare(b.formelName)).map((name) => renderListItemCustomData(name.formelName))}
                                    </List>
                                </Collapse>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={10}>
                                <Typography variant="h6" className={classes.customDataSelectionTitle}>
                                    API-Daten
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {!showSelectedData &&
                                <IconButton aria-label="Infoprovider-Daten ausklappen" onClick={() => setShowSelectedData(!showSelectedData)}>
                                    <ExpandMore/>
                                </IconButton>
                                }
                                {showSelectedData &&
                                <IconButton aria-label="Infoprovider-Daten einklappen" onClick={() => setShowSelectedData(!showSelectedData)}>
                                    <ExpandLess/>
                                </IconButton>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={showSelectedData}>
                                    <List>
                                        {props.selectedData.slice().sort((a, b) => a.key.localeCompare(b.key)).map((item) => renderListItemSelectedData(item))}
                                    </List>
                                </Collapse>
                            </Grid>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={10}>
                                <Typography variant="h6" className={classes.customDataSelectionTitle}>
                                    Array-Verarbeitungen
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {!showArrayProcessings &&
                                <IconButton aria-label="Array-Verarbeitungen ausklappen" onClick={() => setShowArrayProcessings(!showArrayProcessings)}>
                                    <ExpandMore/>
                                </IconButton>
                                }
                                {showArrayProcessings &&
                                <IconButton aria-label="Array-Verarbeitungen einklappen" onClick={() => setShowArrayProcessings(!showArrayProcessings)}>
                                    <ExpandLess/>
                                </IconButton>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={showArrayProcessings}>
                                    <List>
                                        {props.arrayProcessingsList.map((item) => renderArrayProcessing(item.name))}
                                    </List>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
