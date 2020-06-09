import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { useStyles } from "../style";

interface ParamSelectionProps {
    topic: string;
    selectCompleteHandler: (isCompleted: boolean) => void;
}

interface Param {
    name: string,
    possibleValues: string[]
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    // const paramInfo: = useFetch("/params?topic=" + topic);
    const classes = useStyles();

    const paramInfo: Param[] = [
        {
            "name": "Spieltag",
            "possibleValues": ["aktuell", "letzter", "vorletzter"]
        },
        {
            "name": "Twitter-Wordcloud",
            "possibleValues": ["ja", "nein"]
        }
    ]

    const renderParamField = (param: Param) => {
        const name: string = param.name;
        const possibleValues: string[] = param.possibleValues;
        if (possibleValues.length === 0) {
            return (
                <TextField
                    className={classes.inputField}
                    variant="outlined"
                    label={name} />
            )
        }
        return (
            <TextField
                onChange={() => alert("Changed")}
                className={classes.inputField}
                variant="outlined"
                label={name}
                defaultValue=""
                select>
                {possibleValues.map((val) => (
                    <MenuItem key={val} value={val}>
                        {val}
                    </MenuItem>
                ))}
            </TextField>
        )
    }

    return (
        <div>
            {paramInfo.map(p =>
                <div className={classes.paddingSmall} key={p.name}>
                    {renderParamField(p)}
                </div>)
            }
        </div>
    );
};