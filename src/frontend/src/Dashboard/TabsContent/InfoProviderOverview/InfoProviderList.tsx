import React from "react";
import {useCallFetch} from "../../../Hooks/useCallFetch";
import {formelObj} from "../../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import {Box, Grid, IconButton, List, ListItemSecondaryAction, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import {useStyles} from "../../style";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {SettingsRounded} from "@material-ui/icons";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {jsonRef} from "./infoProviderOverview";

interface InfoProviderListProps {
    infoprovider: Array<jsonRef>;
    handleDeleteButton: (id: number) => void;
    //setInfoprovider: (data: Array<string>) => void;
}


export const InfoProviderList: React.FC<InfoProviderListProps> = (props) => {

    const classes = useStyles();

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
                    >
                        bearbeiten
                    </Button>
                    <Button variant={"contained"} size={"small"} className={classes.delete}
                            startIcon={<DeleteIcon fontSize="small"/>}
                            onClick={() => props.handleDeleteButton(data.infoprovider_id)}
                    >
                        löschen
                    </Button>
                </ListItemSecondaryAction>
            </ListItem>
        );
    };

    return (
        <List>
            {props.infoprovider.map((e) => renderListItem(e))}
        </List>
    );
}
