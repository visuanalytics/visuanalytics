import React from "react";
import { TextField, MenuItem, Fade } from "@material-ui/core";
import { useStyles } from "../style";
import { Param } from "../../util/param";

interface ParamSelectionProps {
    topic: string;
    params: Param[];
    selectParamHandler: (key: string, value: string) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        props.selectParamHandler(name, event.target.value);
    }

    const renderParamField = (param: Param) => {
        const name: string = param.name;
        const possibleValues: string[] = param.possibleValues;
        if (possibleValues.length === 0)
            return (
                <TextField
                    required
                    onChange={(e) => { handleChange(e, name) }}
                    className={classes.inputField}
                    variant="outlined"
                    label={name} />
            )
        return (
            <TextField
                required
                onChange={(e) => { handleChange(e, name) }}
                className={classes.inputField}
                variant="outlined"
                label={name}
                defaultValue=""
                value={lookupByName(name, props.params)?.selected}
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
        <Fade in={true}>
            <div>
                {props.params.map(p =>
                    <div className={classes.paddingSmall} key={p.name}>
                        {renderParamField(p)}
                    </div>)
                }
            </div>
        </Fade>

    );
};

const lookupByName: ((k: string, _: Param[]) => Param | null) = (k: string, list: Param[]) => {
    var val: Param | null = null;
    list.forEach((e: Param) => {
        if (e.name === k) {
            val = e;
        }
    })
    return val;
}