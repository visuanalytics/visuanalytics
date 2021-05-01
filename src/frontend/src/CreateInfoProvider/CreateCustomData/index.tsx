import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {strict} from "assert";
import {CustomDataGUI} from "./CustomDataGUI/customDataGUI";
import {StrArg} from "./CustomDataGUI/StringRep/StrArg";


interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const CreateCustomData: React.FC<CreateCustomDataProps>  = (props) => {

    const[customData, setCustomData] = React.useState<Set<string>>(new Set(props.selectedData));
    const[input, setInput] = React.useState<string>('');

    const[dataAsOpj, setDataAsObj] = React.useState<Array<StrArg>>(new Array<StrArg>(0));

    /**
     * dataFlag shows if dataButton was triggered
     */
    const[dataFlag, setDataFlag] = React.useState<boolean>(false);
    /**
     * opFlag shows if operatorButton was triggered
     */
    const[opFlag, setOpFlag] = React.useState<boolean>(true);
    /**
     * NumberFlag shows if NumberButton was triggered
     */
    const[numberFlag, setNumberFlag] = React.useState<boolean>(false);
    const[rightBracketFlag, setRightBracketFlag] = React.useState<boolean>(false);
    const[leftBracketFlag, setLeftBracketFlag] = React.useState<boolean>(false);

    const[numberCount, setNumberCount] = React.useState<number>(0);
    const[bracketCount, setBracketCount] = React.useState<number>(0);
    const[canRightBracketBePlaced, setCanRightBracketBePlaced] = React.useState<boolean>(true);

    const handleOperatorButtons = (operator: string) => {
        dataAsOpj.push(new StrArg(operator, true, false,0));
        setInput(calculationToString(dataAsOpj));

        setNumberCount(0);

        setOpFlag(true);
        setDataFlag(false)
        setNumberFlag(false);
        setRightBracketFlag(false);
        setLeftBracketFlag(false);
    }

    const handleDataButtons = (data: string) => {
        dataAsOpj.push(new StrArg(data, false, false,0));
        setInput(calculationToString(dataAsOpj));

        setNumberCount(0);

        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);
    }

    const handleNumberButtons = (number: string) => {
        setNumberCount(numberCount + 1);

        dataAsOpj.push(new StrArg(number, false, true, numberCount));
        setInput(calculationToString(dataAsOpj));
        console.log('count ' + numberCount)
        console.log('indexfornumbers ' + dataAsOpj[dataAsOpj.length - 1].indexForNumbers)
        console.log('leng ' + dataAsOpj.length)

        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(false);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);
    }

    const handleLeftBracket = (bracket: string) => {
        dataAsOpj.push(new StrArg(bracket, false, false, 0));
        setInput(calculationToString(dataAsOpj));

        setNumberCount(0);
        setBracketCount(bracketCount + 1);
        console.log(bracketCount)
        checkBrackets();

        setOpFlag(true);
        setDataFlag(false);
        setNumberFlag(false);
        setRightBracketFlag(true);
        setLeftBracketFlag(false);
    }

    const handleRightBracket = (bracket: string) => {
        dataAsOpj.push(new StrArg(bracket, false, false, 0));
        setInput(calculationToString(dataAsOpj));

        setNumberCount(0);
        setBracketCount(bracketCount - 1);
        console.log(bracketCount)
        checkBrackets();

        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);
    }

    const calculationToString = (calculation: Array<StrArg>) => {
        let stringToShow: string = '';

        for (let i: number = 0; i < calculation.length; i++) {
            stringToShow = stringToShow + calculation[i].makeStringRep();
        }

        return stringToShow;
    }

    const handleDelete = () => {
        if (dataAsOpj[dataAsOpj.length - 1] === undefined) {
            console.log('leer!');
            return
        }

        let count: number = dataAsOpj[dataAsOpj.length - 1].indexForNumbers;

        if (dataAsOpj[dataAsOpj.length - 1].isNumber) {
            for (let i: number = 0; i <= count; i++) {
                dataAsOpj.pop();
            }
            setNumberCount(0);
        } else if (dataAsOpj[dataAsOpj.length - 1].isOp) {
            setOpFlag(false);
            setDataFlag(false);
            setNumberFlag(false);
            setRightBracketFlag(false);
            setLeftBracketFlag(true);

            dataAsOpj.pop();
        } else {
            dataAsOpj.pop();
        }

        if (opFlag) {
            setOpFlag(false)
        } else {
            setOpFlag(true)
        }
        if (dataFlag) {
            setDataFlag(false)
        } else {
            setDataFlag(true)
        }
        if (rightBracketFlag) {
            setRightBracketFlag(false)
        } else {
            setRightBracketFlag(true)
        }
        if (leftBracketFlag) {
            setLeftBracketFlag(false)
        } else {
            setLeftBracketFlag(true)
        }

        setInput(calculationToString(dataAsOpj));
    }

    const handleSafe = (formel: string) => {
        if (formel.length <= 0) {
            return
        }
        setCustomData(new Set(customData.add(formel)))
    }

    const checkBrackets = () => {
        if (bracketCount === 0) {
            setCanRightBracketBePlaced(true)
        } else {
            setCanRightBracketBePlaced(false);
        }

        console.log(canRightBracketBePlaced);
    }

    return (
        <React.Fragment>
            <div>
                <CustomDataGUI
                    customData={customData}
                    input={input}
                    handleOperatorButtons={(operator: string) => handleOperatorButtons(operator)}
                    handleDataButtons={(operator: string) => handleDataButtons(operator)}
                    handleNumberButton={(number: string) => handleNumberButtons(number)}
                    handleRightBracket={(bracket: string) => handleRightBracket(bracket)}
                    handleLeftBracket={(bracket: string) => handleLeftBracket(bracket)}
                    handleDelete={() => handleDelete()}
                    handleSafe={(formel: string) => handleSafe(formel)}
                    dataFlag={dataFlag}
                    opFlag={opFlag}
                    numberFlag={numberFlag}
                    rightBracketFlag={rightBracketFlag}
                    leftBracketFlag={leftBracketFlag}
                    canRightBracketBePlaced={canRightBracketBePlaced}
                />
            </div>
            <div>
                <Button variant="contained" size="large" onClick={props.backHandler}>
                    zurück
                </Button>
                <Button variant="contained" size="large" onClick={props.continueHandler}>
                    weiter
                </Button>
            </div>
        </React.Fragment>
    );

}
