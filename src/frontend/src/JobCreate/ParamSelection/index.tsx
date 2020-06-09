import React from "react";
import { Divider, TextField, MenuItem } from "@material-ui/core";
import { ContinueButton } from "../ContinueButton";
import { useStyles } from "../style";

interface Props {
    topic: string;
}

interface Param {
    name: string,
    possibleValues: string[]
}

export const ParamSelection: React.FC<Props> = ({ topic }) => {
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