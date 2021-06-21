import React, {useEffect, useReducer} from "react";
import List from "@material-ui/core/List";
import {
    ListItem,
    Button,
    Grid,
    Box,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Typography, ListItemIcon, ListItemSecondaryAction, ListItemText,

} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles"
import {useStyles} from "./style";
import {StepFrame} from "../../CreateInfoProvider/StepFrame";
import {hintContents} from "../../util/hintContents";
import Konva from 'konva';
import {Stage, Layer, Circle, Group, Text, Image, Rect, Line, Star} from 'react-konva';
import {TransformerComponent} from './TransformerComponent/index'
import {FrontendInfoProvider} from "../../CreateInfoProvider/types";
import {DiagramInfo, HistorizedDataInfo} from "../types";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BarChartIcon from '@material-ui/icons/BarChart';
import {useCallFetch} from "../../Hooks/useCallFetch";
import { centerNotifcationReducer } from "../../util/CenterNotification";

interface SceneEditorProps {
    continueHandler: () => void;
    backHandler: () => void;
    infoProvider: FrontendInfoProvider;
    selectedDataList: Array<string>;
    customDataList: Array<string>;
    historizedDataList: Array<HistorizedDataInfo>;
    diagramList: Array<DiagramInfo>;
}

export const SceneEditor: React.FC<SceneEditorProps> = (props) => {
    let theme: Theme;
    let timeOut = 0;
    const uniqueId = "sceneEditorID"

    //TODO: only for debugging purposes, remove in production
    const testDataList = ["data1", "data2", "data3", "data4"]

    const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper

    const [backGroundNext, setBackGroundNext] = React.useState("IMAGE");
    const [backGroundType, setBackGroundType] = React.useState("COLOR");
    const [backGroundColor, setBackGroundColor] = React.useState("#FFFFFF");
    const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement>(new window.Image());
    const [backGroundColorEnabled, setBackGroundColorEnabled] = React.useState(false);

    const [currentlyEditing, setCurrentlyEditing] = React.useState(false)
    const [currentFontFamily, setCurrentFontFamily] = React.useState("Arial");
    const [currentFontSize, setCurrentFontSize] = React.useState(20);
    const [currentItemWidth, setCurrentItemWidth] = React.useState(100);
    const [currentItemHeight, setCurrentItemHeight] = React.useState(100);
    const [currentTextWidth, setCurrentTextWidth] = React.useState(200);
    const [currentTextContent, setCurrentTextContent] = React.useState("Test");
    const [currentCursor, setCurrentCursor] = React.useState("crosshair");
    const [currentItemColor, setCurrentItemColor] = React.useState("#000000")
    const [currentBGColor, setCurrentBGColor] = React.useState("#FFFFFF");
    const [currentFontColor, setCurrentFontColor] = React.useState("#000000");
    const [currentXCoordinate, setCurrentXCoordinate] = React.useState(0);
    const [currentYCoordinate, setCurrentYCoordinate] = React.useState(0);

    const [dataList, setDataList] = React.useState<Array<string>>([]);
    const [deleteText, setDeleteText] = React.useState("Letztes Elem. entf.");


    const [items, setItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [itemCounter, setItemCounter] = React.useState(0);
    const [imageSource, setImageSource] = React.useState<HTMLImageElement>(new window.Image());
    const [itemsLength, setItemsLength] = React.useState(0);

    const [recentlyRemovedItems, setRecentlyRemovedItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);

    const [savedText, setSavedText] = React.useState<myCircle | myRectangle | myLine | myStar | myText | myImage>({} as myCircle);
    const [sceneName, setSceneName] = React.useState("emptyScene");
    const [selectedItemName, setSelectedItemName] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("Circle");
    const [selectedObject, setSelectedObject] = React.useState<myCircle | myRectangle | myLine | myStar | myText | myImage>({} as myCircle);
    const [stepSize, setStepSize] = React.useState(5);
    const [stage, setStage] = React.useState<Konva.Node>()

    const [textEditContent, setTextEditContent] = React.useState("");
    const [textEditVisibility, setTextEditVisibility] = React.useState(false);
    const [textEditX, setTextEditX] = React.useState(0);
    const [textEditY, setTextEditY] = React.useState(0);
    const [textEditWidth, setTextEditWidth] = React.useState(0);
    const [textEditFontSize, setTextEditFontSize] = React.useState(20);
    const [textEditFontFamily, setTextEditFontFamily] = React.useState("");
    const [textEditFontColor, setTextEditFontColor] = React.useState("#000000");

    const [baseImage, setBaseImage] = React.useState<FormData>(new FormData());
    const [itemJson, setItemJson] = React.useState("");
    const [textImage, setTextImage] = React.useState<Array<dataImage | dataText>>([])
    const [exportJSON, setExportJSON] = React.useState<jsonExport>();

    // setup for error notification
    const [message, dispatchMessage] = React.useReducer(centerNotifcationReducer, {
        open: false,
        message: "",
        severity: "error",
    });

    const reportError = (message: string) => {
        dispatchMessage({type: "reportError", message: message});
    };

    React.useEffect(() => {
        sessionStorage.setItem("items-" + uniqueId, JSON.stringify(items));
    }, [items])
    React.useEffect(() => {
        sessionStorage.setItem("recentlyRemovedItems-" + uniqueId, JSON.stringify(recentlyRemovedItems));
    }, [recentlyRemovedItems])
    React.useEffect(() => {
        sessionStorage.setItem("selectedObject-" + uniqueId, JSON.stringify(selectedObject));
    }, [selectedObject])

    React.useEffect(() => {
        setItems(sessionStorage.getItem("items-" + uniqueId) === null ? new Array<myCircle | myRectangle | myLine | myStar | myText | myImage>() : JSON.parse(sessionStorage.getItem("items-" + uniqueId)!));
        setRecentlyRemovedItems(sessionStorage.getItem("recentlyRemovedItems-" + uniqueId) === null ? new Array<myCircle | myRectangle | myLine | myStar | myText | myImage>() : JSON.parse(sessionStorage.getItem("recentlyRemovedItems-" + uniqueId)!));
        setSelectedObject(sessionStorage.getItem("selectedObject-" + uniqueId) === null ? {} as myCircle : JSON.parse(sessionStorage.getItem("selectedObject-" + uniqueId)!));

    }, [])


    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("step-" + uniqueId);
        sessionStorage.removeItem("apiName-" + uniqueId);
        sessionStorage.removeItem("query-" + uniqueId);
        sessionStorage.removeItem("noKey-" + uniqueId);
        sessionStorage.removeItem("method-" + uniqueId);
        sessionStorage.removeItem("selectedData-" + uniqueId);
        sessionStorage.removeItem("customData-" + uniqueId);
        sessionStorage.removeItem("historizedData-" + uniqueId);
        sessionStorage.removeItem("listItems-" + uniqueId);
        sessionStorage.removeItem("diagrams-" + uniqueId);
        sessionStorage.removeItem("dataSources-" + uniqueId);
        sessionStorage.removeItem("listItems-" + uniqueId);
        sessionStorage.removeItem("historySelectionStep-" + uniqueId);
        sessionStorage.removeItem("schedule-" + uniqueId);
    }

    type myCircle = {
        x: number;
        y: number;
        radius: number;
        id: string;
        color: string;
        rotation: number;
        width: number;
        height: number;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type myRectangle = {
        x: number;
        y: number;
        width: number;
        height: number;
        id: string;
        color: string;
        rotation: number;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type myLine = {
        x: number;
        y: number;
        id: string;
        color: string;
        strokeWidth: number;
        rotation: number;
        width: number;
        height: number;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type myStar = {
        x: number;
        y: number;
        numPoints: number;
        id: string;
        color: string;
        rotation: number;
        width: number;
        height: number;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type myText = {
        x: number;
        y: number;
        id: string;
        textContent: string;
        width: number;
        rotation: number;
        fontFamily: string;
        fontSize: number;
        color: string;
        height: number;
        padding: number;
        currentlyRendered: boolean;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type myImage = {
        x: number;
        y: number;
        id: string;
        rotation: number;
        image: HTMLImageElement;
        width: number;
        height: number;
        color: string;
        baseWidth: number;
        baseHeight: number;
        scaleX: number;
        scaleY: number;
    };

    type jsonExport = {
        scene_name: string
        used_images: number[]
        used_infoproviders: number[]
        images: baseImg
    }

    type baseImg = {
        type: string,
        path: string,
        overlay: Array<dataImage | dataText>
    }

    type dataImage = {
        description: string,
        type: string,
        pos_x: number, //X-Coordinate
        pos_y: number, //Y-Coordinate
        size_x: number, //Breite optional
        size_y: number, //Höhe optional
        color: string,
        path: string //Diagrammname "image_name" : "" eventuell
    }

    type dataText = {
        description: string, //optional
        type: string,
        anchor_point: string,
        pos_x: number, //item.x
        pos_y: number, //item.y
        color: string, //item.color
        font_size: number, //item.fontSize
        font: string // "fonts/{item.font}.ttf"
        pattern: string // "Datum: {_req|api_key}"
    }

    const createFinalExport = () => {
        const filtered = filterTextAndImage();
        console.log(filtered[0], filtered[1]);

    }

    const filterTextAndImage = () => {
        let returnArray = [];
        let itemCopy = items.slice();
        let onlyTextAndImages = [];
        for (let index = 0; index < itemCopy.length; index++) {
            const element = itemCopy[index];
            const localIndex = itemCopy.indexOf(element);
            if (element.id.startsWith('text')) {
                onlyTextAndImages.push(itemCopy.splice(localIndex, 1));
            }
            if (element.id.startsWith('image')) {
                onlyTextAndImages.push(itemCopy.splice(localIndex, 1));
            }
        }
        returnArray.push(itemCopy);
        returnArray.push(onlyTextAndImages);
        return returnArray;
    }


    const exporter = () => {
        exportToJSON();
    }

    const saveHandler = () => {
        const currentStage = stage;
        let stageJson = currentStage?.toDataURL();
        if (stageJson === undefined) {
            stageJson = "Empty Stage";
        }
        return stageJson;
    }

    useEffect(() => {
        let copyOfItems = exportToJSON();
    }, [sceneName]);

    const exportToJSON = async () => {
        let copyOfItems = items.slice();
        let onlyTextAndImages = [];
        let newArray: any = [];
        for (let index = 0; index < copyOfItems.length; index++) {
            const element = copyOfItems[index];
            const localIndex = copyOfItems.indexOf(element);
            if (element.id.startsWith('text')) {
                onlyTextAndImages.push(copyOfItems[localIndex] as myText);
            } else if (element.id.startsWith('image')) {
                onlyTextAndImages.push(copyOfItems[localIndex] as myImage);
            } else {
                newArray.push(copyOfItems[localIndex])
            }
        }
        setItems(newArray);

        const stageJson = saveHandler();

        if (stageJson !== "Empty Stage"){
            let localBlob = await fetch(stageJson).then(res => res.blob());

            let file = new File([localBlob], 'background.png');
            let formData = new FormData();

            formData.append('image', file);
            formData.append('name', sceneName + '_background');

            setBaseImage(formData);
        }

        const base: baseImg = {
            type: "pillow",
            path: sceneName + "_background.png",
            overlay: textImage
        }

        const returnValue: jsonExport = {
            scene_name: sceneName,
            used_images: [],//number[]
            used_infoproviders: [],
            images:  base
        }

        onlyTextAndImages.forEach(element => {
            if (element.id.startsWith('text')) {
                if ('fontSize' in element) {
                    const itemToPush: dataText = {
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
                    textImage.push(itemToPush);
                }
                console.log('text', element.id);
            } else if (element.id.startsWith('image')) {
                if ('image' in element) {
                    const itemToPush: dataImage = {
                        description: "string",
                        type: "string",
                        pos_x: element.x, //X-Coordinate
                        pos_y: element.y, //Y-Coordinate
                        size_x: element.width, //Breite optional
                        size_y: element.height, //Höhe optional
                        color: "RGBA",
                        path: "string" //Diagrammname "image_name" : "" eventuell
                    }
                    textImage.push(itemToPush);
                }
            }
        });

        setItemJson(JSON.stringify(copyOfItems));
        setExportJSON(returnValue);
        return copyOfItems
    }

    const delayedItemChange = (itemList: any) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            setItems(itemList);
        }, 200);
    }

    const handleSaveToPC = (url: string, name: string) => {
        const link = document.createElement('a');
        link.download = name;
        link.href = url;
        link.click();
    }

    const handleSuccess = () => {

    }

    const handleError = () => {

    }

    const postScene = useCallFetch("visuanalytics/scene", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                exportJSON
            )
        }, handleSuccess, handleError
    );

    const saveButtonHandler = () => {
        if (/*TODO Scene is empty*/false){
            //reportError("Die Szene ist leer!");
            return;
        }
        exportToJSON();
        postBackground();
        postScene();
    }

    const postBackground = useCallFetch("visuanalytics/image/add", {
        method: "POST",
        headers: {},
        body: baseImage
    });


    /**
     * gets called when an element drag is started.
     * @param e drag event
     */
    const handleDragStart = (e: any) => {
        setCurrentCursor("grabbing");
    };

    /**
     * gets called multiple times during the drag of an item
     * @param e drag event
     */
    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    }

    /**
     * gets called when a drag event comes to an end
     * @param e drag event
     * @returns nothing, return is used as a break condition in case the user drags an item outside of the canvas.
     */
    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setCurrentCursor("grab");
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

            setCurrentXCoordinate(parseInt(absPos.x.toFixed(0)));
            setCurrentYCoordinate(parseInt(absPos.y.toFixed(0)));
            return;
        }
    };

    /**
     * This function gets called everytime the user clicks on the canvas.
     * @param e click event
     * @returns is again used as a break from the function
     */

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {

        const name = e.target.name();

        if (e.target === e.target.getStage() || name === "background") {
            setStage(e.target.getStage()!)
            setSelectedItemName("");
            currentlyEditing ? setTextEditVisibility(true) : setTextEditVisibility(false);
            setItemSelected(false);
            setDeleteText("Letztes Elem. entf.");
            return;
        }

        const clickedOnTransformer =
            e.target.getParent().className === "Transformer";
        if (clickedOnTransformer) {

            return;
        }

        if (name !== undefined && name !== '') {
            console.log(name)
            setSelectedItemName(name);
            setItemSelected(true);

            setDeleteText("LÖSCHEN");
            const id = name;
            const foundItem = items.find((i: any) => i.id === id);
            setSelectedObject(foundItem!);

            const index = items.indexOf(foundItem!);
            if (items[index].id.startsWith("text")) {
                setCurrentFontColor(items[index].color)
            }
            if (!items[index].id.startsWith("image")) {
                setCurrentItemColor(items[index].color!);
            }
            setCurrentXCoordinate(items[index].x);
            setCurrentYCoordinate(items[index].y);
            setCurrentItemHeight(items[index].height);
            setCurrentItemWidth(items[index].width);
        }
    };

    /**
     * This function gets called whenever the user clicks on the canvas to add an item.
     * @param e onClick Event
     * @returns nothing
     */

    const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {

        const local = getRelativePointerPosition(e);
        if (local === undefined) {
            return;
        }
        const localX: number = local.x;
        const localY: number = local.y;

        if (selectedType === "") {
            return;
        } else if (selectedType === "Circle") {
            const nextColor = Konva.Util.getRandomColor();
            const item: myCircle = {
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
            items.push(item);
            setCurrentItemColor(nextColor);

            setSelectedType("");
            setItemCounter(itemCounter + 1);
            return;

        } else if (selectedType === "Rectangle") {
            const nextColor = Konva.Util.getRandomColor();
            items.push({
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

            } as myRectangle);
            setCurrentItemColor(nextColor);
            setSelectedType("");
            setItemCounter(itemCounter + 1);

            return;
        } else if (selectedType === "Line") {
            items.push({
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

            } as myLine);

            setSelectedType("");
            setItemCounter(itemCounter + 1);

            return;
        } else if (selectedType === "Star") {
            const nextColor = Konva.Util.getRandomColor();
            items.push({
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

            } as myStar);

            setCurrentItemColor(nextColor);
            setSelectedType("");
            setItemCounter(itemCounter + 1);

            return;
        } else if (selectedType === "Text") {
            items.push({
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

            } as myText);

            setSelectedType("");
            setItemCounter(itemCounter + 1);


            return;
        } else if (selectedType === "image") {
            items.push({
                id: 'image-' + itemCounter.toString(),
                x: parseInt(localX.toFixed(0)),
                y: parseInt(localY.toFixed(0)),
                rotation: 0,
                image: imageSource,
                width: imageSource.width,
                height: imageSource.height,
                baseWidth: imageSource.width,
                baseHeight: imageSource.height,
                scaleX: 1,
                scaleY: 1,

            } as myImage)

            setSelectedType("");
            setItemCounter(itemCounter + 1);

            return;
        }
    }

    /**
     * This function is called whenever the user changes the x coordinate of an item. The coordinate will be updated in the item.
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
     * This function is called whenever the user changes the y coordinate of an item. The coordinate will be updated in the item.
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
     * This function is called whenever the user edits the text of an existing text-field.
     * @param e onChange Event
     */
    const handleTextEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

        setTextEditContent(e.target.value);
    };

    /**
     * This function is called whenever a user double clicks on an existing text.
     * @param e onDoubleClick Event
     */
    const handleTextDblClick = (e: any) => {

        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        let backup: any = items[index];
        const objectCopy = {
            ...selectedObject,
            currentlyRendered: false,
            textContent: "",
        } as myText;
        localItems[index] = objectCopy;
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
     * This function gets called whenever the user presses a key while editing a text.
     * @param e onKeyDown Event
     */
    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const content = textEditContent;
            const objectCopy = {
                ...selectedObject,
                textContent: content,
                currentlyRendered: true,
            };
            localItems[index] = objectCopy;
            setSelectedObject(objectCopy);
            setItems(localItems);
            setTextEditVisibility(false);
        }
    };

    /**
     * This function is called whenever the user presses the "Clear Canvas" button
     */
    const clearCanvas = () => {

        setCurrentCursor("crosshair");

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
     * This function is called, when the user changes the size of amount he wants to move an item on the x or y axis per step.
     */
    const handleStepSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        setStepSize(parseInt(event.target.value));
    }

    /**
     * This function is called to get the relative pointer position of the cursor on the canvas
     * @param e onClick Event
     * @returns the position of the pointer
     */
    const getRelativePointerPosition = (e: any) => {

        const stage = e.target.getStage();
        let pos;
        pos = stage.getPointerPosition();
        return (pos);
    }

    /**
     * Function to select the type of element, that will get added next
     * @param type the type of element you want to add
     */
    const selectType = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentCursor("crosshair");
        setSelectedType(event.target.value);
    }

    /**
     * This function is called when the user wants to delete and element (either the last element or the currently selected one)
     */
    const deleteItem = () => {

        const lastElem = [...recentlyRemovedItems];
        if (itemSelected === false) {
            if (items.length > 0) {
                const poppedItem = items.pop();
                if (poppedItem !== undefined) {
                    lastElem.push(poppedItem);
                }
            }
            setRecentlyRemovedItems(lastElem);
            setDeleteText("Letztes Elem. entf.");
        } else {
            const index = items.indexOf(selectedObject);

            if (items.length > 0 && selectedObject !== undefined) {
                lastElem.push(items[index]);
                items.splice(index, 1);
            }
            setRecentlyRemovedItems(lastElem);
            setItemSelected(false);
            setDeleteText("Letztes Elem. entf.");
        }
    }

    /**
     * this function is called, when the user deletes an item and wants to undo that action
     */
    const undo = () => {

        const lastElem = [...recentlyRemovedItems];

        if (recentlyRemovedItems.length > 0) {
            const poppedItem = lastElem.pop();
            if (poppedItem !== undefined) {
                items.push(poppedItem);
            }
        }
        setRecentlyRemovedItems(lastElem);
    }

    /**
     * This function is called when the user wants to duplicate a selected element.
     * It is important to note that the element will be a new element with the properties copied over from the old element once
     */
    const dupe = () => {

        if (itemSelected === true) {
            const id = selectedItemName;
            const parts = selectedItemName.split('-');

            const localItems = items.slice();

            localItems.push({
                ...selectedObject,
                id: parts[0] + '-' + Math.random() * Math.random(),
            });
            setItems(localItems);
        }
    }

    /**
     * This function is called when the users stops transforming an element
     * @param e Transform Event
     */
    const onTransformEnd = (e: any) => {
        const selectedNode = e.target.getStage().findOne("." + selectedItemName);
        const absPos = selectedNode.getAbsolutePosition();
        const absTrans = selectedNode.getAbsoluteScale();
        const absRot = selectedNode.getAbsoluteRotation();

        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        let newObject = {
            ...selectedObject,
            x: parseInt((absPos.x).toFixed(0)),
            y: parseInt((absPos.y).toFixed(0)),
            scaleX: absTrans.x,
            scaleY: absTrans.y,
            rotation: absRot,
        };


        localItems[index] = newObject;

        setItems(localItems);
        setCurrentXCoordinate(parseInt((absPos.x).toFixed(0)));
        setCurrentYCoordinate(parseInt((absPos.y).toFixed(0)));

    }

    /**
     * This function is called whenever the user makes changes to the font family of a text element
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
     * This function is called whenever the user makes changes to the font size of a text element
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
     * This function is called whenever the user makes changes to the font color of a text element
     */
    const changeFontColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        delayedFontColorChange(event.target.value)
    }

    /**
     * This function is called whenever the user makes changes to the text width of a text element
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

    const selectFile = () => {
        setSelectedType("Image");
    }

    /**
     * Function to change the color of an element selected by a user
     */
    const switchItemColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        delayedItemColorChange(event.target.value)
    }

    const delayedItemColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            if (itemSelected === true) {
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

    const delayedBackgroundColorChange = (color: string) => {
        window.clearTimeout(timeOut);
        timeOut = window.setTimeout(() => {
            setCurrentBGColor(color);
        }, 200);
    }
    /**
     * Function to change the background color incase it is not an image
     */
    const switchBGColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        delayedBackgroundColorChange(event.target.value);
    }

    /**
     * Function to switch between an image and a backgroundcolor
     */
    const switchBackground = () => {
        if (backGroundType === "COLOR") {
            setBackGroundNext("COLOR");
            setBackGroundType("IMAGE");
            setCurrentBGColor("#FFFFFF");
        } else if (backGroundType === "IMAGE") {
            setBackGroundNext("IMAGE");
            setBackGroundType("COLOR");
            setCurrentBGColor(backGroundColor);
        }
    }

    /**
     * Function to change the mouse cursor if the user hovers over a selected element
     */
    const mouseOver = () => {
        if (itemSelected) {
            setCurrentCursor("grab");
        }
    }

    /**
     * Function to change cursor back to default when the user doesn't hover an element anymore
     */
    const mouseLeave = () => {
        setCurrentCursor("crosshair");
    }

    /**
     * Function to stop the user from using the coloring options on elements that do not use the coloring options
     * @ true or false depending on the selected item
     */
    const disableColor = (): boolean => {
        if (itemSelected) {
            return false;
        } else {
            return true;
        }
    }

    const disableFontColor = (): boolean => {
        if (itemSelected) {
            if (selectedItemName.startsWith('text')) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    //TODO: load dataList from the infoProvider props

    /**
     * Method to handle the selection of data from the list of available api data.
     * @param item The item selected by the user
     */
    const handleItemSelect = (item: string) => {

        items.push({
            x: 20,
            y: 20,
            id: 'text-' + itemCounter.toString(),
            textContent: item,
            width: currentTextWidth,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            fontFamily: currentFontFamily,
            fontSize: currentFontSize,
            color: currentFontColor,
            height: 20,
            padding: 2,
            currentlyRendered: true,
            baseWidth: currentTextWidth,
            baseHeight: 20,
        } as myText);
        setCurrentTextContent(item);
        setTextEditContent(item);
        setItemCounter(itemCounter + 1);
    }

    /**
     * Method that renders the list items to be displayed in the list of all available data.
     * @param item The item to be displayed
     */
    const renderListItem = (item: string) => {
        return (
            <ListItem key={item}>
                <Button onClick={() => handleItemSelect(item)}>
                    {item}
                </Button>
            </ListItem>
        )
    }

    const handleBackground = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {

        backGroundColorEnabled ? setBackGroundColorEnabled(false) : setBackGroundColorEnabled(true);
        if (backGroundColorEnabled) {
            setCurrentBGColor("#FFFFFF");
            setBackGroundColor(currentBGColor);
        } else {
            setCurrentBGColor(backGroundColor);
        }
    }


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


    //TODO: custom icons
    /**
     * Method that renders an entry in the list of available diagrams.
     * @param diagram The information about the entry to be displayed
     */
    const renderDiagramListEntry = (diagram: DiagramInfo) => {
        return (
            <ListItem key={diagram.name}>
                <ListItemIcon>
                    <BarChartIcon/>
                </ListItemIcon>
                <ListItemText>
                    {diagram.name + " (" + diagram.type + ")"}
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={() => console.log("diagram " + diagram.name + " should be added to the canvas here")}>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    return (
        <StepFrame
            heading={"Szenen-Editor"}
            hintContent={hintContents.typeSelection}
            large={"xl"}
        >
            <Grid container>
                <Grid item container justify={"center"} xs={12}>
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
                                        onClick={props.backHandler}>
                                    Zurück
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button size={"large"} variant={"contained"} className={classes.topButtons}
                                        onClick={() => saveButtonHandler()}>
                                    Speichern
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.editorMain} id="main" style={{cursor: currentCursor}}>
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        onDblClick={(e: any) => handleTextDblClick(e)}
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
                                                            if (pos.y > 540 - this.height()) {
                                                                pos.y = 540 - this.height()
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
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
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
                                          top: textEditY + 380 + "px",
                                          left: textEditX + 110 + "px",
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
                            <Box borderColor="primary.main" border={4} borderRadius={5}
                                 className={classes.lowerButtons}>
                                <Grid item container xs={12} justify={"center"} spacing={10}>
                                    <Grid item xs={3}>
                                        <Button className={classes.button} onClick={clearCanvas}> ZURÜCKSETZEN </Button><br/><br/>
                                        <Typography className={classes.labels} variant={"button"}> Farbe: </Typography>
                                        <input className={classes.buttonColor} id="itemColor" type={"color"}
                                               onChange={switchItemColor} disabled={disableColor()}
                                               value={currentItemColor}/><br/><br/>
                                        <Typography className={classes.labels}
                                                    variant={"button"}> Schriftfarbe: </Typography>
                                        <input className={classes.buttonColor} id="fontColor" type="color"
                                               onChange={(e) => changeFontColor(e)} disabled={!disableFontColor()}
                                               value={currentFontColor}/>
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
                                        ></TextField><br/><br/>
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
                                        ></TextField><br/><br/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button className={classes.button} id="undo" onClick={undo}> RÜCKGÄNGIG
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
                                        ></TextField><br/><br/>
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
                                        ></TextField><br/><br/>
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
                                        ></TextField><br/><br/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button className={classes.button} onClick={dupe}> Klonen </Button><br/><br/>
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
                                        ></TextField><br/><br/>
                                        <Button className={classes.button} onClick={exporter}> CREATE EXPORT </Button>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        <Grid item xs={12} className={classes.rightButtons}>
                            <Typography variant={"h4"} align={"center"}> ELEMENT HINZUFÜGEN </Typography><br/>
                            <Grid container item xs={12} justify={"space-evenly"}>

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
                                           onChange={(e) => setCurrentTextContent(e.target.value)}></TextField>
                            </Grid><br/>
                            <Typography variant={"h4"} align={"center"}> TEXTE </Typography><br/>
                            <Grid item xs={12}>
                                <Box borderColor="primary.main" border={4} borderRadius={5}
                                     className={classes.choiceListFrame}>
                                    <List disablePadding={true}>
                                        {props.selectedDataList.map((item) => renderListItem(item))}
                                    </List>
                                </Box>

                            </Grid>
                            <Typography variant={"h4"} align={"center"}> HINTERGRUND </Typography><br/>
                            <Grid item xs={12}>
                                <FormControlLabel className={classes.checkBox}
                                                  control={<Checkbox name="checkedB" color="primary"
                                                                     checked={backGroundColorEnabled}
                                                                     onChange={handleBackground}/>}
                                                  label="Hintergrundfarbe verwenden"
                                /><br/>
                                <label className={classes.labels}> Hintergrundfarbe: </label>
                                <input
                                    className={classes.buttonColor}
                                    id="backgroundColor"
                                    type="color"
                                    onChange={switchBGColor}
                                    disabled={backGroundType !== "COLOR" || !backGroundColorEnabled}
                                    value={!backGroundColorEnabled ? "#FFFFFF" : currentBGColor}
                                /><br/>
                                <Button className={classes.button} onClick={switchBackground}
                                        style={{width: "80%"}}> HINTERGRUNDBILD WÄHLEN </Button>
                            </Grid><br/>
                            <Typography variant={"h4"} align={"center"}> BILDER </Typography><br/>
                            <Grid container item xs={12} justify={"space-evenly"}><br/></Grid>
                            <Typography variant={"h4"} align={"center"}> DIAGRAMME </Typography><br/>
                            <List>
                                {props.diagramList.map((diagram) => renderDiagramListEntry(diagram))}
                            </List>
                            <Grid container item xs={12} justify={"space-evenly"}><br/></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StepFrame>
    );
}

//TODO: possibly extract the selection list into another component for better structure

/**
 * <TextField
 className={classes.buttonNumber}
 id="rotation"
 type="number"
 InputProps={{
                        inputProps: {
                          min: 0, max: 359, step: 1,
                        }
                      }}
 onChange={(e) => changeCurrentRotation(e)}
 label={"Rotation (Grad)"}
 value={currentRotation}
 ></TextField><br /><br />



 */
