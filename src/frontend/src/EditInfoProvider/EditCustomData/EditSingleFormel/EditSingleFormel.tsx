import React from "react";
import {StrArg} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {useStyles} from "../../style";
import {hintContents} from "../../../util/hintContents";
import {StepFrame} from "../../../CreateInfoProvider/StepFrame";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {FormelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {EditSingleFormelGUI} from "./EditSingleFormelGUI";
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {calculationToString} from "../../helpermethods";
import {formelContext} from "../../types";
import {DataSource} from "../../../CreateInfoProvider/types";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {checkFindOnlyNumbers} from "../../../CreateInfoProvider/helpermethods";

interface EditSingleFormelProps {
    continueHandler: (index: number) => void;
    backHandler: (index: number) => void;
    editInfoProvider: () => void;
    infoProvDataSources: Array<DataSource>;
    selectedDataSource: number;
    reportError: (message: string) => void;
    formel: formelContext;
}

/**
 * Defines the type that is expected for the backends answer to our request
 */
type requestBackendAnswer = {
    accepted: boolean
    //error: string
}

export const EditSingleFormel: React.FC<EditSingleFormelProps> = (props) => {

    const classes = useStyles();

    /**
     * Input is the created formula as a string. It is build with the Buttons.
     */
    const [input, setInput] = React.useState<string>(calculationToString(props.formel.formelAsObjects));

    /**
     * safes and represents the name-field for a new formel.
     */
    const [name, setName] = React.useState<string>(props.formel.formelName);

    /**
     * holds the old formelName if the actual name is edited.
     */
    const [oldFormelName] = React.useState<string>(props.formel.formelName)

    /**
     * An Array filled with StrArg-Objects that represents the formula.
     */
    const [dataAsObj, setDataAsObj] = React.useState<Array<StrArg>>(props.formel.formelAsObjects);

    /**
     * dataFlag represents the status of dataButtons. If it ist true the dataButtons will be disabled.
     */
    const [dataFlag, setDataFlag] = React.useState<boolean>(props.formel.dataFlag);
    /**
     * opFlag represents the status of OperatorButtons. If it ist true the OperatorButtons will be disabled.
     */
    const [opFlag, setOpFlag] = React.useState<boolean>(props.formel.opFlag);
    /**
     * numberFlag represents the status of NumberButtons. If it ist true the NumberButtons will be disabled.
     */
    const [numberFlag, setNumberFlag] = React.useState<boolean>(props.formel.numberFlag);
    /**
     * rightParenFlag represents the status of rightParenButton. If it ist true the rightParenButton will be disabled.
     */
    const [rightParenFlag, setRightParenFlag] = React.useState<boolean>(props.formel.rightParenFlag);
    /**
     * leftParenFlag represents the status of leftParenButton. If it ist true the leftParenButton will be disabled.
     */
    const [leftParenFlag, setLeftParenFlag] = React.useState<boolean>(props.formel.leftParenFlag);

    /**
     * Counts how many left parentheses are included in the formula.
     * Is used to check if the number of right and left parens is even.
     */
    const [leftParenCount, setLeftParenCount] = React.useState<number>(props.formel.parenCount);
    /**
     * Counts how many right parentheses are included in the formula.
     * Is used to check if the number of right and left parens is even.
     */
    const [rightParenCount, setRightParenCount] = React.useState<number>(props.formel.parenCount);

    /**
     * boolean that is used to open and close the cancel-dialog
     */
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

    /**
     * Handler for operatorButtons.
     * The flags and the input are updated.
     * @param operator => +, -, *, /, %
     */
    const handleOperatorButtons = (operator: string) => {
        setOpFlag(true);
        setDataFlag(false)
        setNumberFlag(false);
        setRightParenFlag(true);
        setLeftParenFlag(false);

        dataAsObj.push(new StrArg(operator, true, false, false, false));
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Handler for dataButtons.
     * The flags and the input are updated.
     * @param data => the content of selectedData from the data-selection-step
     */
    const handleDataButtons = (data: string) => {
        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightParenFlag(false);
        setLeftParenFlag(true);

        dataAsObj.push(new StrArg(data, false, false, false, false));
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Handler for numberButtons.
     * The flags and the input are updated.
     * @param number => 0,1,2,3,4,5,6,7,8,9
     */
    const handleNumberButtons = (number: string) => {
        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(false);
        setRightParenFlag(false);
        setLeftParenFlag(true);

        dataAsObj.push(new StrArg(number, false, false, false, true));
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Handler for the leftParenButton. Adds 1 to the leftParenCounter and pushes an Object with ( in dataAsObj.
     * The flags an the input is updated.
     * @param paren => (
     */
    const handleLeftParen = (paren: string) => {
        setLeftParenCount(leftParenCount + 1);

        setOpFlag(true);
        setDataFlag(false);
        setNumberFlag(false);
        setRightParenFlag(true);
        setLeftParenFlag(false);

        dataAsObj.push(new StrArg(paren, false, false, true, false));
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Handler for the rightParenButton. Adds 1 to the rightParenCounter and pushes an Object with ) in dataAsObj.
     * The flags an the input is updated.
     * @param paren => )
     */
    const handleRightParen = (paren: string) => {
        setRightParenCount(rightParenCount + 1);

        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightParenFlag(false);
        setLeftParenFlag(true);

        dataAsObj.push(new StrArg(paren, false, true, false, false));
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Handler for the Delete-Button. There is a different procedure depending on the StrArg-Object that has to be deleted.
     * To achieve that the flags in StrArg will be tested.
     * If dataAsObj holds only on StrArg or ist empty fullDelete() will be called.
     */
    const handleDelete = () => {

        if (dataAsObj.length <= 1) {
            fullDelete()
        } else if (dataAsObj[dataAsObj.length - 1].isOp) {

            if (dataAsObj[dataAsObj.length - 2].isNumber) {
                setOpFlag(false);
                setDataFlag(true)
                setNumberFlag(false);
                setRightParenFlag(false);
                setLeftParenFlag(true);
            } else {
                setOpFlag(false);
                setDataFlag(true)
                setNumberFlag(true);
                setRightParenFlag(false);
                setLeftParenFlag(true);
            }

        } else if (dataAsObj[dataAsObj.length - 1].isRightParen) {

            if (!dataAsObj[dataAsObj.length - 2]) {
                setOpFlag(true);
                setDataFlag(false);
                setNumberFlag(false);
                setRightParenFlag(true);
                setLeftParenFlag(false);
            }
            setRightParenCount(rightParenCount - 1);

        } else if (dataAsObj[dataAsObj.length - 1].isLeftParen) {

            setLeftParenCount(leftParenCount - 1);

        } else if (dataAsObj[dataAsObj.length - 1].isNumber) {

            if (!dataAsObj[dataAsObj.length - 2].isNumber) {
                setOpFlag(true);
                setDataFlag(false);
                setNumberFlag(false);
                setRightParenFlag(true);
                setLeftParenFlag(false);
            }

        } else {
            setOpFlag(true);
            setDataFlag(false);
            setNumberFlag(false);
            setRightParenFlag(true);
            setLeftParenFlag(false);
        }

        dataAsObj.pop();
        setInput(calculationToString(dataAsObj));
    }

    /**
     * Deletes the complete Input and refreshes counter and flags. After this dataAsObj will be empty.
     * Cancels if the Input-Box is empty.
     */
    const fullDelete = () => {
        if (dataAsObj[dataAsObj.length - 1] === undefined) {
            props.reportError('Das Eingabefeld ist leer!');
            return
        }

        setDataAsObj(new Array<StrArg>(0));
        setInput('');

        setRightParenCount(0);
        setLeftParenCount(0);

        setOpFlag(true);
        setDataFlag(false);
        setNumberFlag(false);
        setRightParenFlag(false);
        setLeftParenFlag(false);
    }

    /**
     * Handle for the Save-Button. Cancels if the Name-Field or the Input-Box field is empty. Also checks if the name is already in use.
     * Saves the formel in CustomData and refreshes the Input-Box.
     * @param formel the name of the formel
     */
    const handleSave = (formel: string) => {
        if ((formel.length <= 0) || (input.length <= 0)) {
            props.reportError('Entweder ist kein Name oder keine Formel angegeben!');
            return
        }
        if (checkFindOnlyNumbers(formel)) {
            props.reportError("Fehler: Der Name darf nicht nur aus Nummern bestehen.")
            return;
        }
        if (formel.includes('(') || formel.includes(')')) {
            props.reportError("Fehler: Der Name darf keine Klammern enthalten.")
            return;
        }


        sendTestData();
        //handleSuccess({accepted: true});

    }

    /**
     * The method is called when there was no problem with the communication to the backend.
     * The backend has received the formula-string an answers with true or false depending on the result of the formula-check
     * @param jsonData the json-data send by the backend
     */
    const handleSuccess = (jsonData: any) => {

        const data = jsonData as requestBackendAnswer;

        console.log(data.accepted)

        if ((oldFormelName.length >= 1) && (name !== oldFormelName) && searchForNameDuplicate(name)) {
            props.reportError('Name bereits vergeben!');
            return
        }

        if (data.accepted) {
            const arCopy = props.infoProvDataSources[props.selectedDataSource].customData.slice();

            for (let i: number = 0; i <= arCopy.length - 1; i++) {
                if (arCopy[i].formelName === name || arCopy[i].formelName === oldFormelName) {
                    arCopy.splice(i, 1);
                }
            }

            arCopy.push(new FormelObj(name, input));
            props.infoProvDataSources[props.selectedDataSource].customData = arCopy;
            fullDelete();
            setName('');
            props.backHandler(1);
        } else {
            props.reportError('Fehler: In der Formel liegt ein Fehler vor!');
        }

    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err error to be displayed
     */
    const handleError = (err: Error) => {
        props.reportError("Fehler: Das Backend antwortet nicht! :  (" + err.message + ")");
    }

    /**
     * Method to post the formula-string as json to the backend in order to receive the answer of the syntax-check.
     */
    const sendTestData = useCallFetch("/visuanalytics/testformula", {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: JSON.stringify(
                {
                    formula: input
                }
            )
        }, handleSuccess, handleError
    );

    /**
     * The method receives the new name for an formula and checks if the name is already in use in customData or selectedData
     * @param newName The new name that has to be checked.
     */
    const searchForNameDuplicate = (newName: string): boolean => {
        let foundDuplicate: boolean = false;

        for (let i = 0; i <= props.infoProvDataSources[props.selectedDataSource].customData.length - 1; i++) {
            if (props.infoProvDataSources[props.selectedDataSource].customData[i].formelName === newName) {
                foundDuplicate = true;
            }
        }

        for (let i = 0; i <= props.infoProvDataSources[props.selectedDataSource].selectedData.length - 1; i++) {
            if (props.infoProvDataSources[props.selectedDataSource].selectedData[i].key === newName) {
                foundDuplicate = true;
            }
        }

        return foundDuplicate;
    }

    return (
        <StepFrame
            heading="Formeln"
            hintContent={hintContents.formeln}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <EditSingleFormelGUI
                        selectedData={props.infoProvDataSources[props.selectedDataSource].selectedData}
                        customData={props.infoProvDataSources[props.selectedDataSource].customData}
                        input={input}
                        name={name}
                        setName={(name: string) => setName(name)}
                        handleOperatorButtons={(operator: string) => handleOperatorButtons(operator)}
                        handleDataButtons={(operator: string) => handleDataButtons(operator)}
                        handleNumberButton={(number: string) => handleNumberButtons(number)}
                        handleRightParen={(paren: string) => handleRightParen(paren)}
                        handleLeftParen={(paren: string) => handleLeftParen(paren)}
                        handleDelete={() => handleDelete()}
                        fullDelete={() => fullDelete()}
                        handleSave={(formel: string) => handleSave(formel)}
                        dataFlag={dataFlag}
                        opFlag={opFlag}
                        numberFlag={numberFlag}
                        rightParenFlag={rightParenFlag}
                        leftParenFlag={leftParenFlag}
                        leftParenCount={leftParenCount}
                        rightParenCount={rightParenCount}
                        oldFormelName={oldFormelName}
                    />
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary"
                                onClick={() => setCancelDialogOpen(true)}>
                            abbrechen
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                disabled={!(rightParenCount >= leftParenCount) || opFlag}
                                onClick={() => handleSave(name)}>
                            Speichern
                        </Button>
                    </Grid>
                </Grid>
                <Dialog onClose={() => setCancelDialogOpen(false)} aria-labelledby="deleteDialog-title"
                        open={cancelDialogOpen}>
                    <DialogTitle id="deleteDialog-title">
                        Wollen Sie wirklich abbrechen?
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            Ihre Änderungen gehen verloren!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Button variant="contained" color={"primary"}
                                        onClick={() => {
                                            setCancelDialogOpen(false);
                                        }}>
                                    zurück
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained"
                                        onClick={() => props.backHandler(1)}
                                        className={classes.delete}>
                                    abbrechen
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Grid>
        </StepFrame>
    );

}
