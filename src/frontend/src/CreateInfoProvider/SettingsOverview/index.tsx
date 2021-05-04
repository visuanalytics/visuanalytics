import React, {ChangeEvent} from "react";
/*import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { JobList } from "../../JobList";
import { useStyles } from "./style";
import AddCircleIcon from "@material-ui/icons/AddCircle";*/
import {ComponentContext} from "../../ComponentProvider";
/*import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ExpandMore } from "@material-ui/icons";
import { PageTemplate } from "../../PageTemplate";*/
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useCallFetch} from "../../Hooks/useCallFetch";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from '@material-ui/core/Input';
import {StepFrame} from "../StepFrame";
import {hintContents} from "../../util/hintContents";
import {useStyles} from "../style";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface SettingsOverviewProps {
    continueHandler: () => void;
    backHandler: () => void;
    name: string;
    setName: (name: string) => void;
    selectedData: Set<string>;
    customData: Set<string>;
    historizedData: Set<string>;
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
                                {Array.from(props.selectedData).map((item: string) => renderListItem(item))}
                                {Array.from(props.customData).map((item: string) => renderListItem(item))}
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
                                {Array.from(props.historizedData).map((item: string) => renderListItem(item))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container xs={12} justify="space-between" className={classes.elementLargeMargin}>
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