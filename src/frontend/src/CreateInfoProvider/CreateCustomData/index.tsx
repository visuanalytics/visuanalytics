import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import {strict} from "assert";
import {CustomDataGUI} from "./CustomDataGUI/customDataGUI";

interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const CreateCustomData: React.FC<CreateCustomDataProps>  = (props) => {

    const[customData, setCustomData] = React.useState<Set<string>>(new Set(props.selectedData));
    const[input, setInput] = React.useState<string>('');

    const handleCalcButtons = (operator: string) => {
        setInput(input + operator);
        console.log(input);
    }

    const handleDataButtons = (data: string) => {
        setInput(input + '{' + data + '}');
        console.log(input);
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
