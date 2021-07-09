import React from "react";
import {Box, List, ListItemSecondaryAction, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import {useStyles} from "../../style";
import DeleteIcon from "@material-ui/icons/Delete";
import {MessageRounded, SettingsRounded} from "@material-ui/icons";
import {jsonRef} from "../../types";
import {LogDialog} from "./LogDialog";

interface InfoProviderListProps {
    infoprovider: Array<jsonRef>;
    handleDeleteButton: (data: jsonRef) => void;
    handleEditButton: (data: jsonRef) => void;
}


/**
 * Renders the list that holds all Infoproviders
 * @param props
 */
export const InfoProviderList: React.FC<InfoProviderListProps> = (props) => {

    const classes = useStyles();

    // This state is used for either showing the dialog with log messages or hiding it
    const [showLogDialog, setShowLogDialog] = React.useState(false);

    // This state is used for passing the ID of an infoprovider to the LogDialog
    const [selectedInfoproviderID, setSelectedInfoproviderID] = React.useState(-1);

    // This state is used to pass the name of the infoprovider to the LogDialog
    const [selectedInfoproviderName, setSelectedInfoproviderName] = React.useState("");

    const openLogDialog = (infoproviderID: number, infoproviderName: string) => {
        setSelectedInfoproviderID(infoproviderID);
        setSelectedInfoproviderName(infoproviderName);
        setShowLogDialog(true);
    }

    /**
     * The method renders one list-element and will be called for every single infoprovider in the infoprovider-array
     * @param data is the content from the list-element
     */
    const renderListItem = (data: jsonRef) => {
        return (
            <ListItem key={data.infoprovider_name}>
                <Box border={5} borderRadius={10}
                     className={classes.infoProvBorder}>
                    <Typography variant={"h5"}>
                        {data.infoprovider_name}
                    </Typography>
                </Box>
                <ListItemSecondaryAction>
                    <Button variant={"contained"} size={"small"} className={classes.settings}
                            startIcon={<SettingsRounded fontSize="small"/>}
                            onClick={() => props.handleEditButton(data)}
                    >
                        bearbeiten
                    </Button>
                    <Button variant={"contained"} size={"small"} className={classes.delete}
                            startIcon={<DeleteIcon fontSize="small"/>}
                            onClick={() => props.handleDeleteButton(data)}
                    >
                        löschen
                    </Button>
                    <Button variant={"contained"} size={"small"} className={classes.settings}
                            startIcon={<MessageRounded fontSize="small"/>}
                            onClick={() => openLogDialog(data.infoprovider_id, data.infoprovider_name)}
                    >
                        Logs einsehen
                    </Button>
                </ListItemSecondaryAction>
            </ListItem>
        );
    };

    return (
        <React.Fragment>
            <List>
                {props.infoprovider.map((e) => renderListItem(e))}
            </List>
            {showLogDialog &&
                <LogDialog
                    infoproviderID={selectedInfoproviderID}
                    infoproviderName={selectedInfoproviderName}
                    showLogDialog={showLogDialog}
                    setShowLogDialog={setShowLogDialog}/>
            }
        </React.Fragment>
    );
}
