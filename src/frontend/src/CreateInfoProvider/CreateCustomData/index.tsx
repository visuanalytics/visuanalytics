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
import {Grid} from "@material-ui/core";
import {useStyles} from "./style";
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";


interface CreateCustomDataProps {
    continueHandler: () => void;
    backHandler: () => void;
    selectedData: Set<string>;
    setSelectedData: (set: Set<string>) => void;
}

export const CreateCustomData: React.FC<CreateCustomDataProps> = (props) => {

    const classes = useStyles();

    const [customData, setCustomData] = React.useState<Set<string>>(new Set(props.selectedData));
    const [input, setInput] = React.useState<string>('');

    const [dataAsOpj, setDataAsObj] = React.useState<Array<StrArg>>(new Array<StrArg>(0));

    /**
     * dataFlag shows if dataButton was triggered
     */
    const [dataFlag, setDataFlag] = React.useState<boolean>(false);
    /**
     * opFlag shows if operatorButton was triggered
     */
    const [opFlag, setOpFlag] = React.useState<boolean>(true);
    /**
     * NumberFlag shows if NumberButton was triggered
     */
    const [numberFlag, setNumberFlag] = React.useState<boolean>(false);
    const [rightBracketFlag, setRightBracketFlag] = React.useState<boolean>(false);
    const [leftBracketFlag, setLeftBracketFlag] = React.useState<boolean>(false);

    const [bracketCount, setBracketCount] = React.useState<number>(0);
    const [canRightBracketBePlaced, setCanRightBracketBePlaced] = React.useState<boolean>(true);

    const handleOperatorButtons = (operator: string) => {
        setOpFlag(true);
        setDataFlag(false)
        setNumberFlag(false);
        setRightBracketFlag(true);
        setLeftBracketFlag(false);

        dataAsOpj.push(new StrArg(operator, true, false));
        setInput(calculationToString(dataAsOpj));
    }

    const handleDataButtons = (data: string) => {
        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);

        dataAsOpj.push(new StrArg(data, false, false));
        setInput(calculationToString(dataAsOpj));
    }

    const handleNumberButtons = (number: string) => {
        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(false);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);

        dataAsOpj.push(new StrArg(number, false, true));
        setInput(calculationToString(dataAsOpj));
    }

    const handleLeftBracket = (bracket: string) => {
        setBracketCount(bracketCount + 1);
        console.log("bracketCountAL: " + bracketCount)
        setCanRightBracketBePlaced(bracketCount <= 0);
        console.log("LB: " + (bracketCount <= 0))

        setOpFlag(true);
        setDataFlag(false);
        setNumberFlag(false);
        setRightBracketFlag(false);
        setLeftBracketFlag(false);

        dataAsOpj.push(new StrArg(bracket, false, false));
        setInput(calculationToString(dataAsOpj));
    }

    const handleRightBracket = (bracket: string) => {
        setBracketCount(bracketCount - 1);
        console.log("bracketCountAR: " + bracketCount)
        setCanRightBracketBePlaced(bracketCount <= 0);
        console.log("RB: " + (bracketCount <= 0))

        setOpFlag(false);
        setDataFlag(true);
        setNumberFlag(true);
        setRightBracketFlag(false);
        setLeftBracketFlag(true);

        dataAsOpj.push(new StrArg(bracket, false, false));
        setInput(calculationToString(dataAsOpj));
    }

    const calculationToString = (calculation: Array<StrArg>) => {
        console.log('stringlength ' + calculation.length);
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

        setDataAsObj(new Array<StrArg>(0));
        setInput('');
        setBracketCount(0);

        setOpFlag(true);
        setDataFlag(false);
        setNumberFlag(false);
        setRightBracketFlag(false);
        setLeftBracketFlag(false);
    }

    const handleSafe = (formel: string) => {
        if ((formel.length <= 0) || (input.length <= 0)) {
            console.log('Entweder kein Name oder keine Formel!')
            return
        }
        setCustomData(new Set(customData.add(formel)));
        props.setSelectedData(new Set(customData));
        handleDelete();
    }

    return (
        <StepFrame
            heading="Formeln"
            hintContent={hintContents.formeln}
        >
            <React.Fragment>
                <Grid container justify="space-evenly" className={classes.elementMargin}>
                    <Grid item container xs={12}>
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
                    </Grid>
                    <Grid item container xs={12} justify="space-between" className={classes.elementMargin}>
                        <Grid>
                            <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                                zurück
                            </Button>
                        </Grid>
                        <Grid>
                            <Button variant="contained" size="large" color="primary"
                                    onClick={props.continueHandler}>
                                weiter
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        </StepFrame>
    );

}
