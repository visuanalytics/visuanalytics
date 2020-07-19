import React, { ComponentType } from 'react';
import { Param } from './param';
import { MenuItem, TextFieldProps, FormControlLabel, Checkbox, Collapse } from '@material-ui/core';


export const renderParamField = (
    param: Param, InputField: ComponentType<TextFieldProps>,
    disabled = true,
    required = false,
    selectParamHandler = (_s: string, _a: any) => { }
) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        selectParamHandler(name, event.target.value);
    }
    const handleMultiChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const values = event.target.value.split(",");
        selectParamHandler(name, values);
    }
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        selectParamHandler(name, event.target.checked);
    }

    switch (param.type) {
        case "string": case "number": case "multi-string": case "multi-number":
            const multiline = param.type === "multi-string" || param.type === "multi-number";
            return (
                <InputField
                    required={required && !param.optional}
                    multiline={multiline}
                    onChange={e => multiline ? handleMultiChange(e, param.name) : handleChange(e, param.name)}
                    variant="outlined"
                    value={param.selected}
                    InputProps={{
                        disabled: disabled
                    }}
                    label={param.displayName}
                />
            )
        case "boolean":
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={param.selected}
                            onChange={e => handleCheck(e, param.name)}
                        />}
                    label={param.displayName}
                    labelPlacement="top"
                />
            )
        case "enum":
            return (
                <InputField
                    required={required && !param.optional}
                    onChange={e => handleChange(e, param.name)}
                    variant="outlined"
                    label={param.displayName}
                    value={param.selected}
                    InputProps={{
                        disabled: disabled,
                    }}
                    select>
                    {param.possibleValues?.map((val) => (
                        <MenuItem key={val.value} value={val.value.toString()}>
                            {val.displayValue}
                        </MenuItem>
                    ))}
                </InputField>
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
                        />
                        :
                        param.displayName}
                    <Collapse in={!param.optional || param.selected}>
                        {param.subParams?.map((p: Param) =>
                            <div key={p.name}>
                                {renderParamField(p, InputField, disabled, required, selectParamHandler)}
                            </div>
                        )}
                    </Collapse>
                </div>
            )
        default:
            return (
                <div>
                    Unknown parameter type
                </div>
            )
    }
}