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
    reportError: (message: string) => void;
}


export const InfoProviderSelection: React.FC<InfoProviderSelectionProps> = (props) => {

    const classes = useStyles();

    const checkBoxHandler = () => {

    }

    const renderListItem = (item: InfoProviderData, index: number) => {
        return (
            <ListItem>
                <ListItemIcon>
                    <Checkbox
                        checked={true}
                        onChange={() => console.log("TO BE IMPLEMENTED!!!")}
                    />
                </ListItemIcon>
                <ListItemText>

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
                        {props.infoProviderList.map((item) => renderListItem(item, 0))}
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
                    <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                        weiter
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
