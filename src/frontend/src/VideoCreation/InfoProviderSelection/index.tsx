import React from "react";
import {InfoProviderData} from "../types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {ListItem, ListItemText} from "@material-ui/core";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useStyles} from "../style";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";


interface InfoProviderSelectionProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProviderList: Array<InfoProviderData>
    selectedInfoProvider: Array<InfoProviderData>
    setSelectedInfoProvider: (selected: Array<InfoProviderData>) => void;
    reportError: (message: string) => void;
}


export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();

    /**
     * Method to check if a certain infoProviderID is included in the list of selected infoproviders
     * @param id The id to be checked
     */
    const checkIdIncluded = (id: number) => {
        for (let index = 0; index < props.selectedInfoProvider.length; index++) {
            if(props.selectedInfoProvider[index].infoprovider_id === id) return true;
        }
        return false;
    }

    /**
     * Handler for clicking a checkbox of one of the info providers in the list.
     * Adds the infoProvider to the selection if it is not selected, removes it if it is already selected
     * @param infoProvider The infoProvider the checkbox was clicked for
     */
    const checkBoxHandler = (infoProvider: InfoProviderData) => {
        //check if the infoProvider is already selected
        if(checkIdIncluded(infoProvider.infoprovider_id)) {
            //remove the infoProvider from the selection
            props.setSelectedInfoProvider(props.selectedInfoProvider.filter((selectedInfoProvider) => {
                return selectedInfoProvider.infoprovider_id !== infoProvider.infoprovider_id
            }))
        } else {
            //add the infoProvider to the selection
            const arCopy = props.selectedInfoProvider.slice();
            arCopy.push(infoProvider);
            props.setSelectedInfoProvider(arCopy);
        }
    }

    const renderListItem = (infoProvider: InfoProviderData) => {
        return (
            <ListItem>
                <ListItemIcon>
                    <Checkbox
                        checked={checkIdIncluded(infoProvider.infoprovider_id)}
                        onChange={() => checkBoxHandler(infoProvider)}
                    />
                </ListItemIcon>
                <ListItemText>
                    {infoProvider.infoprovider_name}
                </ListItemText>
            </ListItem>
        )
    }


    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body1">
                    Bitte wählen sie die Infoprovider, deren Datenwerte in der Videoerstellung für Text-to-Speech zur Verfügung stehen sollen:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                    <List disablePadding={true}>
                        {props.infoProviderList.map((infoProvider) => renderListItem(infoProvider))}
                    </List>
                </Box>
            </Grid>
            <Grid item xs={12}>
                Warnung
            </Grid>
            <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                <Grid item>
                    <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                        zurück
                    </Button>
                </Grid>
                <Grid item className={classes.blockableButtonPrimary}>
                    <Button disabled={props.selectedInfoProvider.length === 0} variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
