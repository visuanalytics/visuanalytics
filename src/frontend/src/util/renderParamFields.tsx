import React from 'react';
import {Param} from './param';
import TextField from '@material-ui/core/TextField';
import {MenuItem} from '@material-ui/core';


/**
 *
 * @param param
 * @param classes (useStyles())
 * @param state (optional)
 */
export const renderParamField = (param: Param,classes: any, state = false) => {
    const name: string = param.name;
    const possibleValues: any[] = param.possibleValues;
    if (possibleValues.length === 0) {
        return (
            <TextField
                className={classes.inputFields}
                variant="outlined"
                defaultValue={param.selected}
                InputProps={{
                    disabled: state
                }}
                label={name}/>
        )
    }
    return (
        <TextField
            className={classes.inputFields}
            variant="outlined"
            label={name}
            defaultValue={param.selected}
            InputProps={{
                disabled: state,
            }}
            select>
            {possibleValues.map((val) => (
                <MenuItem key={val.value} value={val.value}>
                    {val.display_value}
                </MenuItem>
            ))}
        </TextField>
    )
}