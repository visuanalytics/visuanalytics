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

    const handleOperatorButtons = (operator: string) => {
        dataAsOpj.push(new StrArg(operator, true));
        setInput(calculationToString(dataAsOpj));
        setOpFlag(true);
        setDataFlag(false)
        setNumberFlag(false);
    }

    const handleDataButtons = (data: string) => {
        dataAsOpj.push(new StrArg(data, false));
        setInput(calculationToString(dataAsOpj));
        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
    }

    const handleNumberButtons = (number: string) => {
        dataAsOpj.push(new StrArg(number, false));
        setInput(calculationToString(dataAsOpj));
        setOpFlag(false);
        setDataFlag(true);
    }

    const handleBracket = (bracket: string, isLeftBracket: boolean) => {
        if (isLeftBracket) {
            dataAsOpj.push(new StrArg(bracket, false));
            setInput(calculationToString(dataAsOpj));
            setOpFlag(true);
        } else {
            dataAsOpj.push(new StrArg(bracket, false));
            setInput(calculationToString(dataAsOpj));
            setDataFlag(true);
            setNumberFlag(true);
        }

    }

    const calculationToString = (calculation: Array<StrArg>) => {
        let stringToShow: string = '';

        for (let i: number = 0; i < calculation.length; i++) {
            stringToShow = stringToShow + calculation[i].makeStringRep();
        }

        return stringToShow;
    }

    const handleDelete = () => {
        for (let i: number = 0; i < dataAsOpj.length; i++) {
            dataAsOpj.pop();
        }
        setInput(calculationToString(dataAsOpj));
        setOpFlag(false);
    }

    const handleSafe = (formel: string) => {
        if (formel.length <= 0) {
            return
        }
        setCustomData(new Set(customData.add(formel)))
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
                    handleBracket={(bracket: string, isLeftBracket: boolean) => handleBracket(bracket, isLeftBracket)}
                    handleDelete={() => handleDelete()}
                    handleSafe={(formel: string) => handleSafe(formel)}
                    dataFlag={dataFlag}
                    opFlag={opFlag}
                    numberFlag={numberFlag}
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
