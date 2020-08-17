import React from 'react';
import { MenuItem, Checkbox, Collapse, TextField, Divider, useTheme } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useStyles } from '../JobCreate/style';
import { Param, ParamValues, validateParamValue } from '../util/param';
import { BooleanParam } from './BooleanParam'


interface ParamFieldProps extends ParamField {
    param: Param,
}

interface ParamFieldsProps extends ParamField {
    params: Param[] | undefined,
}

interface ParamField {
    selectParamHandler: (_s: string, _a: any, _i: number) => void,
    disabled: boolean,
    required: boolean,
    values: ParamValues,
    index: number
}

export const ParamFields: React.FC<ParamFieldsProps> = (props) => {
    const classes = useStyles();
    const idx = props.index;
    const params = props.params;

    return (
        <div key={idx} className={classes.MPaddingB}>
            {
                params && params.length > 0
                    ?
                    props.params?.map(p => (
                        <div key={p.name}>
                            <div className={p.type === "boolean" ? classes.XSPaddingTB : classes.SPaddingTB}>
                                <ParamField
                                    param={p}
                                    values={props.values}
                                    selectParamHandler={props.selectParamHandler}
                                    disabled={props.disabled}
                                    required={props.required}
                                    index={props.index}
                                />
                            </div>
                        </div>
                    ))
                    :
                    <div className={classes.MPaddingTB} style={{ textAlign: "center" }}>
                        Für dieses Thema stehen keine Parameter zur Verfügung.
                        </div>
            }
        </div>
    )
}

const ParamField: React.FC<ParamFieldProps> = (props) => {
    const param = props.param;
    const classes = useStyles();
    const theme = useTheme();
    const [showSubParams, setShowSubParams] = React.useState(false);
    const [invalid, setInvalid] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        setInvalid(!validateParamValue(event.target.value, param));
        props.selectParamHandler(name, event.target.value, props.index);
    }
    const handleMultiChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const values = event.target.value.split(",");
        setInvalid(!validateParamValue(values, param));
        props.selectParamHandler(name, values, props.index);
    }
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        props.selectParamHandler(name, event.target.checked, props.index);
    }

    const withExpIcon = (name: string, expanded: boolean) => {
        return (
            <span>
                {
                    expanded
                        ?
                        <div className={classes.expIcon}>
                            <ExpandLessIcon />
                        </div>
                        :
                        <div className={classes.expIcon}>
                            <ExpandMoreIcon />
                        </div>
                }
                {name} </span>
        )
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
                        value={props.values[param.name] || ""}
                        disabled={props.disabled}
                        label={param.displayName}
                        error={invalid}
                    />
                </div>
            )
        case "boolean":
            return (
                <BooleanParam
                    control={
                        < Checkbox
                            checked={props.values[param.name]}
                            onChange={e => handleCheck(e, param.name)}
                        />}
                    disabled={props.disabled}
                    label={
                        <div style={{ color: props.disabled ? theme.palette.text.disabled : theme.palette.text.secondary, }}>
                            {param.displayName}
                        </div>}
                    labelPlacement="start"
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
                    value={props.values[param.name] || ""}
                    disabled={props.disabled}
                    select>
                    {param.enumValues.map((val) => (
                        <MenuItem key={val.value} value={val.value.toString()}>
                            {val.displayValue}
                        </MenuItem>
                    ))}
                    error={invalid}
                </TextField>
            )
        case "subParams":
            return (
                <div>
                    <div className={classes.SPaddingTB}>
                        {param.optional
                            ?
                            <BooleanParam
                                control={
                                    <Checkbox
                                        checked={props.values[param.name]}
                                        onChange={e => handleCheck(e, param.name)}
                                    />}
                                label={
                                    <div style={{ color: props.disabled ? theme.palette.text.disabled : theme.palette.text.secondary, }}>
                                        {withExpIcon(param.displayName, props.values[param.name])}
                                    </div>}
                                labelPlacement="start"
                                disabled={props.disabled}
                            />
                            :
                            <div style={{ cursor: "pointer" }} onClick={() => { setShowSubParams(!showSubParams) }}>
                                <div style={{ color: theme.palette.text.secondary, cursor: "pointer" }}>
                                    {withExpIcon(param.displayName, false)}
                                </div>
                            </div>
                        }
                    </div>
                    <Collapse in={showSubParams || props.values[param.name]}>
                        <ParamFields
                            params={param.subParams}
                            values={props.values}
                            selectParamHandler={props.selectParamHandler}
                            disabled={props.disabled}
                            required={props.required}
                            index={props.index}
                        />
                    </Collapse>
                    {((props.values[param.name] || showSubParams))
                        &&
                        <div className={classes.SPaddingTB}>
                            <Divider />
                        </div>}
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
