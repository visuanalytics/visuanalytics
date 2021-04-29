import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {strict} from "assert";
import {CustomDataGUI} from "./CustomDataGUI/customDataGUI";
import {Expr} from "./CustomDataGUI/Expression/Expr";


interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const CreateCustomData: React.FC<CreateCustomDataProps>  = (props) => {

    const[customData, setCustomData] = React.useState<Set<string>>(new Set(props.selectedData));
    const[input, setInput] = React.useState<string>('');

    const[dataAsOpj, setDataAsObj] = React.useState<Array<Expr>>(new Array<Expr>(0));

    const handleCalcButtons = (operator: string) => {
        setInput(input + operator);
    }

    const handleDataButtons = (data: string) => {
        const newArr: Array<Expr> = dataAsOpj;
        console.log(newArr)
        let newLength: number = newArr.push(new Expr(true, data, ''))
        console.log(newArr);
        setInput(calculationToString(newArr));
        setDataAsObj(newArr);
    }

    const calculationToString = (calculation: Array<Expr>) => {
        let stringToShow: string = '';

        for (let i: number = 0; i < calculation.length; i++) {
            stringToShow = stringToShow + calculation[i].makeStringRep();
        }

        return stringToShow;
    }

    return (
        <React.Fragment>
            <div>
                <CustomDataGUI
                    customData={customData}
                    setCustomData={(set: Set<string>) => setCustomData(set)}
                    input={input}
                    handleCalcButtons={(operator: string) => handleCalcButtons(operator)}
                    handleDataButtons={(operator: string) => handleDataButtons(operator)}
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
