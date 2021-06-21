import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import {FormelList} from "./FormelList";
import {FormelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {StrArg} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {formelContext} from "../types";
import {checkFindOnlyNumbers, checkOperator} from "../helpermethods";
import {DataSource, Diagram} from "../../CreateInfoProvider/types";

interface EditCustomDataProps {
    continueHandler: (index: number) => void;
    backHandler: (index: number) => void;
    editInfoProvider: () => void;
    infoProvDataSources: Array<DataSource>;
    setInfoProvDataSources: (dataSources: Array<DataSource>) => void;
    selectedDataSource: number;
    checkForHistorizedData: () => void;
    setFormelInformation: (formel: formelContext) => void;
    infoProvName: string;
    infoProvDiagrams: Array<Diagram>
    setInfoProvDiagrams: (diagrams: Array<Diagram>) => void;
}

export const EditCustomData: React.FC<EditCustomDataProps> = (props) => {

    const classes = useStyles();

    /**
     * boolean that is used to open and close the remove-dialog
     */
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

    /**
     * the formel-name from the formel that should be deleted
     */
    const [currentDeleteName, setCurrentDeleteName] = React.useState("");

    //array of all historizedData without the formula that is about to be deleted
    const [newHistorizedData, setNewHistorizedData] = React.useState<Array<string>>([]);

    //names of all diagrams that depend on the formula to remove
    const [diagramsToRemove, setDiagramsToRemove] = React.useState<Array<string>>([]);

    /**
     * boolean that is used to open and close the edit-dialog
     */
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

    /**
     * the formel.name from the formel that should be edited
     */
    const [currentEditFormel, setCurrentEditFormel] = React.useState(new FormelObj("", ""));



    //extract constants from the current dataSource to make accesses easier
    const apiName = props.infoProvDataSources[props.selectedDataSource].apiName;
    const customData = props.infoProvDataSources[props.selectedDataSource].customData;
    const historizedData = props.infoProvDataSources[props.selectedDataSource].historizedData;

    /**
     * The method prepares deleting the chosen formula.
     * It checks if historized data and diagrams need to be removed with the formula.
     * If it only accounts historizedData, deletion is directly, if diagrams need to be removed, the user is
     * asked for confirmation.
     * @param formelName is the name of the formula that has to be deleted.
     */
    const deleteCustomDataCheck = (formelName: string) => {
        //TODO: documentation
        //create a copy of historizedData without the formula (if it is contained in it)
        const newHistorizedData = historizedData.filter((item) => {
            return item!==formelName;
        })
        //when the formula is historized, we have to delete it in the state and check if it was used in diagrams
        const diagramsToRemove: Array<string> = [];
        if(newHistorizedData.length < historizedData.length) {
            //check for diagrams
            props.infoProvDiagrams.forEach((diagram) => {
                if (diagram.sourceType === "Historized" && diagram.historizedObjects !== undefined) {
                    for (let index = 0; index < diagram.historizedObjects.length; index++) {
                        const historized = diagram.historizedObjects[index];
                        //the dataSource name needs to be added in front of the formula name since historizedObjects has dataSource name in it paths too
                        if (apiName + "|" + formelName === historized.name) {
                            diagramsToRemove.push(diagram.name);
                            break;
                        }
                    }
                }
            })
        }
        if(diagramsToRemove.length!==0) {
            //if diagrams have to be removed, ask the user for confirmation before deleting it
            setDiagramsToRemove(diagramsToRemove);
            setNewHistorizedData(newHistorizedData);
            setCurrentDeleteName(formelName);
            setRemoveDialogOpen(true);
        } else {
            //when no diagrams have to be removed we can proceed without asking the user
            deleteCustomData(formelName, newHistorizedData, diagramsToRemove);
        }
    }


    const deleteCustomData = (formelName: string, newHistorizedData: Array<string>, diagramsToRemove: Array<string>) => {
        //delete the data from the customData-Array
        for (let i: number = 0; i <= customData.length - 1; i++) {
            if (customData[i].formelName === formelName) {
                const arCopy = customData.slice();
                arCopy.splice(i, 1);
                const dataSourcesCopy = props.infoProvDataSources.slice();
                dataSourcesCopy[props.selectedDataSource].customData = arCopy;
                props.setInfoProvDataSources(dataSourcesCopy);
                break;
            }
        }
        //delete it from historizedData if necessary
        const dataSourcesCopy = props.infoProvDataSources.slice();
        dataSourcesCopy[props.selectedDataSource].historizedData = newHistorizedData;
        props.setInfoProvDataSources(dataSourcesCopy);
        //delete diagrams depending on it if they exist
        if(diagramsToRemove.length > 0) {
            props.setInfoProvDiagrams(props.infoProvDiagrams.filter((diagram) => {
                return !diagramsToRemove.includes(diagram.name);
            }))
        }
    }


    /**
     * This method receives the backend-representation from a formula and will convert this information into an formelContext-object.
     * @param formelName The name from the formula.
     * @param formelString The actual formula as string.
     */
    const makeFormelContext = (formelName: string, formelString: string): formelContext => {

        //"empty" formelContext-object
        //all parameters will be set in this method
        let finalFormel: formelContext = {
            formelName: "",
            parenCount: 0,
            formelAsObjects: new Array<StrArg>(),
            dataFlag: false,
            numberFlag: false,
            opFlag: true,
            leftParenFlag: false,
            rightParenFlag: false
        };

        finalFormel.formelName = formelName;

        let formelAsObj = new Array<StrArg>();

        //Bsp: "25 * formel1_2 / (3 * (Array2|Data0 - 5))"

        //split the string at each blank and create an array with every single word
        let formelWithoutBlank = formelString.split(" ");
        //-> "25" | "formel1_2" | "/" | "(3" | "*" | "(Array2|Data0" | "-" | "5))"

        //-> for each word in here ->
        formelWithoutBlank.forEach((item) => {

            let notPushed: boolean = true;

            //while there are "(" in the item-string
            while (item.includes('(')) {
                formelAsObj.push(new StrArg('(', false, false, true, false))
                item = item.replace('(', '');
                finalFormel.parenCount += 1;
            }

            let countClosingParens = 0;

            //while there are ")" in the item-string
            while (item.includes(')')) {
                countClosingParens += 1;
                item = item.replace(')', '');
            }

            //if the item-string is an operator
            if (checkOperator(item)) {
                //if this fails the an operator-character has to be ignored because it is part of the formel-name
                if (item.length <= 1) {
                    formelAsObj.push(new StrArg(item, true, false, false, false))
                    notPushed = false;
                }
            }

            //if the item string consists only of numbers
            if (checkFindOnlyNumbers(item)) {
                formelAsObj.push(new StrArg(item, false, false, false, true))
                notPushed = false;
            }

            //if there wasn't pushed an StrArg-object into formelAsObj until now
            if (notPushed) {
                formelAsObj.push(new StrArg(item, false, false, false, false));
            }

            //for each counted closing-parens push one StrArg with ")" into formelAsObj
            for (let i = 1; i <= countClosingParens; i++) {
                formelAsObj.push(new StrArg(')', false, true, false, false));
            }

        });

        //assign the created formelAsObj-array
        finalFormel.formelAsObjects = formelAsObj;

        //assign the correct flags
        setRightFlags(finalFormel);

        //return finalFormel
        return finalFormel;
    }

    /**
     * Receives a formelContext-object an sets the deciding flags for the EditSingleDataGUI
     * @param formel The formelContext where the flags has to be set
     */
    const setRightFlags = (formel: formelContext) => {

        if (formel.formelAsObjects[formel.formelAsObjects.length - 1].isNumber) {
            formel.opFlag = false;
            formel.dataFlag = true;
            formel.numberFlag = false;
            formel.rightParenFlag = false;
            formel.leftParenFlag = true;
        } else {
            formel.opFlag = false;
            formel.dataFlag = true;
            formel.numberFlag = true;
            formel.rightParenFlag = false;
            formel.leftParenFlag = true;
        }

    }



    /**
     * The method sets the currentEditName and opens the edit-dialog
     * @param formel The name of the formula that should be edited.
     */
    const handleEdit = (formel: FormelObj) => {
        setCurrentEditFormel(formel);
        setEditDialogOpen(true);
    }

    /**
     * This method is called when the user confirms the edit-dialog.
     * formelInformation will be set correctly through makeFormelContext
     */
    const confirmEdit = () => {
        props.setFormelInformation(makeFormelContext(currentEditFormel.formelName, currentEditFormel.formelString));
        setEditDialogOpen(false);
        setCurrentEditFormel(new FormelObj("", ""));
        props.continueHandler(1);
    }

    /**
     * This method is called when the user wants to create a new formula.
     * The formelContext is here set to starting-conditions because there is no need for a correct initialization.
     */
    const handleNewFormel = () => {
        props.setFormelInformation({
            formelName: "",
            parenCount: 0,
            formelAsObjects: new Array<StrArg>(),
            dataFlag: false,
            numberFlag: false,
            opFlag: true,
            leftParenFlag: false,
            rightParenFlag: false
        });
        props.continueHandler(1)
    }

    return (
        <StepFrame heading={"Bearbeiten der Formeln"} hintContent={"Bearbeiten der Formeln!"}>
            <Grid container justify={"space-evenly"}>
                <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={6} borderRadius={5}
                             className={classes.listFrame}>
                            <FormelList
                                customDataEdit={props.infoProvDataSources[props.selectedDataSource].customData}
                                handleEdit={(formel: FormelObj) => handleEdit(formel)}
                                deleteCustomDataCheck={(formelName: string) => deleteCustomDataCheck(formelName)}
                            />
                            <Grid item container xs={12} justify={"center"}>
                                <Button variant={"contained"} color={"primary"} size={"large"}
                                        onClick={() => handleNewFormel()}>
                                    Neue Formel
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify={"space-between"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}
                                    onClick={() => props.backHandler(1)}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color={"secondary"}
                                    onClick={() => props.editInfoProvider()}>
                                Speichern
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="large" color="primary"
                                    onClick={() => props.continueHandler(2)}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog onClose={() => {
                    setRemoveDialogOpen(false);
                    window.setTimeout(() => {
                        setCurrentDeleteName("");
                        setNewHistorizedData([]);
                        setDiagramsToRemove([]);
                    }, 200);
                }} aria-labelledby="deleteDialog-title"
                        open={removeDialogOpen}>
                    <DialogTitle id="deleteDialog-title">
                        Löschen von {currentDeleteName} bestätigen
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Das Löschen der Formel {currentDeleteName} wird folgende Diagramme entfernen, da sie die Formel nutzen:  {diagramsToRemove.join(", ")}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => {
                                            setRemoveDialogOpen(false);
                                            window.setTimeout(() => {
                                                setCurrentDeleteName("");
                                                setNewHistorizedData([]);
                                                setDiagramsToRemove([]);
                                            }, 200);
                                        }}>
                                    abbrechen
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => {
                                            deleteCustomData(currentDeleteName, newHistorizedData, diagramsToRemove);
                                            setRemoveDialogOpen(false);
                                            window.setTimeout(() => {
                                                setCurrentDeleteName("");
                                                setNewHistorizedData([]);
                                                setDiagramsToRemove([]);
                                            }, 200);
                                        }}
                                        className={classes.redDeleteButton}>
                                    Löschen bestätigen
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={() => {
                    setEditDialogOpen(false);
                    window.setTimeout(() => {
                        setCurrentEditFormel(new FormelObj("", ""));
                    }, 200);
                }} aria-labelledby="editDialog-title"
                        open={editDialogOpen}>
                    <DialogTitle id="deleteDialog-title">
                        Wollen Sie die Formel "{currentEditFormel.formelName}" bearbeiten?
                    </DialogTitle>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => {
                                            setEditDialogOpen(false);
                                            window.setTimeout(() => {
                                                setCurrentEditFormel(new FormelObj("", ""));
                                            }, 200);
                                        }}
                                        className={classes.delete}
                                >
                                    zurück
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color={"secondary"}
                                        onClick={() => confirmEdit()}
                                >
                                    bearbeiten
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Grid>
        </StepFrame>
    );
}
