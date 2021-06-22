import React, {useEffect, useRef} from "react";
import {jsonRefScene} from "../../types";
import {Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import {useCallFetch} from "../../../Hooks/useCallFetch";


interface SceneListProps {
    scenes: Array<jsonRefScene>
}

export const SceneList: React.FC<SceneListProps> = (props) => {

    const classes = useStyles();

    const [imgURL, setImgURL] = React.useState("");

    const isMounted = useRef(true);

    const fetchPreviewImg = () => {
        let url = "/visuanalytics/image/0"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json\n"
            },
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) {
                handleFetchImageSuccess(data)
            }
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleFetchImageError(err)
        }).finally(() => clearTimeout(timer));
    }

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    const handleFetchImageSuccess = (data: any) => {
        setImgURL(URL.createObjectURL(data));
    }

    const handleFetchImageError = (err: Error) => {
        console.log("Fehler: " + err)
    }

    /*
    const fetchPreviewImg = useCallFetch("/visuanalytics/image/0", {
            method: "GET",
            headers: {
                "Content-Type": "application/blob\n"
            }
        }, handleFetchImageSuccess, handleFetchImageError
    );

     */

    const renderSceneCard = (data: jsonRefScene) => {

        fetchPreviewImg();

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
                    <CardActionArea>
                        <img width="240" height="135" alt="Vorschaubild Diagramm" src={imgURL}/>
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
                {props.scenes.map((scene) => renderSceneCard(scene))}
            </Grid>
        </Box>
    );
}
