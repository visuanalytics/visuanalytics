import React from 'react';
import { MenuItem, FormControlLabel, Checkbox, Collapse, TextField, Divider, useTheme } from '@material-ui/core';
import { useStyles } from '../JobCreate/style';
import { Param, ParamValues } from '../util/param';


interface ParamFieldProps extends ParamField {
    param: Param,
}

interface ParamFieldsProps extends ParamField {
    params: Param[],
}

interface ParamField {
    selectParamHandler: (_s: string, _a: any) => void,
    disabled: boolean,
    required: boolean,
    values: ParamValues
}

export const ParamFields: React.FC<ParamFieldsProps> = (props) => {
    const classes = useStyles();

    return (
        <div>
            {
                props.params.filter(p => props.required || !p.optional).map(p => (
                    <div key={p.name}>
                        <div className={classes.paddingSmall}>
                            <ParamField
                                param={p}
                                values={props.values}
                                selectParamHandler={props.selectParamHandler}
                                disabled={props.disabled}
                                required={props.required}
                            />
                        </div>
                        {(p.type === "subParams") && <Divider />}
                    </div>
                ))
            }
        </div>
    )
}

const ParamField: React.FC<ParamFieldProps> = (props) => {
    const param = props.param;
    const classes = useStyles();
    const theme = useTheme();

    const makeLabel = (name: string) => (<label style={{ color: theme.palette.text.secondary }}>{name}</label>)
    const makeSubParamLabel = (name: string) => (<label style={{ fontSize: 18 }}>{name}</label>)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        props.selectParamHandler(name, event.target.value);
    }
    const handleMultiChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const values = event.target.value.split(",");
        props.selectParamHandler(name, values);
    }
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        props.selectParamHandler(name, event.target.checked);
    }

    switch (param.type) {
        case "string": case "number": case "multiString": case "multiNumber":
            const multiline = param.type === "multiString" || param.type === "multiNumber";
            return (
                <div>
                    <TextField
                        fullWidth
                        required={props.required && !param.optional}
                        multiline={multiline}
                        onChange={e => multiline ? handleMultiChange(e, param.name) : handleChange(e, param.name)}
                        variant="outlined"
                        value={props.values[param.name]}
                        disabled={props.disabled}
                        label={param.displayName}
                    />
                </div>
            )
        case "boolean":
            return (
                <FormControlLabel
                    control={
                        < Checkbox
                            checked={props.values[param.name]}
                            onChange={e => handleCheck(e, param.name)}
                        />}
                    disabled={props.disabled}
                    label={makeLabel(param.displayName)}
                    labelPlacement="start"
                    className={classes.checkboxParam}
                />
            )
        case "enum":
            return (
                <TextField
                    fullWidth
                    required={props.required && !param.optional}
                    onChange={e => handleChange(e, param.name)}
                    variant="outlined"
                    label={param.displayName}
                    value={props.values[param.name]}
                    disabled={props.disabled}
                    select>
                    {param.enumValues?.map((val) => (
                        <MenuItem key={val.value} value={val.value.toString()}>
                            {val.displayValue}
                        </MenuItem>
                    ))}
                </TextField>
            )
        case "subParams":
            return (
                <div>
                    {param.optional
                        ?
                        <div className={classes.paddingSmall}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={props.values[param.name]}
                                        onChange={e => handleCheck(e, param.name)}
                                    />}
                                label={makeSubParamLabel(param.displayName)}
                                labelPlacement="start"
                                className={classes.checkboxParam}
                                disabled={props.disabled}
                            />
                        </div>
                        :
                        <div className={classes.paddingSmall}>
                            {makeSubParamLabel(param.displayName)}
                        </div>
                    }
                    <Collapse in={!param.optional || props.values[param.name]}>
                        <ParamFields
                            params={param.subParams}
                            values={props.values}
                            selectParamHandler={props.selectParamHandler}
                            disabled={props.disabled}
                            required={props.required}
                        />
                    </Collapse>
                </div >
            )
        default:
            return (
                <div>
                    Unknown parameter type
                </div>
            )
    }
}
