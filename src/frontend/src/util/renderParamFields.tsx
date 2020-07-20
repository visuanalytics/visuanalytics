import React, { ComponentType } from 'react';
import { Param } from './param';
import { MenuItem, TextFieldProps } from '@material-ui/core';


/**
 *
 * @param param
 * @param classes (useStyles())     
 * @param state (optional)
 */
export const renderParamField = (param: Param, InputField: ComponentType<TextFieldProps>, disabled = true, required = false, handler = (e: any) => { }) => {
    if (param.possibleValues.length === 0) {
        return (
            <InputField
                required={required}
                onChange={handler}
                variant="outlined"
                // defaultValue={param.selected}
                value={param.selected}
                InputProps={{
                    disabled: disabled
                }}
            label={param.displayName} />
        )
    }
    return (
        <InputField
            required={required}
            onChange={handler}
            variant="outlined"
            label={param.displayName}
            // defaultValue={param.selected}
            value={param.selected}
            InputProps={{
                disabled: disabled,
            }}
            select>
            {param.possibleValues.map((val) => (
                <MenuItem key={val.value} value={val.value.toString()}>
                    {val.displayValue}
                </MenuItem>
            ))}
        </InputField>
    )
}