import React from "react";
import {useStyles} from "./style";
import {HintButton} from "../../util/HintButton";
import Container from "@material-ui/core/Container"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"

interface Props {
    heading: string;
    hintContent: any;
    large?: boolean;
}

export const StepFrame: React.FC<Props> = ({
   heading,
   hintContent,
   large,
   children,
}) => {
    const classes = useStyles();
    return (
        <Container maxWidth={ large===undefined ? "md" : "lg"} className={classes.margin}>
            <Paper variant="outlined" className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item container sm={5} xs={10}>
                        <Grid item>
                            <Typography variant={"h4"} className={classes.header}>
                                {heading}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container sm={7} xs={2} justify={"flex-end"}>
                        <HintButton content={hintContent}/>
                    </Grid>
                </Grid>
                {children}
            </Paper>
        </Container>
    );
};
