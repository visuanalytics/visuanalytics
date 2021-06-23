import React from "react";
import {useStyles} from "../style";
import {Box, Grid, List, ListItem, ListItemSecondaryAction, Typography} from "@material-ui/core";
import {FormelObj} from "../../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import Button from "@material-ui/core/Button";
import {SettingsRounded} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";

interface FormelListProps {
    customDataEdit: Array<FormelObj>
    handleEdit: (formel: FormelObj) => void;
    deleteCustomDataCheck: (formelName: string) => void;
}

/**
 * Renders the shown list of formula to give an overview over the created formulas.
 */
export const FormelList: React.FC<FormelListProps> = (props) => {

    const classes = useStyles();

    const renderListName = (data: FormelObj) => {
        return (
            <ListItem key={data.formelName + "-name"}>
                <Box border={5} borderRadius={10} className={classes.formelNameBorder}>
                    <Typography variant={"h5"}>
                        {data.formelName}
                    </Typography>
                </Box>
            </ListItem>
        );
    }

    const renderListItem = (data: FormelObj) => {
        return (
            <ListItem key={data.formelName + "-formula"}>
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
                            onClick={() => {props.deleteCustomDataCheck(data.formelName)}}
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
                <List aria-label={"formel-names"}>
                    {props.customDataEdit.map((e) => renderListName(e))}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List aria-label={"formel-strings"}>
                    {props.customDataEdit.map((e) => renderListItem(e))}
                </List>
            </Grid>
        </Grid>

    );
}
