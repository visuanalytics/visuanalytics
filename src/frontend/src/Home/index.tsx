import React from "react";
import {Container, Grid, IconButton, Paper, Tooltip, Typography} from "@material-ui/core";
import {JobList} from "../JobList";
import {useStyles} from "./style";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {ComponentContext} from "../ComponentProvider";
import {HintButton} from "../util/HintButton";

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
                        <HintButton content={"Erklärung"} />
                    </Grid>
                </Grid>
                <JobList/>

            </Paper>

        </Container>
    );
};
