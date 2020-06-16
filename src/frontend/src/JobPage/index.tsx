import React from "react";
import {Container, Paper} from "@material-ui/core";
import {useStyles} from "../Home/style";
import {ComponentContext} from "../ComponentProvider";
import JobCreate from "../JobCreate";

export const JobPage = () => {
    const classes = useStyles();
    const components = React.useContext(ComponentContext);
    return (
        <Container maxWidth={"md"} className={classes.margin}>
            <Paper variant="outlined" className={classes.paper}>
                <JobCreate/>
            </Paper>
        </Container>
    );
};
