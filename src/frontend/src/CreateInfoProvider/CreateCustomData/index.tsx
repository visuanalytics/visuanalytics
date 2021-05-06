import React from "react";
import {CustomDataGUI} from "./CustomDataGUI/customDataGUI";
import {StrArg} from "./CustomDataGUI/formelObjects/StrArg";
import {useStyles} from "../style";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";
import {SelectedDataItem} from "../index";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {formelObj} from "./CustomDataGUI/formelObjects/formelObj";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {stringify} from "querystring";

interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Array<SelectedDataItem>;
    setSelectedData: (array: Array<SelectedDataItem>) => void;
    customData: Array<formelObj>;
    setCustomData: (array: Array<formelObj>) => void;
    reportError: (message: string) => void;
}

/**
 * Defines the type that is expected for the backends answer to our request
 */
type requestBackendAnswer = {
    status: boolean
    error: string
}

export const CreateCustomData: React.FC<CreateCustomDataProps> = (props) => {

    const classes = useStyles();

    /**
     * Input is the created formula as a string. It is build with the Buttons.
     */
    const [input, setInput] = React.useState<string>('');

    /**
     * safes and represents the name-field for a new formel.
     */
    const [name, setName] = React.useState<string>('');

    /**
     * An Array filled with StrArg-Objects.
     */
    const [dataAsObj, setDataAsObj] = React.useState<Array<StrArg>>(new Array<StrArg>(0));

    /**
     * dataFlag represents the status of dataButtons. If it ist true the dataButtons will be disabled.
     */
    const [dataFlag, setDataFlag] = React.useState<boolean>(false);
    /**
     * opFlag represents the status of OperatorButtons. If it ist true the OperatorButtons will be disabled.
     */
    const [opFlag, setOpFlag] = React.useState<boolean>(true);
    /**
     * numberFlag represents the status of NumberButtons. If it ist true the NumberButtons will be disabled.
     */
    const [numberFlag, setNumberFlag] = React.useState<boolean>(false);
    /**
     * rightParenFlag represents the status of rightParenButton. If it ist true the rightParenButton will be disabled.
     */
    const [rightParenFlag, setRightParenFlag] = React.useState<boolean>(false);
    /**
     * leftParenFlag represents the status of leftParenButton. If it ist true the leftParenButton will be disabled.
     */
    const [leftParenFlag, setLeftParenFlag] = React.useState<boolean>(false);

    /**
     * Counts how many left parentheses are included in the formula.
     * Is used to check if the number of right and left parens is even.
     */
    const [leftParenCount, setLeftParenCount] = React.useState<number>(0);
    /**
     * Counts how many right parentheses are included in the formula.
     * Is used to check if the number of right and left parens is even.
     */
    const [rightParenCount, setRightParenCount] = React.useState<number>(0);

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
     * This method receives an array with string-arguments and creates the output string with makeStringRep()
     * @param calculation the Array that should be transformed
     *
     */
    const calculationToString = (calculation: Array<StrArg>) => {
        let stringToShow: string = '';

        for (let i: number = 0; i < calculation.length; i++) {
            stringToShow = stringToShow + calculation[i].makeStringRep();
        }

        return stringToShow;
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
            setOpFlag(false);
            setDataFlag(true)
            setNumberFlag(true);
            setRightParenFlag(false);
            setLeftParenFlag(true);
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
            alert('Das Eingabefeld ist leer!');
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
            alert('Entweder ist kein Name oder keine Formel angegeben!');
            return
        }
        for (let i: number = 0; i <= props.customData.length - 1; i++) {
            if (props.customData[i].formelName === formel) {
                alert('Variable ist schon vergeben!');
                return;
            }
        }

        //TODO: erst möglich, wenn das backend läuft!
        //sendTestData();

        //nur übergangsweise, zum testen

        const arCopy = props.customData.slice();
        arCopy.push(new formelObj(name, input));
        props.setCustomData(arCopy);
        console.log(props.customData);
        fullDelete();
        setName('');

    }

    /**
     * The method is called when there was no problem with the communication to the backend.
     * The backend has received the formula-string an answers with true or false depending on the result of the formula-check
     * @param jsonData the json-data send by the backend
     */
    const handleSuccess = (jsonData: any) => {

        const data = jsonData as requestBackendAnswer;

        if (data.status) {
            const arCopy = props.customData.slice();
            arCopy.push(new formelObj(name, input));
            props.setCustomData(arCopy);
            console.log(props.customData);
            fullDelete();
            setName('');
        } else {
            props.reportError(data.error);
        }

    }

    /**
     * Handler for errors happening when requesting the backend.
     * Will display an error message and not proceed.
     * @param err error to be displayed
     */
    const handleError = (err: Error) => {
        props.reportError("Fehler: In der Formel liegt ein Fehler vor! :  (" + err.message + ")");
    }

    /**
     * Method to post the formula-string as json to the backend in order to receive the answer of the syntax-check.
     */
    const sendTestData = useCallFetch("/testFormel", {
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

    return (
        <StepFrame
            heading="Formeln"
            hintContent={hintContents.formeln}
        >
            <Grid container justify="space-evenly" className={classes.elementLargeMargin}>
                <Grid item container xs={12}>
                    <CustomDataGUI
                        selectedData={props.selectedData}
                        customData={props.customData}
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
                    />
                </Grid>
                <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"} size={"large"} color={"secondary"}
                                disabled={!(rightParenCount >= leftParenCount)}
                                onClick={() => handleSave(name)}>
                            Speichern
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                            weiter
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );

}
