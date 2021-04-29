import {CreateCustomData} from "../index";
import React from "react";
import {Button, TextareaAutosize, TextField} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";

interface CustomDataGUIProps {
    customData: Set<string>;
    setCustomData: (set: Set<string>) => void;
    input: string;
    handleCalcButtons: (operator: string) => void;
    handleDataButtons: (data: string) => void;
}

export const CustomDataGUI: React.FC<CustomDataGUIProps> = (props) => {

    const renderListItem = (data: string) => {
        return (
            <ListItem key={data}>
                <FormControlLabel
                    control={
                        <Button variant={"outlined"} size={"small"} onClick={() => props.handleDataButtons(data)}>
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
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('+')}>
                        +
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary" } onClick={() => props.handleCalcButtons('-')}>
                        -
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('*')}>
                        *
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('/')}>
                        /
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('%')}>
                        %
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('(')}>
                        (
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons(')')}>
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
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('0')}>
                        0
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('1')}>
                        1
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('2')}>
                        2
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('3')}>
                        3
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('4')}>
                        4
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('5')}>
                        5
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('6')}>
                        6
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('7')}>
                        7
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('8')}>
                        8
                    </Button>
                </div>
                <div>
                    <Button variant={"contained"} size={"medium"} color={"primary"} onClick={() => props.handleCalcButtons('9')}>
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
                    <TextField variant={"outlined"}>
                        {'Name'}
                    </TextField>
                    <TextareaAutosize placeholder={props.input} readOnly={true}/>
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
                    <Button variant={"contained"} size={"medium"} color={"primary"}>
                        Syntax-Check
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"}>
                        Ergebnis:
                    </Button>
                    <Button variant={"contained"} size={"medium"} color={"primary"}>
                        Speichern!
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};
