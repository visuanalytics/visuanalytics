import React from "react";
import { MenuButton } from "./MenuButton";
import PaletteIcon from "@material-ui/icons/Palette";
import { Popover } from "@material-ui/core";

export interface SelectThemeProps {}

export const SelectTheme: React.FC<SelectThemeProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuButton
        title="Darstellung ändern"
        iconButtonProps={{ onClick: handleClick }}
        icon={<PaletteIcon />}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      ></Popover>
    </>
  );
};
