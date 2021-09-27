import React from "react";
import TextField from "@material-ui/core/TextField";

/**
 defaultValue: value to be displayed as default an as label while writing
 value: the current value, state variable is passed here
 changeHandler: handler method that changes the value
 noKey: optional parameter that signals when the user has chosen that no API-key is necessary. Will disable the input if true is passed.
 */
interface APIInputFieldProps {
  defaultValue: string;
  value: string;
  changeHandler: (newValue: string) => void;
  noKey?: boolean;
  errorText?: string;
  checkNameDuplicate?: (name: string) => boolean;
  disabled?: boolean;
}

/*
A basic input field to be used in the process of creating a new API-data-source.
The state of the input is handled in the parent classes.
 */
export const APIInputField: React.FC<APIInputFieldProps> = (props) => {
  //const classes = useStyles();
  //const components = React.useContext(ComponentContext);
  let disabled = false;
  if (props.disabled != null) disabled = props.disabled;
  if (props.errorText != null) {
    const error =
      props.checkNameDuplicate !== undefined
        ? props.checkNameDuplicate(props.value)
        : false;
    return (
      <TextField
        error={error}
        helperText={error ? props.errorText : null}
        fullWidth
        margin="normal"
        disabled={props.noKey || disabled}
        variant="filled"
        color="primary"
        label={props.defaultValue}
        value={props.value}
        onChange={(e) => {
          props.changeHandler(e.target.value);
        }}
      />
    );
  } else {
    return (
      <TextField
        fullWidth
        margin="normal"
        disabled={props.noKey || disabled}
        variant="filled"
        color="primary"
        label={props.defaultValue}
        value={props.value}
        onChange={(e) => {
          props.changeHandler(e.target.value);
        }}
      />
    );
  }
};
