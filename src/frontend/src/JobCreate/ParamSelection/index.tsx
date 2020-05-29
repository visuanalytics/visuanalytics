import React, { ReactElement } from "react";
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

export const ParamSelection: React.FC<Props> = ({ topic }: Props) => {
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
    const renderParam = (param: Param) => {
        const name: string = param.name;
        const possibleValues: string[] = param.possibleValues;
        let inputField: ReactElement;
        if (possibleValues.length === 0) {
            inputField = (
                <TextField className={classes.inputField} variant="outlined" label={name} key={name} />
            )
        } else {
            inputField = (
                <TextField className={classes.inputField} variant="outlined" label={name} select key={name}>
                    {possibleValues.map((val) => (
                        <MenuItem key={val} value={val}>
                            {val}
                        </MenuItem>
                    ))}
                </TextField>
            )
        }
        return (
            <div className={classes.paddingSmall}>
                {inputField}
            </div>
        )
    }
    return (
        <div className={classes.jobCreateBox}>
            <div>
                <h3 className={classes.jobCreateHeader}>Parameter festlegen</h3>
            </div>
            <Divider />
            {paramInfo.map(p => renderParam(p))}
            <Divider />
            <div className={classes.paddingSmall}>
                <ContinueButton>
                    WEITER
                </ContinueButton>
            </div>
        </div>
    );
};