import { Button } from "@material-ui/core";
import React from "react";
import {
  CustomCircle,
  CustomImage,
  CustomLine,
  CustomRectangle,
  CustomStar,
  CustomText,
} from "../../types";
import { useActionHeaderStyles } from "./ActionHeader.style";

export interface ActionHeaderProps {
  clearCanvas: () => void;
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
  undo: () => void;
  recentlyRemovedItems: (
    | CustomCircle
    | CustomRectangle
    | CustomLine
    | CustomStar
    | CustomText
    | CustomImage
  )[];
  dupe: () => void;
  itemSelected: boolean;
}

export const ActionHeader: React.FC<ActionHeaderProps> = ({
  clearCanvas,
  items,
  deleteItem,
  deleteText,
  undo,
  recentlyRemovedItems,
  dupe,
  itemSelected,
}) => {
  const classes = useActionHeaderStyles();

  const actionButtons = [
    {
      action: clearCanvas,
      label: "ZURÜCKSETZEN",
    },
    {
      action: deleteItem,
      disabled: items.length <= 0,
      label: deleteText,
    },
    {
      action: undo,
      disabled: recentlyRemovedItems.length === 0,
      label: "RÜCKGÄNGIG",
    },
    {
      action: dupe,
      disabled: !itemSelected,
      label: "Klonen",
    },
  ];

  return (
    <div className={classes.root}>
      {actionButtons.map((ab) => (
        <Button
          className={classes.button}
          disabled={ab.disabled}
          onClick={ab.action}
        >
          {ab.label}
        </Button>
      ))}
    </div>
  );
};
