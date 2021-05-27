import React from "react";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useStyles} from "../style";
import Box from "@material-ui/core/Box";
import {FormelList} from "./FormelList";
import {formelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {DataSource} from "../../CreateInfoProvider";
import {StrArg} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";

interface EditCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    editInfoProvider: () => void;
    infoProvDataSources: Array<DataSource>;
    selectedDataSource: number;
    checkForHistorizedData: () => void;
}

export type formelContext = {
    formelString: string;
    parenCount: number;
    formelAsObjects: Array<StrArg>;
}

export const EditCustomData: React.FC<EditCustomDataProps> = (props) => {

    const classes = useStyles();

    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

    const [currentDeleteFormelName, setCurrentDeleteFormelName] = React.useState("");

    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

    const [currentEditFormel, setCurrentEditFormel] = React.useState(new formelObj("", ""));

    const makeFormelStringToStrArgArray = (formel: string) => {

        let finalFormel: formelContext = {formelString: "", parenCount: 0, formelAsObjects: new Array<StrArg>()};
        finalFormel.formelString = formel;

        let formelAsObj = new Array<StrArg>();

        //Bsp: "25 * formel1_2 / (3 * (Array2|Data0 - 5))"

        //split the string at each blank and create an array with every single word
        let formelWithoutBlank = formel.split(" ");
        //-> "25" | "formel1_2" | "/" | "(3" | "*" | "(Array2|Data0" | "-" | "5))"

        formelWithoutBlank.forEach((item) => {

            let notPushed: boolean = true;

            while (checkLeftParen(item)) {
                formelAsObj.push(new StrArg('(', false, false, true, false))
                item = item.replace('(', '');
                finalFormel.parenCount += 1;
            }

            let countClosingParens = 0;

            while (checkRightParen(item)) {
                countClosingParens += 1;
                item = item.replace(')', '');
            }

            if (checkOperator(item)) {
                if (item.length <= 1) {
                    formelAsObj.push(new StrArg(item, true, false, false, false))
                    notPushed = false;
                }
            }

            if (checkFindOnlyNumbers(item)) {
                //item is a Number
                formelAsObj.push(new StrArg(item, false, false, false, true))
                notPushed = false;
            }

            if (notPushed) {
                formelAsObj.push(new StrArg(item, false, false, false, false));
            }

            for (let i = 1; i <= countClosingParens; i++) {
                formelAsObj.push(new StrArg(')', false, true, false, false));
            }

        });

        finalFormel.formelAsObjects = formelAsObj;

        console.log(finalFormel.formelString + " -> formel!!")
        console.log(finalFormel.parenCount + " parens!!")
        finalFormel.formelAsObjects.forEach((item) => {
            console.log(item.stringRep);
        })
    }

    const checkFindOnlyNumbers = (arg: string): boolean => {

        let onlyNumbers: boolean = true;

        for (let i: number = 0; i <= arg.length - 1; i++) {

            if (arg.charAt(i) !== '0' &&
                arg.charAt(i) !== '1' &&
                arg.charAt(i) !== '2' &&
                arg.charAt(i) !== '3' &&
                arg.charAt(i) !== '4' &&
                arg.charAt(i) !== '5' &&
                arg.charAt(i) !== '6' &&
                arg.charAt(i) !== '7' &&
                arg.charAt(i) !== '8' &&
                arg.charAt(i) !== '9'
            ) {
                onlyNumbers = false;
            }

        }

        return onlyNumbers;
    }

    const checkOperator = (arg: string) => {
        return (
            arg.charAt(0) === '+' ||
            arg.charAt(0) === '-' ||
            arg.charAt(0) === '*' ||
            arg.charAt(0) === '/' ||
            arg.charAt(0) === '%'
        );
    }

    const checkLeftParen = (arg: string) => {

        for (let i: number = 0; i <= arg.length - 1; i++) {

            if (arg.charAt(i) === '(') {
                return true;
            }

        }

        return false;
    }

    const checkRightParen = (arg: string) => {

        for (let i: number = 0; i <= arg.length - 1; i++) {

            if (arg.charAt(i) === ')') {
                return true;
            }

        }

        return false;
    }

    const handleDelete = (name: string) => {
        setCurrentDeleteFormelName(name);
        setRemoveDialogOpen(true);
    }

    const confirmDelete = () => {

        //TODO: maybe implement a better solution for better runtime

        for (let i: number = 0; i <= props.infoProvDataSources[props.selectedDataSource].customData.length - 1; i++) {
            if (props.infoProvDataSources[props.selectedDataSource].customData[i].formelName === currentDeleteFormelName) {
                props.infoProvDataSources[props.selectedDataSource].customData.splice(i, 1);
            }
        }

        for (let i: number = 0; i <= props.infoProvDataSources[props.selectedDataSource].historizedData.length - 1; i++) {
            if (props.infoProvDataSources[props.selectedDataSource].historizedData[i] === currentDeleteFormelName) {
                props.infoProvDataSources[props.selectedDataSource].historizedData.splice(i, 1);
            }
        }

        props.checkForHistorizedData();
        setRemoveDialogOpen(false);
        setCurrentDeleteFormelName("");
    }

    const handleEdit = (formel: formelObj) => {
        setCurrentEditFormel(formel);
        setEditDialogOpen(true);
    }

    const confirmEdit = () => {
        makeFormelStringToStrArgArray(currentEditFormel.formelString);
        setEditDialogOpen(false);
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
                                handleDelete={(name: string) => handleDelete(name)}
                                handleEdit={(formel: formelObj) => handleEdit(formel)}
                            />
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify={"space-between"}>
                        <Grid item>
                            <Button variant={"contained"} size={"large"} color={"primary"}
                                    onClick={props.backHandler}>
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
                                    onClick={props.continueHandler}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog onClose={() => setRemoveDialogOpen(false)} aria-labelledby="deleteDialog-title"
                        open={removeDialogOpen}>
                    <DialogTitle id="deleteDialog-title">
                        Wollen Sie die Formel "{currentDeleteFormelName}" wirklich löschen?
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            "{currentDeleteFormelName}" wird unwiderruflich gelöscht.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained" color={"secondary"}
                                        onClick={() => {
                                            setRemoveDialogOpen(false);
                                            setCurrentDeleteFormelName("");
                                        }}>
                                    zurück
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => confirmDelete()}
                                        className={classes.delete}>
                                    Löschen bestätigen
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={() => setEditDialogOpen(false)} aria-labelledby="editDialog-title"
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
                                            setCurrentEditFormel(new formelObj("", ""));
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
