import React from "react";
import {Box, Button, Grid, List, ListItem, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import {BackendVideo, BackendVideoList} from "../../types";
import {PlayCircleFilledOutlined, SettingsRounded} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";

interface VideoListProps {
    videos: BackendVideoList;
}

export const VideoList: React.FC<VideoListProps> = (props) => {

    const classes = useStyles();

    const renderVideoListItem = (data: BackendVideo) => {
        return (
            <ListItem key={data.videojob_name}>
                <Grid container justify="space-between">
                    <Grid item xs={7}>
                        <Box border={5} borderRadius={10}
                             className={classes.videoBorder}>
                            <Typography variant={"h5"} style={{ width: "100%", padding: "10px", textAlign: "center"}} className={classes.wrappedText}>
                                {data.videojob_name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item container xs={5} justify="space-between" className={classes.infoProvIconContainer}>
                        <Grid item container xs={12}>
                            <Grid item>
                                <Button variant={"contained"} size={"small"} color={"primary"}
                                        startIcon={<SettingsRounded fontSize="small"/>}
                                        onClick={() => console.log("Edit!")}
                                >
                                    bearbeiten
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={"contained"} size={"small"} className={classes.delete}
                                        startIcon={<DeleteIcon fontSize="small"/>}
                                        onClick={() => console.log("delete!!!")}
                                >
                                    löschen
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item>
                                <Button variant={"contained"} size={"small"} className={classes.showVideo}
                                        startIcon={<PlayCircleFilledOutlined fontSize="small"/>}
                                        onClick={() => console.log("??")}
                                >
                                    Video anschauen
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem>
        );
    }

    return (
        <Box
            borderColor="primary.main"
            border={6}
            borderRadius={5}
            className={classes.listFrameScenes}
        >
            <List>
                {props.videos.map((e) => renderVideoListItem(e))}
            </List>
        </Box>
    );
}
