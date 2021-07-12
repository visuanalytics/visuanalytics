import React from "react";
import List from "@material-ui/core/List";
import {
    ListItem,
    Button,
    Grid,
    Box,
    TextField,
    MenuItem,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions, Dialog,

} from "@material-ui/core";
import {useStyles} from "./style";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";
import Konva from 'konva';
import {Stage, Layer, Circle, Group, Text, Image, Rect, Line, Star} from 'react-konva';
import {TransformerComponent} from './TransformerComponent'
import {
    ArrayProcessingData,
    DataSource,
    Diagram,
    FrontendInfoProvider,
    ListItemRepresentation,
    SelectedDataItem, StringReplacementData,
    uniqueId
} from "../../CreateInfoProvider/types";
import {DiagramInfo, HistorizedDataInfo, ImageBackendData, ImageFrontendData, ImagePostBackendAnswer} from "../types";
import {useCallFetch} from "../../Hooks/useCallFetch";
import {centerNotifcationReducer, CenterNotification} from "../../util/CenterNotification";
import {
    CustomCircle,
    CustomImage,
    CustomLine,
    CustomRectangle,
    CustomStar,
    CustomText,
    ResponseData,
    JsonExport,
    DataText,
    DataImage,
    BaseImg
} from "./types"
import {ImageLists} from "./ImageLists";
import {DiagramList} from "./DiagramList";
import {ComponentContext} from "../../ComponentProvider";

interface SceneEditorProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProvider: FrontendInfoProvider;
    infoProviderId: number;
    selectedDataList: Array<string>;
    customDataList: Array<string>;
    historizedDataList: Array<HistorizedDataInfo>;
    arrayProcessingList: Array<string>;
    stringReplacementList: Array<string>;
    diagramList: Array<DiagramInfo>;
    imageList: Array<ImageFrontendData>;
    setImageList: (images: Array<ImageFrontendData>) => void;
    backgroundImageList: Array<string>;
    setBackgroundImageList: (backgrounds: Array<string>) => void;
    editMode: boolean;
    reportError: (message: string) => void;
    fetchImageById: (id: number, image_url: string, successHandler: (jsonData: any, id: number, url: string) => void, errorHandler: (err: Error) => void) => void;
    fetchBackgroundImageById: (id: number, successHandler: (jsonData: any) => void, errorHandler: (err: Error) => void) => void;
}

