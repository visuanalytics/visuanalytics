import {CreateCustomData} from "../index";
import React from "react";
import {Button, TextareaAutosize, TextField} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import {StrArg} from "./StringRep/StrArg";
import Checkbox from "@material-ui/core/Checkbox";

interface CustomDataGUIProps {
    customData: Set<string>;
    input: string;
    handleOperatorButtons: (operator: string) => void;
    handleDataButtons: (data: string) => void;
    handleNumberButton: (number: string) => void;
    handleBracket: (bracket: string, isLeftBracket: boolean) => void;
    handleDelete: () => void;
    handleSafe: (formel: string) => void;
    dataFlag: boolean;
    opFlag: boolean;
    numberFlag: boolean;
}

export const CustomDataGUI: React.FC<CustomDataGUIProps> = (props) => {

    const[text, setText] = React.useState<string>('');

    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                <FormControlLabel
                    control={
                        <Button variant={"outlined"} size={"small"} disabled={props.dataFlag} onClick={() => props.handleDataButtons(data)}>
                            {data}
                        </Button>
                    }
                    label={''}
                />
            </ListItem>
        );
    };

    const makeCalculateButtons = () => {
        return (
            <React.Fragment>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.opFlag} onClick={() => props.handleOperatorButtons('+')}>
                        +
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary" } disabled={props.opFlag} onClick={() => props.handleOperatorButtons('-')}>
                        -
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.opFlag} onClick={() => props.handleOperatorButtons('*')}>
                        *
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.opFlag} onClick={() => props.handleOperatorButtons('/')}>
                        /
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.opFlag} onClick={() => props.handleOperatorButtons('%')}>
                        %
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleBracket('(', true)}>
                        (
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleBracket(')', false)}>
                        )
                    </Button>
                </div>
            </React.Fragment>
        )
    };

    const makeNumberButtons = () => {
        return (
            <React.Fragment>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('0')}>
                        0
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('1')}>
                        1
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('2')}>
                        2
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('3')}>
                        3
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('4')}>
                        4
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('5')}>
                        5
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('6')}>
                        6
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('7')}>
                        7
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('8')}>
                        8
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} disabled={props.numberFlag} onClick={() => props.handleNumberButton('9')}>
                        9
                    </Button>
                </div>
            </React.Fragment>
        )
    };

    return (
        <React.Fragment>
            <div>
                <div style={{width: '20%'}}>
                    <TextField fullWidth margin={"normal"} variant={"outlined"} color={"primary"} required={true} onChange={event => (setText(event.target.value))}>
                        {'Name'}
                    </TextField>
                    <TextareaAutosize aria-setsize={100} placeholder={props.input} readOnly={true}/>
                    <List>
                        {Array.from(props.customData).sort((a, b) => a.localeCompare(b)).map(renderListItem)}
                    </List>

                </div>
                <div>
                    {makeCalculateButtons()}
                </div>
                <br/>
                <div>
                    {makeNumberButtons()}
                </div>
                <br/>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleDelete()}>
                        Löschen
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"}>
                        Ergebnis:
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleSafe(text)}>
                        Speichern!
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};
