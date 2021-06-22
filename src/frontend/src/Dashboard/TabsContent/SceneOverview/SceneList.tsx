import React from "react";
import {jsonRefScene} from "../../types";
import {Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";


interface SceneListProps {
    scenes: Array<jsonRefScene>
}

export const SceneList: React.FC<SceneListProps> = (props) => {

    const classes = useStyles();

    const renderSceneCard = (data: jsonRefScene) => {
        return (
            <Grid item container xs={4}>
                <Card
                    key={data.scene_name + "-scene"}
                    variant={"outlined"}
                >
                    <CardActionArea>
                        <CardMedia
                            image={"../../../../../visuanalytics/resources/images/backgrounds/blue.png"}
                            title={"background"}
                            className={classes.media}
                        />
                        <CardContent>
                            <Typography gutterBottom variant={"h5"}>
                                Name: {data.scene_name}
                            </Typography>
                            Id: {data.scene_id}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    return (
        <Box
            borderColor="primary.main"
            border={6}
            borderRadius={5}
            className={classes.listFrameScenes}
        >
            <Grid item container xs={12}>
                {props.scenes.map((scene) => renderSceneCard(scene))}
            </Grid>
        </Box>
    );
}
