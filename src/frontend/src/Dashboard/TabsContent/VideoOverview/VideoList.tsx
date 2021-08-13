import React from "react";
import {Box, Button, Grid, List, ListItem, Typography} from "@material-ui/core";
import {useStyles} from "../../style";
import {BackendVideo, BackendVideoList} from "../../types";
import {MessageRounded, SettingsRounded} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import {LogDialog} from "../../LogDialog";

interface VideoListProps {
    videos: BackendVideoList;
    handleDeleteVideo: (video: BackendVideo) => void;
    handleEditVideo: (video: BackendVideo) => void;
    reportError: (message: string) => void;
}

export const VideoList: React.FC<VideoListProps> = (props) => {

    const classes = useStyles();

    // This state is used for either showing the dialog with log messages or hiding it
    const [showLogDialog, setShowLogDialog] = React.useState(false);

    // This state is used for passing the ID of an infoprovider to the LogDialog
    const [selectedVideoJobID, setSelectedVideojobID] = React.useState(-1);

    // This state is used to pass the name of the infoprovider to the LogDialog
    const [selectedVideojobName, setSelectedVideojobName] = React.useState("");

    const openLogDialog = (infoproviderID: number, infoproviderName: string) => {
        setSelectedVideojobID(infoproviderID);
        setSelectedVideojobName(infoproviderName);
        setShowLogDialog(true);
    }

    const renderVideoListItem = (data: BackendVideo) => {
        return (
            <ListItem key={data.videojob_name}>
                <Grid container justify="space-between">
                    <Grid item xs={7}>
                        <Box border={5} borderRadius={10}
                             className={classes.videoBorder}>
                            <Typography variant={"h5"} className={classes.wrappedItemText}>
                                {data.videojob_name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item container xs={5} justify="space-between" className={classes.infoProvIconContainer}>
                        <Grid item container xs={6}>
                            <Grid item xs={12}>
                                <Button variant={"contained"} size={"small"} color={"primary"} className={classes.settings}
                                        startIcon={<SettingsRounded fontSize="small"/>}
                                        onClick={() => props.handleEditVideo(data)}
                                >
                                    bearbeiten
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant={"contained"} size={"small"} className={classes.delete}
                                        startIcon={<DeleteIcon fontSize="small"/>}
                                        onClick={() => props.handleDeleteVideo(data)}
                                >
                                    löschen
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            {/**<Grid item xs={12}>
                                <Button variant={"contained"} size={"small"} className={classes.showVideo}
                                        startIcon={<PlayCircleFilledOutlined fontSize="small"/>}
                                        onClick={() => console.log("??")}
                                >
                                    Video
                                </Button>
                            </Grid>*/}
                            <Grid item xs={12} /*className={classes.logIconTopMargin}*/>
                                <Button variant={"contained"} size={"small"} className={classes.logs}
                                        startIcon={<MessageRounded fontSize="small"/>}
                                        onClick={() =>  openLogDialog(data.videojob_id, data.videojob_name)}
                                >
                                    Logs
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem>
        );
    }

    return (
        <React.Fragment>
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
            {showLogDialog &&
            <LogDialog
                objectId={selectedVideoJobID}
                objectName={selectedVideojobName}
                objectType={"videojob"}
                showLogDialog={showLogDialog}
                setShowLogDialog={setShowLogDialog}
                reportError={props.reportError}
            />}
        </React.Fragment>
    )
}
