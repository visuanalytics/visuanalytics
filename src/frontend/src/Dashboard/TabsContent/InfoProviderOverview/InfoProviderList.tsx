import React from "react";
import {Box, List, ListItemSecondaryAction, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import {useStyles} from "../../style";
import DeleteIcon from "@material-ui/icons/Delete";
import {SettingsRounded} from "@material-ui/icons";

interface InfoProviderListProps {
    infoprovider: Array<jsonRef>;
    handleDeleteButton: (id: jsonRef) => void;
}

/**
 * This type is used to correctly handle each single infoprovider from the response from the backend.
 */
type jsonRef = {
    infoprovider_id: number;
    infoprovider_name: string;
}

/**
 * Renders the list that holds all Infoproviders
 * @param props
 */
export const InfoProviderList: React.FC<InfoProviderListProps> = (props) => {

    const classes = useStyles();

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
                    >
                        bearbeiten
                    </Button>
                    <Button variant={"contained"} size={"small"} className={classes.delete}
                            startIcon={<DeleteIcon fontSize="small"/>}
                            onClick={() => props.handleDeleteButton(data)}
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
