import React from "react";
import {useStyles} from "../style";
import {Box, Grid, List, ListItem, ListItemSecondaryAction, Typography} from "@material-ui/core";
import {formelObj} from "../../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import Button from "@material-ui/core/Button";
import {SettingsRounded} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";

interface FormelListProps {
    customDataEdit: Array<formelObj>
    handleDelete: (name: string) => void;
    handleEdit: (formel: formelObj) => void;
}

export const FormelList: React.FC<FormelListProps> = (props) => {

    const classes = useStyles();

    const renderListName = (data: formelObj) => {
        return (
            <ListItem>
                <Box border={5} borderRadius={10} className={classes.formelNameBorder}>
                    <Typography variant={"h5"}>
                        {data.formelName}
                    </Typography>
                </Box>
            </ListItem>
        );
    }

    const renderListItem = (data: formelObj) => {
        return (
            <ListItem>
                <Box border={5} borderRadius={10} className={classes.formelBorder}>
                    <Typography variant={"h5"}>
                        {data.formelString}
                    </Typography>
                </Box>
                <ListItemSecondaryAction>
                    <Button variant={"contained"} size={"small"} className={classes.settings}
                            startIcon={<SettingsRounded fontSize="small"/>}
                            onClick={() => props.handleEdit(data)}
                    >
                        bearbeiten
                    </Button>
                    <Button variant={"contained"} size={"small"}
                            className={classes.delete}
                            startIcon={<DeleteIcon fontSize="small"/>}
                            onClick={() => props.handleDelete(data.formelName)}
                    >
                        löschen
                    </Button>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    return (
        <Grid item container xs={12} justify={"center"}>
            <Grid item xs={3}>
                <List>
                    {props.customDataEdit.map((e) => renderListName(e))}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List>
                    {props.customDataEdit.map((e) => renderListItem(e))}
                </List>
            </Grid>
        </Grid>

    );
}
