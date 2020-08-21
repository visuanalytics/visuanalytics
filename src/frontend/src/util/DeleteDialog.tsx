import React from "react";
import { Button, Dialog, DialogTitle, DialogActions } from "@material-ui/core";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}
export const DeleteDialog: React.FC<Props> = ({
  title,
  open,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Abbrechen
        </Button>
        <Button onClick={handleDelete} color="primary">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
