import React from 'react';
import { Param } from './param';
import { MenuItem, FormControlLabel, Checkbox, Collapse, TextField, Divider } from '@material-ui/core';
import { useStyles } from '../JobCreate/style';


interface ParamFieldProps extends IParamField {
    param: Param,
}

interface ParamFieldsProps extends IParamField {
    params: Param[],
}

interface IParamField {
    selectParamHandler: (_s: string, _a: any) => void,
    disabled: boolean,
    required: boolean
}

export const ParamFields: React.FC<ParamFieldsProps> = (props) => {
    const classes = useStyles();

    return (
        <div>
            {
                props.params.filter(p => props.required || !p.optional).map(p => (
                    <div>
                        <div className={classes.paddingSmall}>
                            <ParamField
                                param={p}
                                selectParamHandler={props.selectParamHandler}
                                disabled={props.disabled}
                                required={props.required}
                            />
                        </div>
                        {(p.type === "sub_params") && <Divider />}
                    </div>
                ))
            }
        </div>
    )
}

const ParamField: React.FC<ParamFieldProps> = (props) => {
    const param = props.param;
    const classes = useStyles();

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
        case "string": case "number": case "multi-string": case "multi-number":
            const multiline = param.type === "multi-string" || param.type === "multi-number";
            return (
                <div>
                    <TextField
                        fullWidth
                        required={props.required && !param.optional}
                        multiline={multiline}
                        onChange={e => multiline ? handleMultiChange(e, param.name) : handleChange(e, param.name)}
                        variant="outlined"
                        value={param.selected}
                        InputProps={{
                            disabled: props.disabled
                        }}
                        label={param.displayName}
                    />
                </div>
            )
        case "boolean":
            return (
                <FormControlLabel
                    control={
                        < Checkbox
                            checked={param.selected}
                            onChange={e => handleCheck(e, param.name)}
                        />}
                    label={param.displayName}
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
                    value={param.selected}
                    InputProps={{
                        disabled: props.disabled,
                    }}
                    select>
                    {param.possibleValues?.map((val) => (
                        <MenuItem key={val.value} value={val.value.toString()}>
                            {val.displayValue}
                        </MenuItem>
                    ))}
                </TextField>
            )
        case "sub_params":
            return (
                <div>
                    {param.optional
                        ?
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={param.selected}
                                    onChange={e => handleCheck(e, param.name)}
                                />}
                            label={param.displayName}
                            labelPlacement="start"
                            className={classes.checkboxParam}
                        />
                        :
                        <p>
                            {param.displayName}
                        </p>
                    }
                    <Collapse in={!param.optional || param.selected}>
                        <ParamFields
                            params={param.subParams || []}
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
