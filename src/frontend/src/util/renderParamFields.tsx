import React from 'react';
import { Param } from './param';
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';


/**
 *
 * @param param
 * @param classes (useStyles())     
 * @param state (optional)
 */
export const renderParamField = (param: Param, classes: any, disabled = true, required = false, handler = (e: any) => { }) => {
    if (param.possibleValues.length === 0) {
        return (
            <TextField
                required={required}
                onChange={handler}
                className={classes.inputFields}
                variant="outlined"
                //     defaultValue={param.selected}
                value={param.selected}
                InputProps={{
                    disabled: disabled
                }}
                label={param.displayName} />
        )
    }
    return (
        <TextField
            required={required}
            onChange={handler}
            className={classes.inputFields}
            variant="outlined"
            label={param.displayName}
            //     defaultValue={param.selected}
            value={param.selected}
            InputProps={{
                disabled: disabled,
            }}
            select>
            {param.possibleValues.map((val) => (
                <MenuItem key={val.value} value={val.value}>
                    {val.displayValue}
                </MenuItem>
            ))}
        </TextField>
    )
}