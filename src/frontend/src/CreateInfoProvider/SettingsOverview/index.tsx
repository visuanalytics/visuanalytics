import React from "react";
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {formelObj} from "../CreateCustomData/CustomDataGUI/formelObjects/formelObj";
import { Schedule } from "..";
import { ScheduleTypeTable } from "./ScheduleTypeTable";

interface SettingsOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    name: string;
    setName: (name: string) => void;
    selectedData: Array<string>;
    customData: Array<formelObj>;
    historizedData: Array<string>;
    schedule: Schedule;
}

export const SettingsOverview: React.FC<SettingsOverviewProps> = (props) => {
    const classes = useStyles();

    const renderListItem = (item: string) => {
        return(
            <ListItem key={item} divider={true}>
                <ListItemText primary={item} secondary={null}/>
            </ListItem>
        )
    }
    return(
        <StepFrame
            heading={"Übersicht"}
            hintContent={hintContents.basicSettings}
        >
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Übersicht über ausgewählte Daten
                    </Typography>
                </Grid>
                <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Daten und Formeln
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                            <List disablePadding={true}>
                                {props.selectedData.map((item: string) => renderListItem(item))}
                                {props.customData.map((item: formelObj) => renderListItem(item.formelName))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={5} className={classes.elementLargeMargin}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Zu historisierende Daten
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.listFrame}>
                            <List disablePadding={true}>
                                {props.historizedData.map((item: string) => renderListItem(item))}
                            </List>
                            {props.schedule.type !== "" &&
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Historisierungszeiten
                                </Typography>
                            </Grid>
                            }
                            {props.schedule.type !== "" &&
                            <Grid item xs={12}>
                                <ScheduleTypeTable schedule={props.schedule}/>
                            </Grid>
                            }
                        </Box>
                    </Grid>
                    <Grid item container xs={12} justify="space-between" className={classes.elementLargeMargin}>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.backHandler}>
                            zurück
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="large" color="primary" onClick={props.continueHandler}>
                            abschließen
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </StepFrame>
    );
}