export const SceneEditor: React.FC<SceneEditorProps> = (props) => {

    const classes = useStyles();
    const components = React.useContext(ComponentContext);


    // timeOut variable used for asynchronous color changes
    let timeOut = 0;
    // array used for the export of the final scene
    const imageIDArray = React.useRef<Array<number>>([])
    // references used to access HTML elements
    const uploadReference = React.useRef<HTMLInputElement>(null);
    const backgroundUploadReference = React.useRef<HTMLInputElement>(null);
    const mainRef = React.useRef<HTMLDivElement>(null);
    // reference for the background Image
    const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement>(new window.Image())
    // index of the background image selected in the list of background images
    const [backgroundImageIndex, setBackgroundImageIndex] = React.useState(0);
    const currentItemRotation = React.useRef<number>(0)
    const currentItemScaleX = React.useRef<number>(1);
    const currentItemScaleY = React.useRef<number>(1);
    const currentItemX = React.useRef<number>(0);
    const currentItemY = React.useRef<number>(0);

    // states used to determine the type of background
    const [backGroundType, setBackGroundType] = React.useState("COLOR");
    const [backGroundColor, setBackGroundColor] = React.useState("#FFFFFF");
    const [backGroundColorEnabled, setBackGroundColorEnabled] = React.useState(false);

    // states used to adjust HTML elements
    const [currentlyEditing, setCurrentlyEditing] = React.useState(false)
    const [currentFontFamily, setCurrentFontFamily] = React.useState("Arial");
    const [currentFontSize, setCurrentFontSize] = React.useState(20);
    const [currentItemWidth, setCurrentItemWidth] = React.useState(100);
    const [currentItemHeight, setCurrentItemHeight] = React.useState(100);
    const [currentTextWidth, setCurrentTextWidth] = React.useState(200);
    const [currentTextContent, setCurrentTextContent] = React.useState("");
    const [currentItemColor, setCurrentItemColor] = React.useState("#000000")
    const [currentBGColor, setCurrentBGColor] = React.useState("#FFFFFF");
    const [currentFontColor, setCurrentFontColor] = React.useState("#000000");
    const [currentXCoordinate, setCurrentXCoordinate] = React.useState(0);
    const [currentYCoordinate, setCurrentYCoordinate] = React.useState(0);

    // state for the delete button text
    const [deleteText, setDeleteText] = React.useState("Letztes Elem. entf.");

    // state for items, if an item is selected and a counter for the amount of items
    const [items, setItems] = React.useState<Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>>([]);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [itemCounter, setItemCounter] = React.useState(0);

    // state for the items that have been removed, used to restore them if needed
    const [recentlyRemovedItems, setRecentlyRemovedItems] = React.useState<Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>>([]);

    // state for the name of the scene
    const [sceneName, setSceneName] = React.useState("");

    // states for when an item is selected
    // name of the item, type of the item and the item itself
    const [selectedItemName, setSelectedItemName] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("Circle");
    const [selectedObject, setSelectedObject] = React.useState<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>({} as CustomCircle);

    // state to check the size by how much an item should be moved either in x or y direction
    const [stepSize, setStepSize] = React.useState(5);
    // state for the stage of the canvas, used for the export
    const [stage, setStage] = React.useState<Konva.Stage>()

    // states for all textediting related properties
    const [textEditContent, setTextEditContent] = React.useState("");
    const [textEditVisibility, setTextEditVisibility] = React.useState(false);
    const [textEditX, setTextEditX] = React.useState(0);
    const [textEditY, setTextEditY] = React.useState(0);
    const [textEditWidth, setTextEditWidth] = React.useState(0);
    const [textEditFontSize, setTextEditFontSize] = React.useState(20);
    const [textEditFontFamily, setTextEditFontFamily] = React.useState("");
    const [textEditFontColor, setTextEditFontColor] = React.useState("#000000");
    //Test
    // states for the export and upload of images or the scene
    const [baseImage, setBaseImage] = React.useState<FormData>(new FormData());
    const [exportJSON, setExportJSON] = React.useState<JsonExport|null>(null);
    const [previewPosted, setPreviewPosted] = React.useState<boolean>(false);


    // Used to remember the clicked historized element
    const [selectedHistorizedElement, setSelectedHistorizedElement] = React.useState("");

    // Used to remember the interval of the selected historized element
    const [selectedInterval, setSelectedInterval] = React.useState("");

    // Used for selecting a specific value for a historized element
    const [intervalToUse, setIntervalToUse] = React.useState<number | undefined>(0);
    // Used to handle the opening of the dialog for historized data
    const [showHistorizedDialog, setShowHistorizedDialog] = React.useState(false);
    // setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    //true when the dialog for going back is opened
    const [backDialogOpen, setBackDialogOpen] = React.useState(false);


    /**
     * Defines event listener for finishing th page loading.
     * Sets the default Konva stage - this is necessary since the id of the container for it will
     * only contain after the page is loaded.
     * Also removes the handler when unmounting the component.
     */
    React.useEffect(() => {
        const setStageAfterLoad = (event: Event) => {
            setStage(new Konva.Stage({container: "main", width: 960, height: 540}));
        }
        window.addEventListener("load", setStageAfterLoad);
        return () => {
            window.removeEventListener("load", setStageAfterLoad);
        }
    }, [])


    /*
    * Code for saving to and restoring from sessionStorage
    * recreates the same state of the sceneEditor on reload
     */

    React.useEffect(() => {
        //backgroundImage - stores the index in the list of background images to recreate it
        const newImg = new window.Image();
        const index = Number(sessionStorage.getItem("backgroundImageIndex-" + uniqueId) || 0);
        newImg.src = props.backgroundImageList[index];
        setBackgroundImageIndex(index);
        setBackgroundImage(newImg);
        //backGroundType
        setBackGroundType(sessionStorage.getItem("backGroundType-" + uniqueId) || "COLOR");
        //currentBGColor
        setCurrentBGColor(sessionStorage.getItem("currentBGColor-" + uniqueId) || "#FFFFFF");
        //backgroundColorEnabled
        setBackGroundColorEnabled(sessionStorage.getItem("backGroundColorEnabled-" + uniqueId) === "true" || false);
        //deleteText
        setDeleteText(sessionStorage.getItem("deleteText-" + uniqueId) || "Letztes Elem. entf.");
        //items
        let restoredItems: Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage> = [];
        restoredItems = sessionStorage.getItem("items-" + uniqueId) === null ? new Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>() : JSON.parse(sessionStorage.getItem("items-" + uniqueId)!);
        console.log(props.imageList);
        //find all images and set the new url by their id
        for (let index = 0; index < restoredItems.length; index++) {
            if(restoredItems[index].hasOwnProperty("image")) {
                let castedItem = restoredItems[index] as CustomImage;
                castedItem.image = new window.Image();
                castedItem.image.src = props.imageList[castedItem.index].image_blob_url;
                restoredItems[index] = castedItem;
            }
        }
        setItems(restoredItems);
        //console.log(sessionStorage.getItem("items-" + uniqueId) === null ? new Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>() : JSON.parse(sessionStorage.getItem("items-" + uniqueId)!));
        //itemCounter
        setItemCounter(Number(sessionStorage.getItem("itemCounter-" + uniqueId) || 0));
        //recentlyRemovedItems
        setRecentlyRemovedItems(sessionStorage.getItem("recentlyRemovedItems-" + uniqueId) === null ? new Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>() : JSON.parse(sessionStorage.getItem("recentlyRemovedItems-" + uniqueId)!))
        //sceneName
        setSceneName(sessionStorage.getItem("sceneName-" + uniqueId) || "");
        //TODO: this is possibly wrong - no default value exists for this stage so I dont know what i need here
        //stage
        //setStage(sessionStorage.getItem("stage-" + uniqueId) === null ? new Konva.Stage({container: "", width: 960, height: 540}) : JSON.parse(sessionStorage.getItem("stage-" + uniqueId)!));
    }, [])

    //store backgroundImageIndex in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("backgroundImageIndex-" + uniqueId, backgroundImageIndex.toString());
    }, [backgroundImageIndex])
    //store backGroundType in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("backGroundType-" + uniqueId, backGroundType);
    }, [backGroundType])
    //store currentBGColor in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("currentBGColor-" + uniqueId, currentBGColor);
    }, [currentBGColor])
    //store backGroundColorEnabled in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("backGroundColorEnabled-" + uniqueId, backGroundColorEnabled ? "true" : "false");
    }, [backGroundColorEnabled])
    //store deleteText in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("deleteText-" + uniqueId, deleteText);
    }, [deleteText])
    //store items in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("items-" + uniqueId, JSON.stringify(items));
    }, [items])
    //store itemCounter in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("itemCounter-" + uniqueId, itemCounter.toString());
    }, [itemCounter])
    //store recentlyRemovedItems in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("recentlyRemovedItems-" + uniqueId, JSON.stringify(recentlyRemovedItems));
    }, [recentlyRemovedItems])
    //store sceneName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("sceneName-" + uniqueId, sceneName);
    }, [sceneName])
    //store stage in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("stage-" + uniqueId, JSON.stringify(stage));
    }, [stage])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("backgroundImageIndex-" + uniqueId);
        sessionStorage.removeItem("backGroundType-" + uniqueId);
        sessionStorage.removeItem("currentBGColor-" + uniqueId);
        sessionStorage.removeItem("backGroundColorEnabled-" + uniqueId);
        sessionStorage.removeItem("deleteText-" + uniqueId);
        sessionStorage.removeItem("items-" + uniqueId);
        sessionStorage.removeItem("itemCounter-" + uniqueId);
        sessionStorage.removeItem("recentlyRemovedItems-" + uniqueId);
        sessionStorage.removeItem("sceneName-" + uniqueId);
        sessionStorage.removeItem("stage-" + uniqueId);
        sessionStorage.removeItem("infoProvider-" + uniqueId);
        sessionStorage.removeItem("selectedDataList-" + uniqueId);
        sessionStorage.removeItem("customDataList-" + uniqueId);
        sessionStorage.removeItem("historizedDataList-" + uniqueId);
        sessionStorage.removeItem("diagramList-" + uniqueId);
        sessionStorage.removeItem("imageList-" + uniqueId);
    }




    /**
     * Method to create a duplicate of the current stage to create the base image for the rendered scene
     * @param itemArray the itemlist used to create the duplicate stage
     */
    const dupeStage = (itemArray : Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>) => {
        //creation of a new stage with the same properties as the old stage
        let duplicateStage = new Konva.Stage({container: "backgroundStage", visible: true, width: 960, height: 540});
        //creation of a new Layer for that stage
        let duplicateLayer = new Konva.Layer();
        duplicateStage.destroyChildren();
        //depending on the current backgroundtype, set the lowest element on the layer
        if (backGroundType === "COLOR"){
            duplicateLayer.add(new Konva.Rect({
                fill: currentBGColor,
                width: 960,
                height: 540
            }))
        } else if (backGroundType === "IMAGE") {
            duplicateLayer.add(new Konva.Image({
                image: backgroundImage,
                width: 960,
                height: 540,
            }))
        }
        //check all elements in the array, depending on the type, create a new element and add it to the layer
        for (let i = 0; i < itemArray.length; i++) {
            let duplicateItem : any;
            if (!itemArray[i].id.startsWith("image") && !itemArray[i].id.startsWith("text")){
                if (itemArray[i].id.startsWith("circle")){
                    duplicateItem = new Konva.Circle({
                        radius: 50,
                        x: itemArray[i].x,
                        y: itemArray[i].y,
                        fill: itemArray[i].color,
                        id: itemArray[i].id,
                        scaleX: itemArray[i].scaleX,
                        scaleY: itemArray[i].scaleY,
                        width: itemArray[i].width,
                        height: itemArray[i].height,
                        rotation: itemArray[i].rotation,
                    })
                } else if (itemArray[i].id.startsWith("rect")){
                    duplicateItem = new Konva.Rect({
                        fill: itemArray[i].color,
                        id: itemArray[i].id,
                        scaleX: itemArray[i].scaleX,
                        scaleY: itemArray[i].scaleY,
                        width: itemArray[i].width,
                        height: itemArray[i].height,
                        x: itemArray[i].x,
                        y: itemArray[i].y,
                        rotation: itemArray[i].rotation,
                    })
                } else if (itemArray[i].id.startsWith("line")){
                    duplicateItem = new Konva.Line({
                        fill: itemArray[i].color,
                        id: itemArray[i].id,
                        scaleX: itemArray[i].scaleX,
                        scaleY: itemArray[i].scaleY,
                        width: itemArray[i].width,
                        height: itemArray[i].height,
                        rotation: itemArray[i].rotation,
                        x: itemArray[i].x,
                        y: itemArray[i].y,
                        points: [0,0,100,0,100,100],
                        closed: true,
                        stroke: itemArray[i].color,
                    })
                } else if (itemArray[i].id.startsWith("star")){
                    duplicateItem = new Konva.Star({
                        numPoints: 5,
                        innerRadius: 50,
                        outerRadius: 100,
                        fill: itemArray[i].color,
                        id: itemArray[i].id,
                        scaleX: itemArray[i].scaleX,
                        scaleY: itemArray[i].scaleY,
                        x: itemArray[i].x,
                        y: itemArray[i].y,
                        rotation: itemArray[i].rotation,
                    })
                }
                duplicateLayer.add(duplicateItem);
            }

        }
        //finally add the layer to the stage and return the new stage
        duplicateStage.add(duplicateLayer);
        return duplicateStage;
    }


    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = React.useRef(true);


    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    React.useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Method block for sending the scene to the backend
     */


    /**
     * Method to handle the button to save the scene and go back to the overview.
     * Starts by calling the method that creates the background image by fetching
     * the Konva stage. This method will continue to control the chain of
     * postings to the backend.
     */
    const saveButtonHandler = () => {
        // throws an error when the amount of items on the stage is 0, and empty stage can not be exported
        if (itemCounter === 0) {
            dispatchMessage({type: "reportError", message: "Die Szene ist leer!"});
            return;
        }
        //start the chain of fetching to communicate with the backend
        createBackgroundImage();
    }



    //variables used for storing values while preparing and doing the posting of a finished scene
    //stores the id the background was stored with by the backend
    const backgroundID = React.useRef(-1);
    //stores the id the preview was stored with by the backend
    const scenePreviewID = React.useRef(-1);


    /**
     * Method to create a FormData containing the preview for the scene.
     * After fetching the pewview image successfully from the Konva stage, it starts the method for posting
     * it to the backend.
     */
    const createPreviewImage = async () => {
        console.log("creating the preview image");
        if (stage !== undefined){
            const originalStage = saveHandler(stage);
            if (originalStage !== "Empty Stage"){
                const blobVar = await fetch(originalStage).then(res => res.blob());
                let file = new File([blobVar], 'preview.png');
                let formData = new FormData();
                formData.append('image', file);
                formData.append('name', sceneName + '_preview');
                console.log("before posting preview");
                postScenePreview(formData);
                //console.log(previewImageData.current);
            }
        }
    }


    /**
     * Method to create a FormData containing the background for the scene.
     * After fetching the background image successfully from the Konva stage, it starts the method for posting
     * it to the backend.
     */
    const createBackgroundImage = async () => {
        //console.log("creating the background image");
        const copyOfItems = items.slice();
        const duplicateOfStage = dupeStage(copyOfItems);
        const stageImage = saveHandler(duplicateOfStage);
        if (stageImage !== "Empty Stage") {
            //get the promise with the blob from the Konva Stage
            const blobVar = await fetch(stageImage).then(res => res.blob());
            //Create a file to send to the backend.
            let file = new File([blobVar], 'background.png');
            let formData = new FormData();
            formData.append('image', file);
            formData.append('name', sceneName + '_background');
            postSceneBackground(formData);
        }
    }



    /**
     * Method to handle the results of posting the background image of a scene.
     * After getting the ID returned by the backend, it will continue by calling
     * the method to create and post the preview image.
     * @param data The JSON returned by the backend.
     */
    const handlePostSceneBGSuccess = React.useCallback((jsonData: any) => {
        const data = jsonData as ResponseData;
        backgroundID.current = data.image_id;
        console.log("successful background post: " + backgroundID.current);
        createPreviewImage();
    }, []);

    /**
     * Method for displaying an error message for errors happening while posting the
     * background of the scene to the backend - this will also stop the communication chain.
     */
    const handlePostSceneBGError = React.useCallback((err: Error) => {
        props.reportError("Fehler beim Senden des Hintergrunds: " + err);
    }, []);

    /**
     * Method to post the backgroundImage FormData of the stage to the backend.
     * Used to store it separately. The backend should answer with the ID it used to store the image.
     */
    const postSceneBackground = React.useCallback((formData: FormData) => {
        //console.log("fetcher called");
        let url = "visuanalytics/image/scene"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
            },
            body: formData,
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handlePostSceneBGSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handlePostSceneBGError(err)
        }).finally(() => clearTimeout(timer));
    }, [])


    /**
     * Method to handle the results of posting the preview image of a scene.
     * After getting the ID returned by the backend, it will continue by calling
     * the method to post the exported scene data in JSON format.
     * @param data The JSON returned by the backend.
     */
    const handlePostScenePreviewSuccess = React.useCallback((jsonData: any) => {
        const data = jsonData as ResponseData;
        scenePreviewID.current = data.image_id;
        console.log("successful preview post: " + scenePreviewID.current)
        postSceneExport();
    }, []);

    /**
     * Method for displaying an error message for errors happening while posting the
     * preview of the scene to the backend - this will also stop the communication chain.
     */
    const handlePostScenePreviewError= React.useCallback((err: Error) => {
        props.reportError("Fehler beim Senden des Szenen-Preview: " + err);
    }, []);

    /**
     * Method to post the previewImage FormData of the stage to the backend.
     * Used to store it separately. The backend should answer with the ID it used to store the preview.
     */
    const postScenePreview = React.useCallback((formData: FormData) => {
        //console.log("fetcher called");
        let url = "visuanalytics/image/scene"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data\n"
            },
            body: formData,
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handlePostScenePreviewSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handlePostScenePreviewError(err)
        }).finally(() => clearTimeout(timer));
    }, [])


    /**
     * Method that takes all necessary data of the scene creation and
     * forms a JSON object as specified by the backend to post the scene to the backend.
     * @returns a JsonExport element
     */
    const createJSONExport = React.useCallback(() => {
        //empty array for all text and image elements (except background)
        let onlyTextAndImages : Array<CustomText|CustomImage> = [];
        //array for all datatext and dataimage elements, used for export
        let dataTextAndImages : Array<DataText|DataImage> = [];
        // push all images and texts in the onlyTextAndImages array
        for (let index = 0; index < items.length; index++) {
            if (items[index].id.startsWith('text')) {
                onlyTextAndImages.push(items[index] as CustomText);
            } else if (items[index].id.startsWith('image')) {
                onlyTextAndImages.push(items[index] as CustomImage);
            }
        }
        const base: BaseImg = {
            type: "pillow",
            path: sceneName + "_background.png",
            overlay: dataTextAndImages
        }
        const returnValue: JsonExport = {
            scene_name: sceneName,
            used_images: imageIDArray.current, //TODO: manage to update this array with the id of all posted images
            used_infoproviders: [props.infoProviderId],
            images:  base,
            scene_items: JSON.stringify(items),
        }
        // create dataText and dataImage elements for each element in
        // onlyTextAndImages, depending on their type
        onlyTextAndImages.forEach(element => {
            if (element.id.startsWith('text')) {
                if ('fontSize' in element) {
                    const itemToPush: DataText = {
                        description: "", //optional
                        type: "text",
                        anchor_point: "left",
                        pos_x: element.x, //item.x
                        pos_y: element.y, //item.y
                        color: element.color, //item.color
                        font_size: element.fontSize, //item.fontSize
                        font: "fonts/" + element.fontFamily + ".tff", // "fonts/{item.font}.ttf"
                        pattern: element.textContent // "Datum: {_req|api_key}"
                    }
                    dataTextAndImages.push(itemToPush);
                }
                console.log('text', element.id);
            } else if (element.id.startsWith('image')) {
                if ('image' in element) {
                    const itemToPush: DataImage = {
                        description: "",
                        type: "pillow",
                        pos_x: element.x, //X-Coordinate
                        pos_y: element.y, //Y-Coordinate
                        size_x: element.width * element.scaleX, //Breite optional
                        size_y: element.height * element.scaleY, //Höhe optional
                        color: "RGBA",
                        path: "string" //Diagrammname "image_name" : "" eventuell //TODO: include the path the backend specified here
                    }
                    dataTextAndImages.push(itemToPush);
                }
            }
        });
        return returnValue;
    }, []);

    /**
     * Method to handle the results of posting the exported scene to the backend.
     * When this handler is called, the process of posting everything necessary is finished.
     * Cleans up the sessionStorage and returns to the dashboard.
     * @param data The JSON returned by the backend.
     */
    const handleExportSceneSuccess = React.useCallback((jsonData: any) => {
        console.log("successful export post");
        clearSessionStorage();
        components?.setCurrent("dashboard")
    }, []);


    /**
     * Method for displaying an error message for errors happening while posting the
     * export of the scene to the backend.
     */
    const handleExportSceneError= React.useCallback((err: Error) => {
        props.reportError("Fehler beim Senden des Exports der Szene: " + err);
    }, []);


    /**
     * Method to post all settings for the Info-Provider made by the user to the backend.
     * The backend will use this data to create the desired Info-Provider.
     */
    const postSceneExport = React.useCallback(() => {
        //console.log("fetcher called");
        let url = "visuanalytics/scene"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: JSON.stringify(createJSONExport()),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.blob();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) handleExportSceneSuccess(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) handleExportSceneError(err)
        }).finally(() => clearTimeout(timer));
    }, [])

    /**
     * Method to save a stage as png file.
     * @returns an stage as a png image
     */
    const saveHandler = (currentStage : Konva.Stage) => {
        // create the picture of the stage
        let stageImage = ""
        if (currentStage !== null && currentStage !== undefined){
           stageImage = currentStage?.toDataURL();
        }
        // if the content of the stage is empty, the stageImage is set to empty stage
        if (stageImage === "") {
            stageImage = "Empty Stage";
        }
        return stageImage;
    }


    /**
     * Methods for posting images and background images to the backend by uploading them.
     */

    /**
     * Handler method for successful backend calls for posting new background images to the backend.
     * Takes the id of the created background image delivered by the backend and starts fetching the image
     * for this id to have it displayed in the list of background images.
     * @param jsonData The JSON object returned by the backend, containing the ID of the new image.
     */
    const postBackgroundImageSuccessHandler = (jsonData: any) => {
        console.log("background image post success handler");
        //get the object of the uploaded image from the FormData
        //const img = imageToUpload.get('image');
        const data = jsonData as ImageBackendData;
        //extract the backend id of the newly created image from the backend
        const imageId = data.image_id;
        console.log(imageId);
        // check if the image is valid
        //start fetching the new image from the backend
        props.fetchBackgroundImageById(imageId, handleBackgroundImageByIdSuccess, handleBackgroundImageByIdError);
        // reset the state containing the image to be uploaded
        //setImageToUpload(new FormData());
    }

    /**
     * Method that handles errors for posting a background image to the backend.
     * @param err The error sent by the backend.
     */
    const postBackgroundImageErrorHandler = (err: Error) => {
        props.reportError("Fehler beim Senden eines Hintergrundbildes: " + err);
    }

    /**
     * Method to POST a background image uploaded by the user to the backend.
     */
    const postBackgroundImage = (imageToUpload: FormData) => {
        console.log("post background image called");
        let url = "visuanalytics/image/backgrounds";
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {},
            body: imageToUpload,
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) postBackgroundImageSuccessHandler(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) postBackgroundImageErrorHandler(err)
        }).finally(() => clearTimeout(timer));
    }


    /**
     * Method that handles successful fetches of images from the backend
     * @param jsonData  The image as blob sent by the backend.
     */
    const handleBackgroundImageByIdSuccess = (jsonData: any) => {
        console.log("success while fetching");
        //create a URL for the blob image and update the list of images with it
        const arCopy = props.backgroundImageList.slice();
        arCopy.push(URL.createObjectURL(jsonData));
        props.setBackgroundImageList(arCopy);
    }

    /**
     * Method that handles errors for fetching an image from the backend.
     * @param err The error sent by the backend.
     */
    const handleBackgroundImageByIdError = (err: Error) => {
        props.reportError("Fehler beim Abrufen eines Hintergrundbildes: " + err);
    }



    /**
     * Handler method for successful backend calls for posting new images to the backend.
     * Takes the id of the created image delivered by the backend and starts fetching the image
     * for this id to have it displayed in the list of images.
     * @param jsonData The JSON object returned by the backend, containing the ID of the new image.
     */
    const postImageSuccessHandler = (jsonData: any) => {
        console.log("image post success handler");
        //get the object of the uploaded image from the FormData
        //const img = imageToUpload.get('image');
        const data = jsonData as ImageBackendData;
        //extract the backend id of the newly created image from the backend
        const imageId = data.image_id;
        const imageURL = data.path;
        console.log(imageId);
        // check if the image is valid
        //start fetching the new image from the backend
        props.fetchImageById(imageId, imageURL, handleImageByIdSuccess, handleImageByIdError);
        // reset the state containing the image to be uploaded
        //setImageToUpload(new FormData());
    }

    /**
     * Method that handles errors for posting an image to the backend.
     * @param err The error sent by the backend.
     */
    const postImageErrorHandler = (err: Error) => {
        props.reportError("Fehler beim Senden eines Bildes: " + err);
    }

    /**
     * Method to POST an Image uploaded by the user to the backend.
     */
    const postImage = (imageToUpload: FormData) => {
        console.log("post image called");
        let url = "visuanalytics/image/pictures";
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {},
            body: imageToUpload,
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if (isMounted.current) postImageSuccessHandler(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if (isMounted.current) postImageErrorHandler(err)
        }).finally(() => clearTimeout(timer));
    }


    /**
     * Method that handles successful fetches of images from the backend
     * @param jsonData  The image as blob sent by the backend.
     */
    const handleImageByIdSuccess = (jsonData: any, id: number, url: string) => {
        //create a URL for the blob image and update the list of images with it
        const arCopy = props.imageList.slice();
        arCopy.push({
            image_id: id,
            image_backend_path: url,
            image_blob_url: URL.createObjectURL(jsonData)
        });
        props.setImageList(arCopy);
    }

    /**
     * Method that handles errors for fetching an image from the backend.
     * @param err The error sent by the backend.
     */
    const handleImageByIdError = (err: Error) => {
        props.reportError("Fehler beim Abrufen eines Bildes: " + err);
    }


    /**
     * Method to handle a successful scene upload
     * @param jsonData backend response data
     */
    const handleSceneSuccess = (jsonData : any) => {
        console.log(jsonData);
    }


    /**
     * Method to handle a general error response
     * @param err the error
     */
    const handleError = (err : Error) => {
        console.log(err);
    }

    /**
     * Method to change the cursor
     * Gets called when an element drag is started.
     */
    const handleDragStart = () => {
        if (mainRef.current !== null){
            mainRef.current.style.cursor = "grabbing";
        }
    };

    /**
     * Method to handle the end of a drag event
     * Gets called when a drag event comes to an end
     * @param e drag event
     */
    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (mainRef.current !== null){
            mainRef.current.style.cursor = "grab";
        }

        const localItems = items.slice();
        const index = localItems.indexOf(selectedObject);
        if (e.target.getStage() !== null) {
            const selectedNode = e.target.getStage()!.findOne("." + selectedObject.id);

            const absPos = selectedNode.getAbsolutePosition();

            const objectCopy = {
                ...selectedObject,
                x: parseInt(absPos.x.toFixed(0)),
                y: parseInt(absPos.y.toFixed(0)),
            };
            localItems[index] = objectCopy;

            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);
            }, 200);
            currentItemX.current = localItems[index].x
            currentItemY.current = localItems[index].y

            setCurrentXCoordinate(parseInt(absPos.x.toFixed(0)));
            setCurrentYCoordinate(parseInt(absPos.y.toFixed(0)));
            return;
        }
    };

    /**
     * Method to handle the onMouseDown Event on the canvas
     * Gets called everytime the user clicks on the canvas.
     * @param e click event
     */
    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // get the name of the element that was clicked on
        const name = e.target.name();
        // if the element was the stage the following is getting executed
        if (e.target === e.target.getStage() || name === "background") {
            // setting the stage state, important for the export
            setStage(e.target.getStage()!);
            // remove the selectedItemName
            setSelectedItemName("");
            // check if the user is currently editing a text
            // complete the edit
            if (currentlyEditing){
                const localItems = items.slice();
                const index = items.indexOf(selectedObject);
                const objectCopy = {
                    ...selectedObject,
                    textContent: textEditContent,
                    currentlyRendered: true,
                };
                localItems[index] = objectCopy;
                setSelectedObject(objectCopy);
                setItems(localItems);
                setTextEditVisibility(false);
                setCurrentlyEditing(false);
            }
            // set the item selected to no item selected
            setItemSelected(false);
            // reset the delete text on the editor
            setDeleteText("Letztes Elem. entf.");
            return;
        }

        // if the user clicked on the transformer, the method will be interrupted
        const clickedOnTransformer =
            e.target.getParent().className === "Transformer";
        if (clickedOnTransformer) {
            return;
        }

        // if the user clicked on an element the following code will be executed
        if (name !== undefined && name !== '') {
            // set the selected item name to the name of the element
            setSelectedItemName(name);
            // now an item is selected
            setItemSelected(true);
            // adjust the delete button text to delete the current element
            setDeleteText("AUSGEW. ELEM. ENTF.");
            const id = name;
            const foundItem = items.find((i: any) => i.id === id);
            setSelectedObject(foundItem!);

            const index = items.indexOf(foundItem!);
            // depending on the type of element various variables will be adjusted
            if (items[index].id.startsWith("text")) {
                setCurrentFontColor(items[index].color);
                setCurrentFontFamily((items[index] as any).fontFamily);
                setCurrentFontSize((items[index] as any).fontSize);
                setCurrentTextWidth((items[index] as any).width);
            }
            if (!items[index].id.startsWith("image")) {
                setCurrentItemColor(items[index].color!);
            }
            currentItemRotation.current = items[index].rotation
            currentItemScaleX.current = items[index].scaleX
            currentItemScaleY.current = items[index].scaleY
            currentItemX.current = items[index].x
            currentItemY.current = items[index].y
            setCurrentXCoordinate(items[index].x);
            setCurrentYCoordinate(items[index].y);
            setCurrentItemHeight(items[index].height);
            setCurrentItemWidth(items[index].width);
        }
    };

    /**
     * Helpermethod to increment the counter and reset the type of element
     */
    const incrementCounterResetType = () => {
        setSelectedType("");
        setItemCounter(itemCounter + 1);
    }
    /**
     * Method to handle the onClick Event on the canvas
     * Gets called whenever the user clicks on the canvas to add an item.
     * @param e onClick Event
     */
    const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {

        const local = getRelativePointerPosition(e);
        if (local === undefined) {
            return;
        }
        const localX: number = local.x;
        const localY: number = local.y;

        switch (selectedType) {
            case "":
                return;
            case "Circle": {
                let nextColor = Konva.Util.getRandomColor();
                const arCopy = items.slice();
                const item: CustomCircle = {
                    x: parseInt(localX.toFixed(0)),
                    y: parseInt(localY.toFixed(0)),
                    radius: 50,
                    id: 'circle-' + itemCounter.toString(),
                    color: nextColor,
                    width: 100,
                    height: 100,
                    rotation: 0,
                    baseWidth: 100,
                    baseHeight: 100,
                    scaleX: 1,
                    scaleY: 1,

                }
                arCopy.push(item);
                setItems(arCopy);
                setCurrentItemColor(nextColor);
                incrementCounterResetType();
                return;
            }
            case "Rectangle": {
                let nextColor = Konva.Util.getRandomColor();
                const arCopy = items.slice();
                arCopy.push({
                    x: parseInt(localX.toFixed(0)),
                    y: parseInt(localY.toFixed(0)),
                    width: 100,
                    height: 100,
                    id: 'rect-' + itemCounter.toString(),
                    color: nextColor,
                    rotation: 0,
                    baseWidth: 100,
                    baseHeight: 100,
                    scaleX: 1,
                    scaleY: 1,

                } as CustomRectangle);
                setItems(arCopy);
                setCurrentItemColor(nextColor);
                incrementCounterResetType();
                return;
            }

            case "Line": {
                const arCopy = items.slice();
                arCopy.push({
                    x: parseInt(localX.toFixed(0)),
                    y: parseInt(localY.toFixed(0)),
                    id: 'line-' + itemCounter.toString(),
                    color: "black",
                    strokeWidth: 10,
                    rotation: 0,
                    width: 100,
                    height: 100,
                    baseWidth: 100,
                    baseHeight: 100,
                    scaleX: 1,
                    scaleY: 1,

                } as CustomLine);
                setItems(arCopy);
                incrementCounterResetType();
                return;
            }

            case "Star": {
                let nextColor = Konva.Util.getRandomColor();
                const arCopy = items.slice();
                arCopy.push({
                    x: parseInt(localX.toFixed(0)),
                    y: parseInt(localY.toFixed(0)),
                    numPoints: 5,
                    id: 'star-' + itemCounter.toString(),
                    color: nextColor,
                    rotation: 0,
                    width: 200,
                    height: 100,
                    baseWidth: 200,
                    baseHeight: 100,
                    scaleX: 1,
                    scaleY: 1,

                } as CustomStar);
                setItems(arCopy);
                setCurrentItemColor(nextColor);
                incrementCounterResetType();
                return;
            }
            case "Text": {
                const arCopy = items.slice();
                arCopy.push({
                    x: parseInt(localX.toFixed(0)),
                    y: parseInt(localY.toFixed(0)),
                    id: 'text-' + itemCounter.toString(),
                    textContent: currentTextContent,
                    width: currentTextWidth,
                    rotation: 0,
                    fontFamily: currentFontFamily,
                    fontSize: currentFontSize,
                    color: currentFontColor,
                    height: 20,
                    padding: 2,
                    currentlyRendered: true,
                    baseWidth: 100,
                    baseHeight: 100,
                    scaleX: 1,
                    scaleY: 1,
                } as CustomText);
                setItems(arCopy);
                setCurrentTextWidth(200);
                incrementCounterResetType();
                return;
            }
        }
    }

    /**
     * different method to add an image to the canvas
     * @param image the image to be added
     * @param id the backend ID of the image to be added
     * @param path the path to the image located in the backend
     * @param index the index of the image in the frontend list of images
     */
    const addImageElement = (image : HTMLImageElement, id: number, path: string, index: number) => {
        let obj : CustomImage = {
            id: 'image-' + itemCounter.toString(),
            x: 0,
            y: 0,
            rotation: 0,
            image: image,
            imageId: id,
            imagePath: path,
            index: index,
            width: image.width,
            height: image.height,
            baseWidth: image.width,
            baseHeight: image.height,
            scaleX: 1,
            scaleY: 1,
            color: "#000000"
        }
        // if its bigger than the width / height of the canvas, adjust the size of the image
        while (obj.width * obj.scaleX > 960) {
            obj.scaleX *= 0.5;
        }
        while (obj.height * obj.scaleY > 540){
            obj.scaleY *= 0.5;
        }
        const arCopy = items.slice();
        arCopy.push(obj)
        setItems(arCopy);
        incrementCounterResetType();
    }

    /**
     * Method to handle the change of the X Coordinate of an element
     * Gets called whenever the value of the corresponding field changes
     */
    const handleCoordinatesXChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCurrentXCoordinate(parseInt(event.target.value))
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        const objectCopy = {
            ...selectedObject,
            x: parseInt(event.target.value),
        };
        localItems[index] = objectCopy;
        setSelectedObject(objectCopy);
        setItems(localItems);
    }

    /**
     * Method to handle the change of the Y Coordinate of an element
     * Gets called whenever the value of the corresponding field changes
     */
    const handleCoordinatesYChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCurrentYCoordinate(parseInt(event.target.value));
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        const objectCopy = {
            ...selectedObject,
            y: parseInt(event.target.value),
        };
        localItems[index] = objectCopy;
        setSelectedObject(objectCopy);
        setItems(localItems);
    }

    /**
     * Method to handle the change of the value of a text field
     * Gets called while editing a text field
     */
    const handleTextEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextEditContent(e.target.value);
    };

    /**
     * Method to handle the double click on a text element
     */
    const handleTextDblClick = () => {
        // create a copy of the text element and replace the original one with adjusted variables
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        let backup: any = items[index];
        const objectCopy = {
            ...selectedObject,
            currentlyRendered: false,
            textContent: "",
        } as CustomText;
        localItems[index] = objectCopy;
        // set the states to place the edit field and make the text invisible
        setSelectedItemName("");
        setSelectedObject(objectCopy);
        setItems(localItems);
        setTextEditContent(backup.textContent);
        setTextEditVisibility(true);
        setTextEditX(objectCopy.x);
        setTextEditY(objectCopy.y);
        setTextEditWidth(objectCopy.width);
        setTextEditFontSize(objectCopy.fontSize);
        setTextEditFontFamily(objectCopy.fontFamily);
        setTextEditFontColor(objectCopy.color);
        setCurrentlyEditing(true);
    };

    /**
     * Method to handle keypresses in an editing area
     */
    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                textContent: textEditContent,
                currentlyRendered: true,
            };
            localItems[index] = objectCopy;
            setSelectedObject(objectCopy);
            setItems(localItems);
            setTextEditVisibility(false);
            setCurrentlyEditing(false);
        }
    };

    /**
     * Method to clear the canvas but keep removed elements
     */
    const clearCanvas = () => {
        if (mainRef.current !== null){
            mainRef.current.style.cursor = "crosshair";
        }
        setCurrentXCoordinate(0);
        setCurrentYCoordinate(0);
        setCurrentItemColor("#000000");
        setBackGroundColor("#FFFFFF");
        setCurrentFontColor("#000000");
        setItems([]);
        setSelectedItemName("");
        setSelectedType("");
        setTextEditContent("");
        setItemCounter(0);
        setCurrentBGColor("#FFFFFF");
        setRecentlyRemovedItems(items);
        setCurrentFontFamily("Arial");
        setCurrentFontSize(20);
        setCurrentTextWidth(200);
        setStepSize(5);
        console.clear();
    }

    /**
     * Method to handle the change of the stepsize for the x and y coordinates
     */
    const handleStepSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setStepSize(parseInt(event.target.value));
    }

    /**
     * Method to get the relative position of the pointer to the stage
     * @returns the position of the pointer
     */
    const getRelativePointerPosition = (e: any) => {
        let pos = e.target.getStage().getPointerPosition();
        return (pos);
    }

    /**
     * Method to select the type of element, that will get added next
     */
    const selectType = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (mainRef.current !== null){
            mainRef.current.style.cursor = "crosshair";
        }
        setSelectedType(event.target.value);
    }

    /**
     * Method to delete an element
     * Gets called whenever the corresponding button is pressed
     */
    const deleteItem = () => {
        // create a copy of the recentlyremoveditems array
        const lastElem = [...recentlyRemovedItems];
        if (!itemSelected) {
            //delete the image from the list of used IDs
            if(items[items.length-1].id.startsWith("image")) {
                const castedImage = items[items.length-1] as CustomImage;
                imageIDArray.current = imageIDArray.current.filter((imageID) => {
                    return imageID != castedImage.imageId;
                })
            }
            if (items.length > 0) {
                // remove the last element from the items array
                const poppedItem = items.pop();
                // push the last element into the recentlyremoveditems array
                if (poppedItem !== undefined) {
                    lastElem.push(poppedItem);
                }
            }
            setRecentlyRemovedItems(lastElem);
            // decrement the counter of element
            setItemCounter(itemCounter - 1);
        } else {
            // get the index of the selected element
            const index = items.indexOf(selectedObject);
            //delete the image from the list of used IDs
            if(items[index].id.startsWith("image")) {
                const castedImage = items[index] as CustomImage;
                imageIDArray.current = imageIDArray.current.filter((imageID) => {
                    return imageID != castedImage.imageId;
                })
            }
            // push the element into the lastElem array and remove it from the items array
            if (items.length > 0 && selectedObject !== undefined) {
                lastElem.push(items[index]);
                items.splice(index, 1);
            }
            setRecentlyRemovedItems(lastElem);
            setItemSelected(false);
            setItemCounter(itemCounter - 1);
            setDeleteText("Letztes Elem. entf.");
        }
    }

    /**
     * Method to undo the last delete operation
     */
    const undo = () => {
        const lastElem = [...recentlyRemovedItems];
        if (recentlyRemovedItems.length > 0) {
            const poppedItem = lastElem.pop();
            if (poppedItem !== undefined) {
                const arCopy = items.slice();
                arCopy.push(poppedItem);
                setItems(arCopy);
                // if it is an image, add it to the list of used image ids again
                if(poppedItem.id.startsWith("image")) {
                    const castedImage = poppedItem as CustomImage;
                    imageIDArray.current.push(castedImage.imageId);
                }
            }
        }
        setRecentlyRemovedItems(lastElem);
    }

    /**
     * Method to duplicate an element.
     * Gets called whenever the corresponding button is pressed.
     * Both elements are seperate with their own properties.
     * Changing one element will NOT change the other element after the duplication has happened.
     */
    const dupe = () => {
        if (itemSelected) {
            const parts = selectedItemName.split('-');
            const localItems = items.slice();
            localItems.push({
                ...selectedObject,
                id: parts[0] + '-' + Math.random() * Math.random(),
                rotation: currentItemRotation.current,
                scaleX: currentItemScaleX.current,
                scaleY: currentItemScaleY.current,
                x: currentItemX.current,
                y: currentItemY.current,
            });
            setItems(localItems);
        }
    }

    /**
     * Method to handle the start of a transform event
     */
    const handleTransformStart = (e : any) => {
        console.log("Transform Started ", e);
    }

    /**
     * Method to handle the end of a transform event
     * @param e Transform Event
     */
    const handleTransformEnd = (e: any) => {
        //get the position, transformation and rotation of the transformed element
        const selectedNode = e.target.getStage().findOne("." + selectedItemName);
        const absPos = selectedNode.getAbsolutePosition();
        const absTrans = selectedNode.getAbsoluteScale();
        const absRot = selectedNode.getAbsoluteRotation();
        // apply the changes
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        localItems[index] = {
            ...selectedObject,
            x: parseInt((absPos.x).toFixed(0)),
            y: parseInt((absPos.y).toFixed(0)),
            scaleX: absTrans.x,
            scaleY: absTrans.y,
            rotation: absRot,
        };
        setItems(localItems);
        currentItemRotation.current = absRot;
        currentItemScaleX.current = absTrans.x;
        currentItemScaleY.current = absTrans.y;
        currentItemX.current = parseInt((absPos.x).toFixed(0));
        currentItemY.current = parseInt((absPos.y).toFixed(0));
        setCurrentXCoordinate(parseInt((absPos.x).toFixed(0)));
        setCurrentYCoordinate(parseInt((absPos.y).toFixed(0)));

    }

    /**
     * Method to handle the change of a text elements font family
     */
    const changeFontFamily = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected && selectedItemName.startsWith('text')) {
            const fontFamily = (event.target.value);
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                fontFamily: fontFamily,
            };
            localItems[index] = objectCopy;

            setItems(localItems);
            setSelectedObject(objectCopy);
            setCurrentFontFamily(fontFamily);
        }
    }

    /**
     * Method to handle the change of a text elements font size
     */
    const changeFontSize = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected && selectedItemName.startsWith('text')) {
            const fontSize = (event.target.value);
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                fontSize: parseInt(fontSize),
            };
            localItems[index] = objectCopy;

            setItems(localItems);
            setSelectedObject(objectCopy);
            setCurrentFontSize(parseInt(fontSize));
        }
    }

    /**
     * Method to handle the change of a text elements font color
     */
    const changeFontColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        delayedFontColorChange(event.target.value)
    }

    /**
     * Method to handle the change of a text elements width
     */
    const changeTextWidth = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected && selectedItemName.startsWith('text')) {
            const textWidth = parseInt(event.target.value)
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                width: textWidth,
            };
            localItems[index] = objectCopy;
            setItems(localItems);
            setSelectedObject(objectCopy);
            setCurrentTextWidth(textWidth);
        }
    }

    /**
     * Method to change the color of an element selected by a user
     */
    const switchItemColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        delayedItemColorChange(event.target.value)
    }

    /**
     * Method to change the color of an element with a delay to reduce frontend lag
     * @param color is the new color
     */
    const delayedItemColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            if (itemSelected) {
                const localItems = items.slice();
                const index = localItems.indexOf(selectedObject)

                const objectCopy = {
                    ...selectedObject,
                    color: color,
                };

                localItems[index] = objectCopy;
                setCurrentItemColor(color);
                setSelectedObject(objectCopy);
                setItems(localItems);
            }
        }, 200);
    }

    /**
     * Method to change the color of a text elements font with a delay to reduce frontend lag
     * @param color is the new color
     */
    const delayedFontColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            if (itemSelected && selectedItemName.startsWith('text')) {
                const fontColor = (color);
                const localItems = items.slice();
                const index = items.indexOf(selectedObject);
                const objectCopy = {
                    ...selectedObject,
                    color: fontColor,
                };
                localItems[index] = objectCopy;
                setItems(localItems);
                setSelectedObject(objectCopy);
                setCurrentFontColor(fontColor);
            }
        }, 200);
    }

    /**
     * Method to change the background color of the canvas to reduce frontend lag
     * @param color is the new color
     */
    const delayedBackgroundColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            setCurrentBGColor(color);
        }, 200);
    }

    /**
     * Method to change the background color incase the background is set to be a color
     */
    const switchBGColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        delayedBackgroundColorChange(event.target.value);
    }

    /**
     * Method to change the mouse cursor if the user hovers over a selected element
     */
    const mouseOver = () => {
        if (itemSelected) {
            if (mainRef.current !== null){
                mainRef.current.style.cursor = "grab";
            }
        }
    }

    /**
     * Method to change cursor back to default when the user doesn't hover an element anymore
     */
    const mouseLeave = () => {
        if (mainRef.current !== null){
            mainRef.current.style.cursor = "crosshair";
        }
    }

    /**
     * Method to stop the user from using the coloring options on elements that do not use the coloring options
     * @returns true or false depending on the selected item
     */
    const disableColor = (): boolean => {
        if (selectedItemName.startsWith('text')){
            return true;
        }
        return (!itemSelected) ;
    }

    /**
     * Method to disallow users from changing the font color when no text element is selected
     */
    const disableFontColor = (): boolean => {
        if (itemSelected) {
            return selectedItemName.startsWith('text');
        } else {
            return false;
        }
    }

    /**
     * Method to handle the selection of data from the list of available api data.
     * @param item The item selected by the user
     * @param handlingHistorizedItem changes behaviour when the element is historized
     */

    const handleItemSelect = (item: string, handlingHistorizedItem: boolean) => {
        // if no item is selected, creates a new text element and adds it to the canvas
        if (!itemSelected){
            const arCopy = items.slice();
            arCopy.push({
                x: 20,
                y: 20,
                id: 'text-' + itemCounter.toString(),
                textContent: (handlingHistorizedItem && intervalToUse !== undefined) ? '{' + item + '{' + intervalToUse.toString() + '}}' : '{' + item + '}',
                width: 200,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                fontFamily: currentFontFamily,
                fontSize: currentFontSize,
                color: currentFontColor,
                height: 20,
                padding: 2,
                currentlyRendered: true,
                baseWidth: 200,
                baseHeight: 20,
            } as CustomText);
            setItems(arCopy);
            setCurrentTextWidth(200);
            setTextEditContent(item);
            setItemCounter(itemCounter + 1);
        // otherwise add the content to a selected text field
        } else {
            console.log(selectedItemName);
            if (selectedItemName.startsWith('text') && !currentlyEditing){
                console.log('Text selected');
                const localItems = items.slice();
                const index = items.indexOf(selectedObject);
                const objectCopy = {
                    ...selectedObject,
                    textContent: (selectedObject as CustomText).textContent + ((handlingHistorizedItem && intervalToUse !== undefined) ? '{' + item + '{' + intervalToUse.toString() + '}}' : '{' + item + '}')
                };
                localItems[index] = objectCopy;
                setItems(localItems);
                setSelectedObject(objectCopy);
            }
            if (currentlyEditing){
                setTextEditContent(textEditContent + ' {' + item + '}');
            }
        }
    }

    /**
     * Method that renders the list items to be displayed in the list of all available data.
     * @param item The item to be displayed
     */
    const renderListItem = (item: string) => {
        return (
            <ListItem key={item}>
                <Button onClick={() => handleItemSelect(item, false)}>
                    {item}
                </Button>
            </ListItem>
        )
    }

    /**
     * Prepares the states for showing the clicked historized element
     * After preparation a dialog opens in which the user will be able to finish the adding of a historized element
     * @param item
     * @param interval
     */
    const handleClickOnHistorized = (item: string, interval: string) => {
        setSelectedHistorizedElement(item);
        setSelectedInterval(interval);
        setShowHistorizedDialog(true);
    }

    const cancelHistorizedAdding = () => {
        setSelectedInterval("");
        setSelectedHistorizedElement("");
        setShowHistorizedDialog(false);
    }

    /**
     * Renders the list entry of one historized element
     * Used to insert historized data into the scene
     * @param item The name of the item
     * @param interval The interval set for the element
     */
    const renderHistorizedItem = (item: string, interval: string) => {
        return (
            <ListItem key={item}>
                <Button onClick={() => handleClickOnHistorized(item, interval)}>
                    {item}
                </Button>
            </ListItem>
        )
    }

    /**
     * Method to handle the click on an image loaded form the backend
     * @param src the image URL (blob) of the selected image
     * @param id the backend ID of the selected image
     * @param path the path/URL of the selected image in the backend
     * @param index index of the image in the frontend list of all images
     */
    const handleImageClick = (src : string, id: number, path: string, index: number) => {
        //create the image object for the image to be displayed
        let image = new window.Image();
        image.src = src;
        //push the id to the array of used images
        imageIDArray.current.push(id);
        addImageElement(image, id, path, index);
    }

    const handleBackgroundImageClick = (src : string, index : number) => {
        let img = new window.Image();
        img.src = props.backgroundImageList[index];
        setBackgroundImage(img);
        setBackgroundImageIndex(index);
        setBackGroundType("IMAGE");
        setBackGroundColorEnabled(false);
    }


    /**
     * Method to handle if a user unchecks the backgroundcolor checkbox
     */
    const handleBackground = () => {
        backGroundColorEnabled ? setBackGroundColorEnabled(false) : setBackGroundColorEnabled(true);
        if (backGroundColorEnabled) {
            setCurrentBGColor("#FFFFFF");
            setBackGroundColor(currentBGColor);
            setBackGroundType("IMAGE");
            setBackGroundColorEnabled(false);
            console.log("backgroundcolor should be disabled");
        } else {
            console.log("backgroundcolor is currently disabled");
            setCurrentBGColor(backGroundColor);
            setBackGroundType("COLOR");
            setBackGroundColorEnabled(true);
        }
    }

    /**
     * Method to handle the change of the width of an item
     * @param event The onChange event
     */
    const handleItemWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        const objectCopy = {
            ...selectedObject,
            width: event.target.valueAsNumber
        };
        localItems[index] = objectCopy;
        setItems(localItems);
        setSelectedObject(objectCopy);
        setCurrentItemWidth(event.target.valueAsNumber);

    }

    /**
     * Method to handle the change of the height of an item
     * @param event The onChange event
     */
    const handleItemHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        const objectCopy = {
            ...selectedObject,
            height: event.target.valueAsNumber,
        };
        localItems[index] = objectCopy;
        console.log(objectCopy)
        setItems(localItems);
        setSelectedObject(objectCopy);
        setCurrentItemHeight(event.target.valueAsNumber);

    }




    /**
     * Method to handle the change of the input element for the image upload
     * @param event ChangeEvent of the HTMLInputElement
     */
    const handleFileUploadChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null){
            let formData = new FormData();
            let name = event.target.files[0].name.split('.');
            formData.append('image', event.target.files[0]);
            formData.append('name', name[0]);
            postImage(formData);
        }
    }

    /**
     * Method to handle the "Upload image" button
     */
    const handleFileUploadClick = () => {
        if (uploadReference.current !== null){
            uploadReference.current.click();
        }
    }

    /**
     * Method to handle the change event of the background input element
     * Creates a new FormData element to be uploaded
     * @param event ChangeEvent
     */
    const handleBackgroundUploadChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files !== undefined) {
            let formData = new FormData();
            let name = event.target.files[0].name.split('.');
            formData.append('image', event.target.files[0]);
            console.log(formData.get("image"));
            formData.append('name', name[0]);
            postBackgroundImage(formData);
        }
    }

    /**
     * Method to click the input element through a button
     */
    const handleBackgroundUploadClick = () => {
        if (backgroundUploadReference.current !== null){
            backgroundUploadReference.current.click();
        }
    }

    /**
     * Method to render the scene editor
     */

    return (

        <StepFrame
            heading={"Szenen-Editor"}
            hintContent={hintContents.typeSelection}
            large={"xl"}
        >
            <Grid item container justify={"center"}>
                <Grid item container xs={7}>
                    <Grid item container xs={12} justify={"space-evenly"}>
                        <Grid item>
                            <TextField className={classes.title} margin={"normal"} variant={"outlined"}
                                       color={"primary"} label={"Szenen-Titel"}
                                       value={sceneName}
                                       onChange={event => (setSceneName(event.target.value.replace(' ', '_')))}>
                            </TextField>
                        </Grid>
                        <Grid item>
                            <Button size={"large"} variant={"contained"} className={classes.topButtons}
                                    onClick={() => setBackDialogOpen(true)}>
                                Zurück
                            </Button>
                        </Grid>
                        <Grid item className={classes.blockableButtonSecondary}>
                            <Button size={"large"} color="secondary" variant={"contained"} className={classes.saveButton}
                                    onClick={() => saveButtonHandler()} disabled={sceneName === ""}>
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <div ref={mainRef} className={classes.editorMain} id="main">
                            <Stage
                                width={960}
                                height={540}
                                className={classes.editorCanvas}
                                onMouseDown={handleStageMouseDown}
                            >
                                <Layer>
                                    {backGroundType === "COLOR" &&
                                    <Rect
                                        name="background"
                                        fill={currentBGColor}
                                        width={960}
                                        height={540}
                                        onClick={(e: any) => handleCanvasClick(e)}
                                        onMouseDown={handleStageMouseDown}
                                    />
                                    }
                                    {backGroundType === "IMAGE" &&
                                    <Image
                                        name="background"
                                        width={960}
                                        height={540}
                                        onClick={(e: any) => handleCanvasClick(e)}
                                        image={backgroundImage}
                                        onMouseDown={handleStageMouseDown}
                                    />
                                    }
                                    <Group>
                                        {items.map((item: any) => (
                                            (item.id.startsWith('circle') &&
                                                <Circle
                                                    key={item.id}
                                                    name={item.id}
                                                    draggable
                                                    x={item.x}
                                                    y={item.y}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    fill={item.color}
                                                    radius={item.radius}
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    rotation={item.rotation}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 960 - item.radius) {
                                                            pos.x = 960 - item.radius
                                                        }
                                                        if (pos.x < 0 + item.radius) {
                                                            pos.x = 0 + item.radius
                                                        }
                                                        if (pos.y > 540 - item.radius) {
                                                            pos.y = 540 - item.radius
                                                        }
                                                        if (pos.y < item.radius) {
                                                            pos.y = item.radius
                                                        }
                                                        return pos;
                                                    }}
                                                />) || (
                                                item.id.startsWith('rect') &&
                                                <Rect
                                                    key={item.id}
                                                    name={item.id}
                                                    draggable
                                                    x={item.x}
                                                    y={item.y}
                                                    fill={item.color}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    width={item.width}
                                                    height={item.height}
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    rotation={item.rotation}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 960 - item.width) {
                                                            pos.x = 960 - item.width
                                                        }
                                                        if (pos.x < 0) {
                                                            pos.x = 0
                                                        }
                                                        if (pos.y > 540 - item.height) {
                                                            pos.y = 540 - item.height
                                                        }
                                                        if (pos.y < 0) {
                                                            pos.y = 0
                                                        }
                                                        return pos;
                                                    }}
                                                />) || (
                                                item.id.startsWith('line') &&
                                                <Line
                                                    key={item.id}
                                                    name={item.id}
                                                    draggable
                                                    x={item.x}
                                                    y={item.y}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    points={
                                                        [0, 0, 100, 0, 100, 100]
                                                    }
                                                    stroke={item.color}
                                                    closed
                                                    fill={item.color}
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    rotation={item.rotation}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 860) {
                                                            pos.x = 860
                                                        }
                                                        if (pos.x < 0) {
                                                            pos.x = 0
                                                        }
                                                        if (pos.y > 440) {
                                                            pos.y = 440
                                                        }
                                                        if (pos.y < 0) {
                                                            pos.y = 0
                                                        }
                                                        return pos;
                                                    }}
                                                />) || (
                                                item.id.startsWith('star') &&
                                                <Star
                                                    numPoints={5}
                                                    innerRadius={50}
                                                    outerRadius={100}
                                                    key={item.id}
                                                    name={item.id}
                                                    draggable
                                                    x={item.x}
                                                    y={item.y}
                                                    fill={item.color}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    width={item.width}
                                                    radius={item.radius}
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    rotation={item.rotation}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 860) {
                                                            pos.x = 860
                                                        }
                                                        if (pos.x < 100) {
                                                            pos.x = 100
                                                        }
                                                        if (pos.y > 440) {
                                                            pos.y = 440
                                                        }
                                                        if (pos.y < 100) {
                                                            pos.y = 100
                                                        }
                                                        return pos;
                                                    }}
                                                />) || (
                                                item.id.startsWith('text') &&
                                                <Text
                                                    key={item.id}
                                                    name={item.id}
                                                    text={item.textContent}
                                                    x={item.x}
                                                    y={item.y}
                                                    width={item.width}
                                                    draggable
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    onDblClick={() => handleTextDblClick()}
                                                    fontSize={item.fontSize}
                                                    fontFamily={item.fontFamily}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    rotation={item.rotation}
                                                    fill={item.color}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    padding={item.padding}
                                                    style={item.currentlyRendered ? {
                                                        display: "block",
                                                    } : {
                                                        display: "none",
                                                    }}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 960 - item.width) {
                                                            pos.x = 960 - item.width
                                                        }
                                                        if (pos.x < 0) {
                                                            pos.x = 0
                                                        }
                                                        if (pos.y > 540 - item.height) {
                                                            pos.y = 540 - item.height
                                                        }
                                                        if (pos.y < 0) {
                                                            pos.y = 0
                                                        }
                                                        return pos;
                                                    }}
                                                />) || (
                                                item.id.startsWith('image') &&
                                                <Image
                                                    key={item.id}
                                                    id={item.id}
                                                    name={item.id}
                                                    x={item.x}
                                                    y={item.y}
                                                    width={item.width}
                                                    height={item.height}
                                                    scaleX={item.scaleX}
                                                    scaleY={item.scaleY}
                                                    image={item.image}
                                                    draggable
                                                    onDragStart={handleDragStart}
                                                    onDragEnd={handleDragEnd}
                                                    onTransformStart={handleTransformStart}
                                                    onTransformEnd={handleTransformEnd}
                                                    rotation={item.rotation}
                                                    onMouseOver={mouseOver}
                                                    onMouseLeave={mouseLeave}
                                                    dragBoundFunc={function (pos: Konva.Vector2d) {
                                                        if (pos.x > 960 - item.width * item.scaleX) {
                                                            pos.x = 960 - item.width * item.scaleX
                                                        }
                                                        if (pos.x < 0) {
                                                            pos.x = 0
                                                        }
                                                        if (pos.y > 540 - item.height * item.scaleY) {
                                                            pos.y = 540 - item.height * item.scaleY
                                                        }
                                                        if (pos.y < 0) {
                                                            pos.y = 0
                                                        }
                                                        if (item.width * item.scaleX > 960) {
                                                            item.scaleX *= 0.5;
                                                        }
                                                        if (item.height * item.scaleY > 540){
                                                            item.scaleY *= 0.5;
                                                        }
                                                        return pos;
                                                    }}
                                                />)
                                        ))}
                                        <TransformerComponent
                                            selectedShapeName={selectedItemName}
                                        />
                                    </Group>
                                </Layer>
                            </Stage>
                        </div>
                        <textarea value={textEditContent} className={classes.editorText}
                                  style={{
                                      display: textEditVisibility ? "block" : "none",
                                      top: textEditY + "px",
                                      left: textEditX + "px",
                                      marginTop: "20%",
                                      marginLeft: "6%",
                                      width: textEditWidth + "px",
                                      fontSize: textEditFontSize + "px",
                                      fontFamily: textEditFontFamily,
                                      color: textEditFontColor,
                                      border: "2px solid primary.main",
                                      borderRadius: "15px",
                                  }} onChange={e => handleTextEdit(e)} onKeyDown={e => handleTextareaKeyDown(e)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box border={5} borderRadius={5}
                             className={classes.lowerButtons}>
                            <Grid item container xs={12} justify={"center"} spacing={10}>
                                <Grid container item xs={3}>
                                    <Grid item>
                                        <Button
                                            className={classes.button}
                                            onClick={clearCanvas}
                                        >
                                            ZURÜCKSETZEN
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography className={classes.labels} variant={"button"}>
                                            Farbe:
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <input className={classes.buttonColor}
                                               id="itemColor"
                                               type={"color"}
                                               onChange={switchItemColor}
                                               disabled={disableColor()}
                                               value={currentItemColor}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            className={classes.labels}
                                            variant={"button"}
                                        >
                                            Schriftfarbe:
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <input className={classes.buttonColor}
                                               id="fontColor"
                                               type="color"
                                               onChange={(e) => changeFontColor(e)}
                                               disabled={!disableFontColor()}
                                               value={currentFontColor}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button className={classes.button} id="del"
                                            onClick={deleteItem}>{deleteText}</Button><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="coordinatesX"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 0, max: 960, step: stepSize.toString(),
                                            }
                                        }}
                                        onChange={handleCoordinatesXChange}
                                        disabled={!itemSelected}
                                        label={"X Koordinate"}
                                        value={currentXCoordinate}
                                    /><br/><br/>
                                    <TextField id="fontType" onChange={(e) => changeFontFamily(e)}
                                               className={classes.selection} label={"Schriftart"}
                                               value={currentFontFamily}
                                               disabled={!selectedItemName.startsWith('text')} select>
                                        <MenuItem value={"Arial"} style={{"fontFamily": "arial"}}>Arial</MenuItem>
                                        <MenuItem value={"veranda"}
                                                  style={{"fontFamily": "verdana"}}>veranda</MenuItem>
                                        <MenuItem value={"Tahoma"}
                                                  style={{"fontFamily": "Tahoma"}}>Tahoma</MenuItem>
                                        <MenuItem value={"Georgia"}
                                                  style={{"fontFamily": "Georgia"}}>Georgia</MenuItem>
                                        <MenuItem value={"Times New Roman"}
                                                  style={{"fontFamily": "Times New Roman"}}>Times New
                                            Roman</MenuItem>
                                    </TextField><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="widthOfItem"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 1, max: 960,
                                            }
                                        }}
                                        onChange={handleItemWidthChange}
                                        disabled={!selectedItemName.startsWith('rect')}
                                        label={"Breite"}
                                        value={currentItemWidth}
                                    /><br/><br/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button className={classes.button} id="undo" onClick={undo}
                                            disabled={recentlyRemovedItems.length === 0}> RÜCKGÄNGIG
                                        MACHEN </Button><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="coordinatesY"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 0, max: 540, step: stepSize.toString(),
                                            }
                                        }}
                                        onChange={handleCoordinatesYChange}
                                        disabled={!itemSelected}
                                        label={"Y Koordinate"}
                                        value={currentYCoordinate}
                                    /><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="fontSize"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 1, max: 144, step: 1,
                                            }
                                        }}
                                        onChange={(e) => changeFontSize(e)}
                                        label={"Schriftgröße (PX)"}
                                        value={currentFontSize}
                                        disabled={!selectedItemName.startsWith('text')}
                                    /><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="heigthOfItem"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 1, max: 960,
                                            }
                                        }}
                                        onChange={handleItemHeightChange}
                                        disabled={!selectedItemName.startsWith('rect')}
                                        label={"Höhe"}
                                        value={currentItemHeight}
                                    /><br/><br/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button className={classes.button} onClick={dupe} disabled={!itemSelected}> Klonen </Button><br/><br/>
                                    <TextField id="stepSizeOptions" onChange={(e) => handleStepSizeChange(e)}
                                               value={stepSize} className={classes.selection} select
                                               label={"Sprunggröße"} disabled={!itemSelected}>
                                        <MenuItem value={1}> 1 </MenuItem>
                                        <MenuItem value={5}> 5 </MenuItem>
                                        <MenuItem value={10}> 10 </MenuItem>
                                        <MenuItem value={20}> 20 </MenuItem>
                                        <MenuItem value={25}> 25 </MenuItem>
                                        <MenuItem value={50}> 50 </MenuItem>
                                        <MenuItem value={75}> 75 </MenuItem>
                                        <MenuItem value={100}> 100 </MenuItem>
                                        <MenuItem value={250}> 250 </MenuItem>
                                    </TextField><br/><br/>
                                    <TextField
                                        className={classes.buttonNumber}
                                        id="textWidth"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                min: 200, max: 540, step: 1,
                                            }
                                        }}
                                        onChange={(e) => changeTextWidth(e)}
                                        label={"Textbreite (PX)"}
                                        value={currentTextWidth}
                                        disabled={!selectedItemName.startsWith('text')}
                                    /><br/><br/>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Grid item xs={12} className={classes.rightButtons}>
                        <Grid item>
                            <Typography variant={"h4"} align={"center"}>
                                ELEMENT HINZUFÜGEN
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} justify={"space-evenly"}
                              className={classes.elementLargeMargin}>
                            <TextField id="itemType" onChange={(e) => selectType(e)} className={classes.selection}
                                       label={"Typ"} select value={selectedType}>
                                <MenuItem value="Circle">Kreis</MenuItem>
                                <MenuItem value="Rectangle">Rechteck</MenuItem>
                                <MenuItem value="Line">Dreieck</MenuItem>
                                <MenuItem value="Star">Stern</MenuItem>
                                <MenuItem value="Text">Text</MenuItem>
                            </TextField>
                            <TextField className={classes.buttonText} id="text" value={currentTextContent}
                                       label={"Textinhalt"}
                                       onChange={(e) => setCurrentTextContent(e.target.value)}/>
                        </Grid>
                        <br/>
                        <Grid item xs={12} className={classes.elementLargeMargin}>
                            <Typography variant={"h4"} align={"center"}>
                                Ausgewählte Daten des Infoproviders
                            </Typography>
                            <br/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box borderColor="primary.main" border={4} borderRadius={5}
                                 className={classes.choiceListFrame}>
                                <List disablePadding={true}>
                                    {props.selectedDataList.map((item) => renderListItem(item))}
                                </List>
                            </Box>
                        </Grid>
                        {props.arrayProcessingList.length > 0 &&
                            <React.Fragment>
                                <Grid item xs={12} className={classes.elementLargeMargin}>
                                    <Typography variant={"h4"} align={"center"}>
                                        Arrayverarbeitungen
                                    </Typography>
                                    <br/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box borderColor="primary.main" border={4} borderRadius={5}
                                         className={classes.choiceListFrame}>
                                        <List disablePadding={true}>
                                            {props.arrayProcessingList.map((item: string) => renderListItem(item))}
                                        </List>
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        }
                        {props.customDataList.length > 0 &&
                        <React.Fragment>
                            <Grid item xs={12} className={classes.elementLargeMargin}>
                                <Typography variant={"h4"} align={"center"}>
                                    Formeln
                                </Typography>
                                <br/>
                            </Grid>
                            <Grid item xs={12}>
                                <Box borderColor="primary.main" border={4} borderRadius={5}
                                     className={classes.choiceListFrame}>
                                    <List disablePadding={true}>
                                        {props.customDataList.map((item: string) => renderListItem(item))}
                                    </List>
                                </Box>
                            </Grid>
                        </React.Fragment>
                        }
                        {props.stringReplacementList.length > 0 &&
                            <React.Fragment>
                                <Grid item xs={12} className={classes.elementLargeMargin}>
                                    <Typography variant={"h4"} align={"center"}>
                                        Stringersetzungen
                                    </Typography>
                                    <br/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box borderColor="primary.main" border={4} borderRadius={5}
                                         className={classes.choiceListFrame}>
                                        <List disablePadding={true}>
                                            {props.stringReplacementList.map((item: string) => renderListItem(item))}
                                        </List>
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        }
                        {props.historizedDataList.length > 0 &&
                            <React.Fragment>
                                <Grid item xs={12} className={classes.elementLargeMargin}>
                                    <Typography variant={"h4"} align={"center"}>
                                        Historisierte Daten
                                    </Typography>
                                    <br/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box borderColor="primary.main" border={4} borderRadius={5}
                                         className={classes.choiceListFrame}>
                                        <List disablePadding={true}>
                                            {props.historizedDataList.map((item: HistorizedDataInfo) => renderHistorizedItem(item.name, item.interval))}
                                        </List>
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        }
                        <br/>
                       <ImageLists
                           imageList={props.imageList}
                           backgroundImageList={props.backgroundImageList}
                           postImage={postImage}
                           postBackgroundImage={postBackgroundImage}
                           handleImageClick={handleImageClick}
                           backGroundType={backGroundType}
                           backGroundColorEnabled={backGroundColorEnabled}
                           handleBackground={handleBackground}
                           currentBGColor={currentBGColor}
                           switchBGColor={switchBGColor}
                           uploadReference={uploadReference}
                           handleFileUploadClick={handleFileUploadClick}
                           handleFileUploadChange={handleFileUploadChange}
                           backgroundUploadReference={backgroundUploadReference}
                           handleBackgroundUploadClick={handleBackgroundUploadClick}
                           handleBackgroundUploadChange={handleBackgroundUploadChange}
                           handleBackgroundImageClick={handleBackgroundImageClick}
                       />
                       <br/>
                        {props.diagramList.length > 0 &&
                        <DiagramList
                            diagramList={props.diagramList}
                            handleDiagramClick={() => {return;}}
                        />
                        }
                    </Grid>
                </Grid>
            </Grid>

            <CenterNotification
                handleClose={() => dispatchMessage({type: "close"})}
                open={message.open}
                message={message.message}
                severity={message.severity}
            />
            <div id={"backgroundStage"} style={{
                position: "absolute",
                top: "-9999px",
            }}/>
            <Dialog aria-labelledby="AddHistorizedDialog-Title" open={showHistorizedDialog} onClose={() => cancelHistorizedAdding()}>
                <DialogTitle id="AddHistorizedDialog-Title">
                    Intervallauswahl für {selectedHistorizedElement}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                Legen Sie bitte das Intervall fest, welches für das einzufügende Element verwendet werden soll. Die Zahl 0 meint dabei das aktuellste Intervall, die Zahl 1 das Vorletzte, usw.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                Informationen zu Historisierungszeitpunkten des gewählten Elements:
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {selectedInterval}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField error={intervalToUse === undefined || intervalToUse < 0} label="Wahl des Intervalls für das einzufügende Element" type="number" value={intervalToUse} onChange={event => setIntervalToUse(event.target.value === "" ? undefined : Number(event.target.value))}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.elementLargeMargin}>
                    <Grid container justify="space-between">
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={() => cancelHistorizedAdding()}>
                                Abbrechen
                            </Button>
                        </Grid>
                        <Grid item xs={12} className={classes.blockableButtonSecondary}>
                            <Button variant="contained" color="secondary" disabled={intervalToUse === undefined || intervalToUse < 0} onClick={() => {
                                handleItemSelect(selectedHistorizedElement, true);
                                setShowHistorizedDialog(false);
                            }}>
                                Speichern
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Dialog onClose={() => {
                setBackDialogOpen(false);
            }} aria-labelledby="backDialog-title"
                    open={backDialogOpen}>
                <DialogTitle id="backDialog-title">
                    Verwerfen der Szene
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Das Zurückgehen zum vorherigen Schritt erfordert, dass die erstellte Szene verworfen wird.
                    </Typography>
                    <Typography gutterBottom>
                        Wirklich zurückgehen?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setBackDialogOpen(false);
                                    }}>
                                abbrechen
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"
                                    onClick={() => {
                                        setBackDialogOpen(false);
                                        clearSessionStorage();
                                        props.backHandler();
                                    }}
                                    className={classes.redDeleteButton}>
                                zurück
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </StepFrame>

    );
}

//TODO: possibly extract the selection list into another component for better structure
