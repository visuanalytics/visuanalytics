import React from "react";
import {
    Container,
    Grid,
    IconButton,
    List,
    ListItem, ListItemIcon, ListItemText,
    Paper,
    Tooltip,
    Typography
} from "@material-ui/core";
import {JobList} from "../JobList";
import {useStyles} from "./style";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {ComponentContext} from "../ComponentProvider";
import {HintButton} from "../util/HintButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {ExpandMore} from "@material-ui/icons";

export const Home = () => {
    const classes = useStyles();
    const components = React.useContext(ComponentContext);
    return (
        <Container maxWidth={"md"} className={classes.margin}>
            <Paper variant="outlined" className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid container xs={3}>
                        <Grid item >
                            <Typography variant={"h4"} className={classes.header}>
                                Job-Pool
                            </Typography>
                        </Grid>
                        <Grid item >
                            <Tooltip title="Job erstellen" arrow>
                                <IconButton className={classes.button} size="small" onClick={() => components?.setCurrent("jobpage")}>
                                    <AddCircleIcon fontSize="large"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid container xs={9} justify={"flex-end"}>
                        <HintButton content={
                            <div>
                                <Typography variant="h5" gutterBottom>Job-Pool</Typography>
                                <Typography>Auf dieser Seite haben Sie eine Übersicht über Ihre angelegten Jobs.</Typography>
                                <List>
                                   <ListItem>
                                       <ListItemIcon className={classes.hintIcons}>
                                           <AddCircleIcon/>
                                       </ListItemIcon>
                                       <ListItemText primary="Neuen Job erstellen"/>
                                   </ListItem>
                                    <ListItem>
                                       <ListItemIcon className={classes.hintIcons}>
                                           <EditIcon />
                                       </ListItemIcon>
                                       <ListItemText primary="Job bearbeiten"/>
                                   </ListItem>
                                    <ListItem>
                                       <ListItemIcon className={classes.hintIcons}>
                                           <DeleteIcon/>
                                       </ListItemIcon>
                                       <ListItemText primary="Job löschen"/>
                                   </ListItem>
                                    <ListItem>
                                       <ListItemIcon className={classes.hintIcons}>
                                           <ExpandMore/>
                                       </ListItemIcon>
                                       <ListItemText primary="Job-Informationen ausklappen"/>
                                   </ListItem>
                                </List>
                            </div>
                        } />
                    </Grid>
                </Grid>
                <JobList/>

            </Paper>

        </Container>
    );
};
