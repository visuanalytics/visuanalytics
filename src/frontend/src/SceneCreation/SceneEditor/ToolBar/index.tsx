import { Box, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { fonts } from "../../../assets/sceneEditor/toolBar/fonts";
import { stepSizes } from "../../../assets/sceneEditor/toolBar/stepsSizes";
import {
  CustomCircle,
  CustomImage,
  CustomLine,
  CustomRectangle,
  CustomStar,
  CustomText,
} from "../types";
import { ActionHeader } from "./ActionHeader";
import { ColorPicker } from "./ColorPicker";
import { useToolbarStyles } from "./ToolBar.style";

export interface ToolBarProps {
  clearCanvas: () => void;
  switchItemColor: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disableColor: () => boolean;
  currentItemColor: string;
  changeFontColor: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disableFontColor: () => boolean;
  currentFontColor: string;
  items: (
    | CustomCircle
    | CustomRectangle
    | CustomLine
    | CustomStar
    | CustomText
    | CustomImage
  )[];
  deleteItem: () => void;
  deleteText: string;
  stepSize: number;
  handleCoordinatesXChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  itemSelected: boolean;
  currentXCoordinate: number;
  currentYCoordinate: number;
  changeFontFamily: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  currentFontFamily: string;
  selectedItemName: string;
  handleItemWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentItemWidth: number;
  undo: () => void;
  recentlyRemovedItems: (
    | CustomCircle
    | CustomRectangle
    | CustomLine
    | CustomStar
    | CustomText
    | CustomImage
  )[];
  handleCoordinatesYChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  changeFontSize: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  currentFontSize: number;
  handleItemHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentItemHeight: number;
  dupe: () => void;
  changeTextWidth: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleStepSizeChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  currentTextWidth: number;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  clearCanvas,
  switchItemColor,
  disableColor,
  currentItemColor,
  changeFontColor,
  disableFontColor,
  currentFontColor,
  items,
  deleteItem,
  deleteText,
  stepSize,
  handleCoordinatesXChange,
  itemSelected,
  currentXCoordinate,
  currentYCoordinate,
  changeFontFamily,
  currentFontFamily,
  selectedItemName,
  handleItemWidthChange,
  currentItemWidth,
  undo,
  recentlyRemovedItems,
  handleCoordinatesYChange,
  changeFontSize,
  currentFontSize,
  handleItemHeightChange,
  currentItemHeight,
  dupe,
  changeTextWidth,
  handleStepSizeChange,
  currentTextWidth,
}) => {
  const classes = useToolbarStyles();

  const colorInputs = [
    {
      title: "Farbe",
      onChange: switchItemColor,
      disabled: disableColor(),
      value: currentItemColor,
    },
    {
      title: "Schriftfarbe",
      onChange: changeFontColor,
      disabled: !disableFontColor(),
      value: currentFontColor,
    },
  ];

  const numberInputs = [
    {
      label: "X Koordinate",
      value: currentXCoordinate,
      onChange: handleCoordinatesXChange,
      disabled: !itemSelected,
      min: 0,
      max: 960,
      step: stepSize.toString(),
    },
    {
      label: "Breite",
      value: currentItemWidth,
      onChange: handleItemWidthChange,
      disabled: !selectedItemName.startsWith("rect"),
      min: 1,
      max: 960,
    },
    {
      label: "Y Koordinate",
      value: currentYCoordinate,
      onChange: handleCoordinatesYChange,
      disabled: !itemSelected,
      min: 0,
      max: 540,
      step: stepSize.toString(),
    },
    {
      label: "Schriftgröße (PX)",
      value: currentFontSize,
      onChange: changeFontSize,
      disabled: !selectedItemName.startsWith("text"),
      min: 1,
      max: 144,
      step: 1,
    },
    {
      label: "Höhe",
      value: currentItemHeight,
      onChange: handleItemHeightChange,
      disabled: !selectedItemName.startsWith("rect"),
      min: 1,
      max: 960,
    },
    {
      label: "Textbreite (PX)",
      value: currentTextWidth,
      onChange: changeTextWidth,
      disabled: !selectedItemName.startsWith("text"),
      min: 200,
      max: 940,
      step: 1,
    },
  ];

  return (
    <Box border={5} borderRadius={5} className={classes.root}>
      <ActionHeader
        clearCanvas={clearCanvas}
        items={items}
        deleteItem={deleteItem}
        deleteText={deleteText}
        undo={undo}
        recentlyRemovedItems={recentlyRemovedItems}
        dupe={dupe}
        itemSelected={itemSelected}
      />
      <div className={classes.actionBody}>
        <div className={classes.colorPicker}>
          {colorInputs.map((c) => (
            <ColorPicker key={c.title} {...c} />
          ))}
        </div>

        {numberInputs.map((n) => (
          <TextField
            {...n}
            key={n.label}
            className={classes.buttonNumber}
            type="number"
            InputProps={{
              inputProps: {
                min: n.min,
                max: n.max,
                step: n.step,
              },
            }}
          />
        ))}

        <TextField
          id="fontType"
          onChange={changeFontFamily}
          className={classes.selection}
          label={"Schriftart"}
          value={currentFontFamily}
          disabled={!selectedItemName.startsWith("text")}
          select
        >
          {fonts.map((f) => (
            <MenuItem
              key={f.value}
              value={f.value}
              style={{ fontFamily: f.fontFamily }}
            >
              {f.displayName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="stepSizeOptions"
          onChange={(e) => handleStepSizeChange(e)}
          value={stepSize}
          className={classes.selection}
          select
          label={"Sprunggröße"}
          disabled={!itemSelected}
        >
          {stepSizes.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
};
