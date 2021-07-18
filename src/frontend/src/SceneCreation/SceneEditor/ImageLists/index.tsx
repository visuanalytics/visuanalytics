import React from "react";
import {useStyles} from "../style";
import {Button, Checkbox, Collapse, FormControlLabel, Grid, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {ImageFrontendData} from "../../types";


interface ImageListsProps {
    imageList: Array<ImageFrontendData>
    backgroundImageList: Array<ImageFrontendData>
    postImage: (data: FormData) => void;
    postBackgroundImage: (data: FormData) => void;
    handleImageClick: (src : string, id: number, path: string, index: number, diagram: boolean) => void;
    handleBackgroundImageClick: (src : string, index : number) => void;
    backGroundType: string;
    backGroundColorEnabled: boolean;
    handleBackground: () => void;
    currentBGColor: string;
    switchBGColor: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    uploadReference: React.RefObject<HTMLInputElement>;
    handleFileUploadClick: () => void;
    handleFileUploadChange: (event : React.ChangeEvent<HTMLInputElement>) => void;
    backgroundUploadReference: React.RefObject<HTMLInputElement>;
    handleBackgroundUploadClick: () => void;
    handleBackgroundUploadChange: (event : React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Component that displays the list of background images and images, both collapsable.
 */
export const ImageLists: React.FC<ImageListsProps> = (props) => {

    const classes = useStyles();
    // true if the background image section is shown (used for collapse)
    const [showBackgroundImages, setShowBackgroundImages] = React.useState(false);
    // true if the images section is shown (used for collapse)
    const [showImages, setShowImages] = React.useState(false);


    /**
     * Method that renders a single entry in the list of all available images
     * @param image The blob URL of the image to be displayed.
     * @param id The ID in the backend of the image to be displayed.
     * @param path The URL/path in the backend of the image to be displayed.
     * @param index The index of the image (used to make keys unique)
     * @param type Indicates if the image is a normal image or a background image.
     */
    const renderImageEntry = (image: string, id: number, path: string, index: number, type: "image"|"background") => {
        if(type==="image") {
            return (
                <Grid key={image} item container xs={6} justify="space-around" className={index === 0 ? classes.firstImage : index === 1 ? classes.secondImage : index % 2 === 0 ? classes.leftImage : classes.rightImage}>
                    <Grid item xs={10}>
                        <img src={image} className={classes.imageInList} alt={"Image Nr." +  index} onClick={() => props.handleImageClick(image, id, path, index, false)}/>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid key={image} item container xs={6} justify="space-around" className={index === 0 ? classes.firstImage : index === 1 ? classes.secondImage : index % 2 === 0 ? classes.leftImage : classes.rightImage}>
                    <Grid item xs={10}>
                        <img src={image} className={classes.imageInList} alt={"Image Nr." +  index} onClick={() => props.handleBackgroundImageClick(image, index)}/>
                    </Grid>
                </Grid>
            )
        }
    }

    //TODO: do we need the path and id also for the background image? i dont think so!

    return (
        <React.Fragment>
            <Grid item container xs={12}>
                <Grid item xs={10} className={classes.elementLargeMargin}>
                    <Typography variant={"h4"} align={"center"}>
                        HINTERGRUND
                    </Typography><br/>
                </Grid>
                <Grid item xs={2}>
                    {!showBackgroundImages &&
                    <IconButton aria-label="Hintergrundbilder-Liste ausklappen"
                                onClick={() => setShowBackgroundImages(!showBackgroundImages)}>
                        <ExpandMore/>
                    </IconButton>
                    }
                    {showBackgroundImages &&
                    <IconButton aria-label="Hintergrundbilder-Liste einklappen"
                                onClick={() => setShowBackgroundImages(!showBackgroundImages)}>
                        <ExpandLess/>
                    </IconButton>
                    }
                </Grid>
            </Grid>
            <Grid item container xs={12} justify="space-around">
                <Collapse in={showBackgroundImages} className={classes.fullWidthCollapse}>
                    <Grid item xs={12}>
                        <FormControlLabel className={classes.checkBox}
                                          control={<Checkbox name="checkedB" color="primary"
                                                             checked={props.backGroundColorEnabled}
                                                             onChange={props.handleBackground}/>}
                                          label="Hintergrundfarbe verwenden"
                        /><br/>
                        <label className={classes.labels}> Hintergrundfarbe: </label>
                        <input
                            className={classes.buttonColor}
                            id="backgroundColor"
                            type="color"
                            onChange={props.switchBGColor}
                            disabled={props.backGroundType !== "COLOR" || !props.backGroundColorEnabled}
                            value={!props.backGroundColorEnabled ? "#FFFFFF" : props.currentBGColor}
                        /><br/>
                    </Grid>
                    <Grid item container xs={12} justify="space-around">
                        <Grid item>
                            <Button className={classes.button} onClick={props.handleBackgroundUploadClick} disabled={false}>
                                HINTERGRUNDBILD HOCHLADEN
                                <input ref={props.backgroundUploadReference} id={"backgroundUpload"} type={"file"}
                                       accept={".png, .jpg, .jpeg"} hidden
                                       onChange={(e) => props.handleBackgroundUploadChange(e)}/>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        {props.backgroundImageList.map((image, index) => renderImageEntry(image.image_blob_url, 0, "", index, "background"))}
                    </Grid>
                </Collapse>
            </Grid>
            <Grid item container xs={12} className={classes.elementExtraLargeMargin}>
                <Grid item xs={10}>
                    <Typography variant={"h4"} align={"center"}>
                        BILDER
                    </Typography><br/>
                </Grid>
                <Grid item xs={2}>
                    {!showImages &&
                    <IconButton aria-label="Bilder-Liste ausklappen" onClick={() => setShowImages(!showImages)}>
                        <ExpandMore/>
                    </IconButton>
                    }
                    {showImages &&
                    <IconButton aria-label="Bilder-Liste einklappen" onClick={() => setShowImages(!showImages)}>
                        <ExpandLess/>
                    </IconButton>
                    }
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Collapse in={showImages} className={classes.fullWidthCollapse}>
                    <Grid item container xs={12} justify="space-around">
                        <Grid item>
                            <Button className={classes.uploadButton} onClick={props.handleFileUploadClick}>
                                Bild hochladen
                                <input ref={props.uploadReference} id={"fileUpload"} type={"file"} accept={".png, .jpg"}
                                       hidden
                                       onChange={(e) => props.handleFileUploadChange(e)}/>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} className={classes.elementLargeMargin}>
                        {props.imageList.map((image, index) => renderImageEntry(image.image_blob_url, image.image_id, image.image_backend_path, index, "image"))}
                    </Grid>
                </Collapse>
            </Grid>
        </React.Fragment>
    )
}
