import React from "react";
import {Container, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import {JobList} from "../JobList";
import {useStyles} from "./style";
import AddCircleIcon from '@material-ui/icons/AddCircle';

export const Home = () => {
    const classes = useStyles();
    return (
        <Container maxWidth={"md"} className={classes.margin}>
            <Paper variant="outlined" className={classes.paper}>
                <Grid container spacing={1}>
                <Grid item>
                    <Typography variant={"h4"} className={classes.header}>
                        Job-Pool
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton aria-label="delete" className={classes.button} size="small">
                        <AddCircleIcon fontSize="large"/>
                    </IconButton>
                </Grid>
                </Grid>
                <JobList/>

            </Paper>

        </Container>
    );
};
