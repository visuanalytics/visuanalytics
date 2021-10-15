import { Typography } from "@material-ui/core";
import React from "react";
import { useColorPickerStyles } from "./ColorPicker.style";

export interface ColorPickerProps {
  title: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled: boolean;
  value: string | number;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  title,
  onChange,
  disabled,
  value,
}) => {
  const classes = useColorPickerStyles();

  return (
    <>
      <Typography className={classes.labels} variant="button">
        {title}:
      </Typography>

      <input
        className={classes.buttonColor}
        type="color"
        onChange={onChange}
        disabled={disabled}
        value={value}
      />
    </>
  );
};
