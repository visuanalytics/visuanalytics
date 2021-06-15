import React, {useEffect} from "react";
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
    Typography, ListItemIcon, ListItemSecondaryAction, ListItemText
} from "@material-ui/core";

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
    //TODO: only for debugging purposes, remove in production
    const testDataList = ["data1", "data2", "data3", "data4"]

    const classes = useStyles();
    // contains the names of the steps to be displayed in the stepper
    const [sceneName, setSceneName] = React.useState("emptyScene")
    const [dataList, setDataList] = React.useState<Array<string>>([]);
    const [backGroundNext, setBackGroundNext] = React.useState("IMAGE");
    const [backGroundType, setBackGroundType] = React.useState("COLOR");
    const [backGroundColor, setBackGroundColor] = React.useState("#FFFFFF");
    const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement>(new window.Image());
    const [items, setItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
    const [itemSelected, setItemSelected] = React.useState(false);
    const [itemCounter, setItemCounter] = React.useState(0);
    const [imageSource, setImageSource] = React.useState<HTMLImageElement>(new window.Image());
    const [recentlyRemovedItems, setRecentlyRemovedItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
    const [selectedItemName, setSelectedItemName] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("Circle");
    const [selectedObject, setSelectedObject] = React.useState<myCircle | myRectangle | myLine | myStar | myText | myImage>({} as myCircle);
    const [stepSize, setStepSize] = React.useState(5);
    const [textEditContent, setTextEditContent] = React.useState("");
    const [textEditVisibility, setTextEditVisibility] = React.useState(false);
    const [textEditX, setTextEditX] = React.useState(0);
    const [textEditY, setTextEditY] = React.useState(0);
    const [textEditWidth, setTextEditWidth] = React.useState(0);
    const [textEditFontSize, setTextEditFontSize] = React.useState(20);
    const [textEditFontFamily, setTextEditFontFamily] = React.useState("");
    const [textEditFontColor, setTextEditFontColor] = React.useState("#000000");
    const [currentFontFamily, setCurrentFontFamily] = React.useState("Arial");
    const [currentFontSize, setCurrentFontSize] = React.useState(20);
    const [currentFontColor, setCurrentFontColor] = React.useState("#000000");
    const [currentTextWidth, setCurrentTextWidth] = React.useState(200);
    const [currentTextContent, setCurrentTextContent] = React.useState("Test");
    const [backGroundColorEnabled, setBackGroundColorEnabled] = React.useState(false);
    const [currentXCoordinate, setCurrentXCoordinate] = React.useState(0);
    const [currentYCoordinate, setCurrentYCoordinate] = React.useState(0);
    const [deleteText, setDeleteText] = React.useState("Letzes Item löschen");
    const [currentCursor, setCurrentCursor] = React.useState("crosshair");
    const [currentItemColor, setCurrentItemColor] = React.useState("#000000")
    const [currentBGColor, setCurrentBGColor] = React.useState("#FFFFFF");
    const [currentRotation, setCurrentRotation] = React.useState(0);
    const [stage, setStage] = React.useState<Konva.Stage | null>();

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
    };

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
            const selectedNode = e.target.getStage()!.findOne("." + selectedItemName);

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
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        const name = e.target.name();
        console.log(name);
        if (e.target === e.target.getStage() || name === "background") {
            console.log("Clicked Stage / Background")
            setSelectedItemName("");
            setTextEditVisibility(false);
            setItemSelected(false);
            setDeleteText("Letzes Item löschen");
            setStage(e.target.getStage());
            console.log(stage)
            return;
        }

        const clickedOnTransformer =
            e.target.getParent().className === "Transformer";
        if (clickedOnTransformer) {
            console.log("You clicked the stransformer...");
            return;
        }

        if (name !== undefined && name !== '') {
            console.log("entered if")
            setSelectedItemName(name);
            setItemSelected(true);

            setDeleteText("LÖSCHEN");
            const id = name;
            const foundItem = items.find((i: any) => i.id === id);
            setSelectedObject(foundItem!);
            console.log(selectedObject);
            const index = items.indexOf(foundItem!);
            if (items[index].id.startsWith("text")) {
                setCurrentFontColor(items[index].color)
            }
            if (!items[index].id.startsWith("image")) {
                setCurrentItemColor(items[index].color!);
            }
            setCurrentXCoordinate(items[index].x);
            setCurrentYCoordinate(items[index].y);
        }
    };

    useEffect(() => {
        console.log(selectedItemName);
    }, [selectedItemName]);

    /**
     * This function gets called whenever the user clicks on the canvas to add an item.
     * @param e onClick Event
     * @returns nothing
     */

    const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
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
                width: 100,
                height: 100,
                baseWidth: 100,
                baseHeight: 100,
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
            } as myText);

            setSelectedType("");
            setItemCounter(itemCounter + 1);
            console.log(items[items.length - 1].x, items[items.length - 1].y)

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
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);

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
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        setTextEditContent(e.target.value);
    };

    /**
     * This function is called whenever a user double clicks on an existing text.
     * @param e onDoubleClick Event
     */
    const handleTextDblClick = (e: any) => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        let backup: any = items[index];
        //TODO Type Assuring


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

    };

    /**
     * This function gets called whenever the user presses a key while editing a text.
     * @param e onKeyDown Event
     */
    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        console.log(e.key);
        if (e.key) {
            console.log(textEditContent, selectedObject);
        }
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
            console.log(localItems[index])
            setItems(localItems);
            setTextEditVisibility(false);
        }
    };

    /**
     * This function is called whenever the user presses the "Clear Canvas" button
     */
    const clearCanvas = () => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        setCurrentCursor("crosshair");
        setCurrentXCoordinate(0);
        setCurrentYCoordinate(0);
        setCurrentItemColor("#FFFFFF");
        setBackGroundColor("#FFFFFF");
        setCurrentFontColor("#000000");
        setItems([]);
        setSelectedItemName("");
        setSelectedType("");
        setTextEditContent("");
        setItemCounter(0);
        setCurrentBGColor("#FFFFFF");
        setRecentlyRemovedItems(items);
        setCurrentRotation(0);
        console.clear();
    }

    /**
     * This function is called, when the user changes the size of amount he wants to move an item on the x or y axis per step.
     */
    const handleStepSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        setStepSize(parseInt(event.target.value));
    }

    /**
     * This function is called to get the relative pointer position of the cursor on the canvas
     * @param e onClick Event
     * @returns the position of the pointer
     */
    const getRelativePointerPosition = (e: any) => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        const stage = e.target.getStage();
        var pos;
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
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        const lastElem = [...recentlyRemovedItems];
        if (itemSelected === false) {
            if (items.length > 0) {
                const poppedItem = items.pop();
                if (poppedItem !== undefined) {
                    lastElem.push(poppedItem);
                }
            }
            setRecentlyRemovedItems(lastElem);
            setDeleteText("Letzes Item löschen");
        } else {
            const index = items.indexOf(selectedObject);
            console.log("itemsPre: ", items)
            if (items.length > 0 && selectedObject !== undefined) {
                lastElem.push(items[index]);
                items.splice(index, 1);
            }
            setRecentlyRemovedItems(lastElem);
            setItemSelected(false);
            setDeleteText("Letzes Item löschen");
        }
    }

    /**
     * this function is called, when the user deletes an item and wants to undo that action
     */
    const undo = () => {
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        const lastElem = [...recentlyRemovedItems];
        console.log(lastElem)
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
        console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
        if (itemSelected === true) {
            const id = selectedItemName;
            const parts = selectedItemName.split('-');
            console.log(parts[0])
            const localItems = items.slice();
            console.log('ID: ', id, 'item: ', selectedObject);
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

        const id = e.target.name();
        console.log(id)
        const localItems = items.slice();
        const index = items.indexOf(selectedObject);
        localItems[index] = {
            ...selectedObject,
            x: parseInt((absPos.x).toFixed(0)),
            y: parseInt((absPos.y).toFixed(0)),
            width: parseInt((selectedObject.baseWidth * absTrans.x).toFixed(0)),
            height: parseInt((selectedObject.baseHeight * absTrans.y).toFixed(0)),
            rotation: absRot,
        };
        setItems(localItems);
        setCurrentRotation(absRot.toFixed(0));
        setCurrentXCoordinate(parseInt((absPos.x).toFixed(0)));
        setCurrentYCoordinate(parseInt((absPos.y).toFixed(0)));
        console.log('Rotation:', absRot, 'ScaleX:', absTrans.x, 'ScaleY:', absTrans.y)
        console.log('Transformation completed!');
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

            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);
                setCurrentFontFamily(fontFamily);
            }, 200);
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

            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);
                setCurrentFontSize(parseInt(fontSize));
            }, 200);
        }
    }

    /**
     * This function is called whenever the user makes changes to the font color of a text element
     */
    const changeFontColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected && selectedItemName.startsWith('text')) {
            const fontColor = (event.target.value);
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                color: fontColor,
            };
            localItems[index] = objectCopy;

            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);
                setCurrentFontColor(fontColor);
            }, 200);
        }
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
            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);
                setCurrentTextWidth(textWidth);
            }, 200);
        }
    }

    /**
     *
     */
    const changeCurrentRotation = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected) {
            const localItems = items.slice();
            const index = items.indexOf(selectedObject);
            const objectCopy = {
                ...selectedObject,
                rotation: parseInt(event.target.value),
            };
            localItems[index] = objectCopy;
            setCurrentRotation(parseInt(event.target.value));
            setTimeout(() => {
                setItems(localItems);
                setSelectedObject(objectCopy);

            }, 200);

            console.log(currentRotation)
        }
    }

    const selectFile = () => {
        setSelectedType("Image");
    }

    /**
     * Function to change the color of an element selected by a user
     */
    const switchItemColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (itemSelected === true) {
            const localItems = items.slice();
            const index = localItems.indexOf(selectedObject)

            const objectCopy = {
                ...selectedObject,
                color: event.target.value,
            };

            localItems[index] = objectCopy;
            setCurrentItemColor(event.target.value);
            setTimeout(() => {
                setSelectedObject(objectCopy);
                setItems(localItems);

            }, 200)


        }
    }

    /**
     * Function to change the background color incase it is not an image
     */
    const switchBGColor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        setCurrentBGColor(event.target.value);
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
        if (itemSelected === true) {
            if (selectedItemName.startsWith("text") || selectedItemName.startsWith("image")) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    }

    //TODO: load dataList from the infoProvider props

    /**
     * Method to handle the selection of data from the list of available api data.
     * @param item The item selected by the user
     */
    const handleItemSelect = (item: string) => {
        console.log("user selected item " + item);
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
        console.log(backGroundColorEnabled);
        backGroundColorEnabled ? setBackGroundColorEnabled(false) : setBackGroundColorEnabled(true);
        if (backGroundColorEnabled) {
            setCurrentBGColor("#FFFFFF");
            setBackGroundColor(currentBGColor);
        } else {
            setCurrentBGColor(backGroundColor);
        }
    }

    /**
     * //TODO
     * 1) Bild ohne Texte
     *
     * Width, Height, Position X, Position Y, objectName
     */
    const createExport = () => {

        const jsonExport = {
            "images": {
                "name": {
                    //baseImg
                }
            }
        }

        const baseImg = {
            "type": "pillow",
            "path": "name.png",
            "overlay": [
                //contains image / text
            ]
        }

        const image = {
            "description": "",
            "type": "image",
            "pos_x": 0, //X-Coordinate
            "pos_y": 0, //Y-Coordinate
            "size_x": 0, //Breite
            "size_y": 0, //Höhe
            "color": "RGBA",
            "pattern": "name.png" //Diagrammname
        }

        const text = {
            "description": "", //optional
            "type": "text",
            "anchor_point": "center",
            "pos_x": 0, //item.x
            "pos_y": 0, //item.y
            "color": "#000000", //item.color
            "font_size": 20, //item.fontSize
            "font": "fonts/Arial.ttf", //item.font
            "pattern": "Datum: {_req|api_key}"
        }

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
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText>
                    {diagram.name + " (" + diagram.type + ")"}
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => console.log("diagram " + diagram.name + " should be added to the canvas here")}>
                        <AddCircleOutlineIcon />
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
                                <Button size={"large"} variant={"contained"} className={classes.topButtons}>
                                    Zurück
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button size={"large"} variant={"contained"} className={classes.topButtons}>
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
                                                        fill={item.color}
                                                        radius={item.radius}
                                                        onDragStart={handleDragStart}
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        scaleX={item.scaleX}
                                                        scaleY={item.scaleY}
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
                                                        width={item.width}
                                                        height={item.height}
                                                        onDragStart={handleDragStart}
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        scaleX={item.scaleX}
                                                        scaleY={item.scaleY}
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
                                                        points={
                                                            [0, 0, 100, 0, 100, 100]
                                                        }
                                                        stroke={"black"}
                                                        closed
                                                        onDragStart={handleDragStart}
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        scaleX={item.scaleX}
                                                        scaleY={item.scaleY}
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
                                                        radius={item.radius}
                                                        onDragStart={handleDragStart}
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        scaleX={item.scaleX}
                                                        scaleY={item.scaleY}
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
                                                        style={{
                                                            display: "block"
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
                                                        image={item.image}
                                                        draggable
                                                        onDragStart={handleDragStart}
                                                        onDragMove={handleDragMove}
                                                        onDragEnd={handleDragEnd}
                                                        onTransformEnd={onTransformEnd}
                                                        scaleX={item.scaleX}
                                                        scaleY={item.scaleY}
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
                                               onChange={(e) => changeFontColor(e)} disabled={!disableColor()}
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
                                                   value={currentFontFamily} select>
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
                                        ></TextField><br/><br/>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button className={classes.button} onClick={dupe}> Klonen </Button><br/><br/>
                                        <TextField id="stepSizeOptions" onChange={(e) => handleStepSizeChange(e)}
                                                   value={stepSize} className={classes.selection} select
                                                   label={"Sprunggröße"}>
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
                                                    min: 200, max: 540, step: 1, defaultValue: 200,
                                                }
                                            }}
                                            onChange={(e) => changeTextWidth(e)}
                                            label={"Textbreite (PX)"}
                                        ></TextField><br/><br/>


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
                                        {dataList.map((item) => renderListItem(item))}
                                    </List>
                                </Box>
                                <Button className={classes.showData} variant="contained"
                                        onClick={() => setDataList(testDataList)}>
                                    Testdaten
                                </Button><br/>
                            </Grid>
                            <Typography variant={"h4"} align={"center"}> HINTERGRUND </Typography><br/>
                            <Grid item xs={12}>
                                <FormControlLabel className={classes.checkBox}
                                                  control={
                                                      <Checkbox
                                                          name="checkedB"
                                                          color="primary"
                                                          checked={backGroundColorEnabled}
                                                          onChange={handleBackground}
                                                      />
                                                  }
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
