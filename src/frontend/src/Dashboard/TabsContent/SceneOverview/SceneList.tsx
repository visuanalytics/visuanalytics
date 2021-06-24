import React from "react";
import {jsonRefScene} from "../../types";
import {Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";


interface SceneListProps {
    scenes: Array<jsonRefScene>;
    previewImgList: Array<string>;
    setDetailDialogOpen: (flag: boolean) => void;
    setCurrent: (data: jsonRefScene) => void;
}

export const SceneList: React.FC<SceneListProps> = (props) => {

    const classes = useStyles();

    const imgId = React.useRef(-1);

    const resetImgId = () => {
        imgId.current = -1
    }

    const renderSceneCard = (data: jsonRefScene) => {

        imgId.current = imgId.current + 1;

        console.log("renderSceneCard" + imgId.current);

        return (
            <Grid
                key={data.scene_name + "-scene"}
                item
                container
                xs={4}
            >
                <Card
                    variant={"outlined"}
                >
                    <CardActionArea onClick={() => {
                        props.setCurrent(data);
                        props.setDetailDialogOpen(true);
                    }}>
                        <img width="240" height="135" alt="Vorschaubild Diagramm" src={props.previewImgList[imgId.current]}/>
                        <CardContent>
                            <Typography gutterBottom variant={"h6"}>
                                {data.scene_name}
                            </Typography>
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
                {resetImgId()}
                {props.scenes.map((scene) => renderSceneCard(scene))}
            </Grid>
        </Box>
    );
}
