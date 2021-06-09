import React from 'react'
import {Card, CardActions, CardContent} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";



export interface SceneCardProps {
    sceneName: string;
    moveLeft: () => void;
    moveRight: () => void;
    displayDuration: number;
    setDisplayDuration: (newDisplayDuration: number) => void;
    spokenText: string;
    setSpokenText: (newSpokenText: string) => void;
    leftDisabled: boolean;
    rightDisabled: boolean;
}

/**
 * Component for a draggable scene used in the interface of the videoEditor.
 */
export const SceneCard: React.FC<SceneCardProps> = (props) => {

    return (
        <Card variant="outlined" color="primary" style={{width: "300px"}}>
            <CardContent>
                <Grid item container>
                    <Grid item xs={12}>
                        <Typography>
                            {props.sceneName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            Dauer: {props.displayDuration}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            Gesprochener Text: {props.spokenText}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justify="space-between">
                    <Grid item>
                        <Button disabled={props.leftDisabled} variant="contained" onClick={props.moveLeft}>
                            links
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={props.rightDisabled} variant="contained" onClick={props.moveRight}>
                            rechts
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )

}
