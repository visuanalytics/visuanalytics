import React, { TextareaHTMLAttributes, useState } from "react";
import List from "@material-ui/core/List";
import { ListItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { DataSource } from "../../CreateInfoProvider";
import { useStyles } from "./style";
import { StepFrame } from "../../CreateInfoProvider/StepFrame";
import { hintContents } from "../../util/hintContents";
import Konva from 'konva';
import { Stage, Layer, Circle, Group, Text, Image, Rect, Line, Star } from 'react-konva';
import { TransformerComponent } from './TransformerComponent/index'

interface SceneEditorProps {
  continueHandler: () => void;
  backHandler: () => void;
  infoProvider: Array<DataSource>;
}

export const SceneEditor: React.FC<SceneEditorProps> = (props) => {
  //TODO: only for debugging purposes, remove in production
  const testDataList = ["data1", "data2", "data3", "data4"]

  const classes = useStyles();
  // contains the names of the steps to be displayed in the stepper
  const [dataList, setDataList] = React.useState<Array<string>>([]);
  const [backGroundNext, setBackGroundNext] = React.useState("IMAGE");
  const [backGroundType, setBackGroundType] = React.useState("COLOR");
  const [backGroundColor, setBackGroundColor] = React.useState("#FFFFFF");
  const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement>(new window.Image());
  const [colorType, setColorType] = React.useState("BACKGROUND COLOR");
  const [items, setItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
  const [itemPositionX, setItemPositionX] = React.useState(0);
  const [itemPositionY, setItemPositionY] = React.useState(0);
  const [itemSelected, setItemSelected] = React.useState(false);
  const [itemCounter, setItemCounter] = React.useState(0);
  const [imageSource, setImageSource] = React.useState<HTMLImageElement>(new window.Image());
  const [pickerX, setPickerX] = React.useState(0);
  const [pickerY, setPickerY] = React.useState(0);
  const [recentlyRemovedItems, setRecentlyRemovedItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
  const [lastItemName, setLastItemName] = React.useState("");
  const [windowWidth, setWindowWidth] = React.useState(960);
  const [windowHeight, setWindowHeight] = React.useState(540);
  const [selectedItemName, setSelectedItemName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedObject, setSelectedObject] = React.useState<myCircle | myRectangle | myLine | myStar | myText | myImage>({} as myCircle);
  const [selectedFile, setSelectedFile] = React.useState("");
  const [selecting, setSelecting] = React.useState(false);
  const [stepSize, setStepSize] = React.useState(5);
  const [textContent, setTextContent] = React.useState("");
  const [textEditContent, setTextEditContent] = React.useState("");
  const [textEditVisibility, setTextEditVisibility] = React.useState(false);
  const [textWidth, setTextWidth] = React.useState(200);
  const [textEditX, setTextEditX] = React.useState(0);
  const [textEditY, setTextEditY] = React.useState(0);
  const [textEditWidth, setTextEditWidth] = React.useState(0);
  const [textEditFontSize, setTextEditFontSize] = React.useState(20);
  const [textEditFontFamily, setTextEditFontFamily] = React.useState("");
  const [textEditFontColor, setTextEditFontColor] = React.useState("#000000");
  const [textEditHeight, setTextEditHeight] = React.useState(20);
  const [textEditPadding, setTextEditPadding] = React.useState(2);
  const [textContentBackup, setTextContentBackup] = React.useState("");

  type myCircle = {
    x: number;
    y: number;
    radius: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myRectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myLine = {
    x: number;
    y: number;
    id: string;
    color: string;
    strokeWidth: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myStar = {
    x: number;
    y: number;
    numPoints: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myText = {
    x: number;
    y: number;
    id: string;
    textContent: string;
    width: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    fontFamily: string;
    fontSize: number;
    color: string;
    height: number;
    padding: number;
    currentlyRendered: boolean;
  };

  type myImage = {
    x: number;
    y: number;
    id: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
    image: HTMLImageElement;
    width: number;
    height: number;
    color: string;
  };

  function typeGuard(x: any): x is Text {
    return true;
  }


  /**
 * gets the position and color of the item that was clicked
 * @param item contains the name of the item that was just clicked.
 */
  const itemClick = (item: string) => {
    if (itemSelected) {
      document.getElementById("del")!.innerText = "DELETE";
      const id = item
      const foundItem = items.find((i: any) => i.id === id);
      if (foundItem !== undefined) {
        setSelectedObject(foundItem);
        console.log(selectedObject);
        const index = items.indexOf(foundItem);
        // TODO: remove change of HTML Elements
        if (!items[index].id.startsWith('image')) {
          (document.getElementById("itemColor")! as HTMLInputElement).value = items[index].color!;
        }
        (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = items[index].x;
        (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = items[index].y;
        setItemPositionX(items[index].x);
        setItemPositionY(items[index].y);
      }
    }
  }

  /**
   * gets called when an element drag is started.
   * @param e drag event
   */
  const handleDragStart = (e: any) => {
    console.log('Started Dragging!');
    // TODO: remove change of HTML Elements
    document.getElementById("main")!.style.cursor = "grabbing";
  };

  /**
   * gets called multiple times during the drag of an item
   * @param e drag event
   */
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target.getStage() !== null) {
      const selectedNode = e.target.getStage()!.findOne("." + selectedItemName);
      const absPos = selectedNode.getAbsolutePosition();
      // TODO: remove change of HTML Elements
      (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = (absPos.x);
      (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = (absPos.y);
    }
  }

  /**
   * gets called when a drag event comes to an end
   * @param e drag event
   * @returns nothing, return is used as a break condition in case the user drags an item outside of the canvas.
   */
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    console.log('Stopped Dragging!')
    document.getElementById("main")!.style.cursor = "grab";
    const id = e.target.name();
    const localItems = items.slice();
    const item = localItems.find((i: any) => i.id === id);
    const index = localItems.indexOf(item!);
    if (e.target.getStage() !== null) {
      const selectedNode = e.target.getStage()!.findOne("." + selectedItemName);

      const absPos = selectedNode.getAbsolutePosition();
      console.log("I REACHED A VALID SPOT")

      //TODO Else if to identify type

      if (items[index].id.startsWith('image')) {
        localItems[index] = {
          ...item,
          x: parseInt(absPos.x.toFixed(0)),
          y: parseInt(absPos.y.toFixed(0)),
        } as myImage;
      }

      setItems(localItems);
      setItemPositionX(Number(absPos.x.toFixed(0)));
      setItemPositionY(Number(absPos.y.toFixed(0)));

      //TODO remove
      (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = absPos.x;
      (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = absPos.y;
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
    console.log(name);
    if (e.target === e.target.getStage() || name === "background") {
      console.log("Clicked Stage / Background")
      setSelectedItemName("");
      setTextEditVisibility(false);
      setItemSelected(false);
      setColorType("BACKGROUND COLOR");

      //TODO remove
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
      return;
    }

    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      console.log("You clicked the stransformer...");
      return;
    }

    if (name !== undefined && name !== '') {
      console.log(name)
      setSelectedItemName(name);
      setItemSelected(true);
      setColorType("COLOR");
      itemClick(name);
    } else {
      setSelectedItemName("");
      setItemSelected(false);
      setColorType("BACKGROUND COLOR");
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
      setColorType("BACKGROUND COLOR");
      return;
    } else if (selectedType === "Circle") {
      const nextColor = Konva.Util.getRandomColor();
      const item: myCircle = {
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        radius: 50,
        id: 'circle-' + itemCounter.toString(),
        color: nextColor,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      }
      items.push(item);
      setSelectedObject(item);
      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;
      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");
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
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myRectangle);
      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;
      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");

      return;
    } else if (selectedType === "Line") {
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        id: 'line-' + itemCounter.toString(),
        color: "black",
        strokeWidth: 10,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myLine);
      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");
      return;
    } else if (selectedType === "Star") {
      const nextColor = Konva.Util.getRandomColor();
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        numPoints: 5,
        id: 'star-' + itemCounter.toString(),
        color: nextColor,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myStar);

      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;
      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");

      return;
    } else if (selectedType === "text") {
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        id: 'text-' + itemCounter.toString(),
        textContent: (document.getElementById("text")! as HTMLInputElement).value,
        width: (document.getElementById("textWidth")! as HTMLInputElement).valueAsNumber,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        fontFamily: (document.getElementById("fontType")! as HTMLInputElement).value,
        fontSize: (document.getElementById("fontSize")! as HTMLInputElement).valueAsNumber,
        color: (document.getElementById("fontColor")! as HTMLInputElement).value,
        height: 20,
        padding: 2,
        currentlyRendered: true,
      } as myText);

      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");

      return;
    } else if (selectedType === "image") {
      items.push({
        id: 'image-' + itemCounter.toString(),
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        image: imageSource,
        width: imageSource.width,
        height: imageSource.height,
      } as myImage)

      setItemPositionX(Number(localY.toFixed(0)));
      setItemPositionY(Number(localX.toFixed(0)));
      setSelectedType("");
      setItemCounter(itemCounter + 1);
      setColorType("COLOR");

      return;
    }
  }

  /**
   * This function is called whenever the user changes the x coordinate of an item. The coordinate will be updated in the item.
   */
  const handleCoordinatesXChange = () => {
    const x = (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber;
    const id = selectedItemName;
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    localItems[index] = {
      ...selectedObject,
      x: x,
    };
    setItems(localItems);
  }

  /**
   * This function is called whenever the user changes the y coordinate of an item. The coordinate will be updated in the item.
   */
  const handleCoordinatesYChange = () => {
    const y = (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber;
    const id = selectedItemName;
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    localItems[index] = {
      ...selectedObject,
      y: y,
    };
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
    console.log(selectedObject)
    const id = e.target.name();
    console.log(id)
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    let backup: any = items[index];
    console.log(backup)
    let objectCopy: any = selectedObject;
    //TODO Type Assuring
    if (typeGuard(items[index])) {
      let backupText = backup.textContent;

      localItems[index] = {
        ...selectedObject,
        currentlyRendered: false,
        textContent: "",
      };
      setLastItemName(id)
      setTextContentBackup(backupText)
      setSelectedItemName("")
      setItems(localItems)
      setTextEditContent(backup.textContent)
      setTextEditVisibility(true)
      setTextEditX(objectCopy.x)
      setTextEditY(objectCopy.y)
      setTextEditWidth(objectCopy.width)
      setTextEditFontSize(objectCopy.fontSize)
      setTextEditFontFamily(objectCopy.fontFamily)
      setTextEditFontColor(objectCopy.color)
      setTextEditPadding(objectCopy.padding)
    }
  };

  /**
   * This function gets called whenever the user presses a key while editing a text.
   * @param e onKeyDown Event
   */
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      console.log(textEditContent);
      const textContent = textEditContent;
      const regEx = /_.*_/g;
      const fullTextContent: string[] = textContent.split('_');
      if (regEx.test(textContent)) {
        const variable = fullTextContent.indexOf("apidata");
        console.log(fullTextContent[variable]);
        if (fullTextContent[variable] === "apidata") {
          fullTextContent[variable] = "Good Weather";
        }

      }
      console.log(fullTextContent)
      const id = selectedObject;
      const localItems = items.slice();
      const index = items.indexOf(selectedObject);
      localItems[index] = {
        ...selectedObject,
        textContent: fullTextContent.join(" "),
        currentlyRendered: true,
      };
      setItems(localItems);
      setLastItemName("undefined");
      setTextEditVisibility(false);
      console.log(items)
    }
  };

  /**
   * This function is called whenever the user presses the "Clear Canvas" button
   */
  const clearCanvas = () => {
    (document.getElementById("main") as HTMLDivElement).style.cursor = "crosshair";
    (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = 0;
    (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = 0;
    (document.getElementById("itemColor")! as HTMLInputElement).value = "#FFFFFF";
    (document.getElementById("backgroundColor")! as HTMLInputElement).value = "#FFFFFF";
    (document.getElementById("fontColor")! as HTMLInputElement).value = "#000000";
    setItems([]);
    setSelectedItemName("");
    setSelectedType("");
    setTextContent("");
    setTextEditContent("");
    setItemCounter(0);
    setBackGroundColor("#FFFFFF");
    setRecentlyRemovedItems(items);
    console.clear();
  }

  /**
   * This function is called, when the user changes the size of amount he wants to move an item on the x or y axis per step.
   */
  const handleStepSizeChange = () => {
    setStepSize(parseInt((document.getElementById("stepSizeOptions")! as HTMLSelectElement).value));
  }

  /**
   * This function is called to get the relative pointer position of the cursor on the canvas
   * @param e onClick Event
   * @returns the position of the pointer
   */
  const getRelativePointerPosition = (e: any) => {
    const stage = e.target.getStage();
    var pos;
    pos = stage.getPointerPosition();
    return (pos);
  }

  /**
   * Function to select the type of element, that will get added next
   * @param type the type of element you want to add
   */
  const selectType = () => {
    document.getElementById("main")!.style.cursor = "crosshair";
    const type = (document.getElementById("itemType")! as HTMLSelectElement).value;
    console.log(type)
    setSelectedType(type);
  }

  /**
   * This function is called when the user wants to add new text on the canvas
   * @param text text that will be added to the canvas next
   */
  const selectText = (text: string) => {
    document.getElementById("main")!.style.cursor = "crosshair";
    setSelectedType("text");
    setTextContent(text);
    setTextEditContent(text);
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
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
    } else {
      const index = items.indexOf(selectedObject);
      console.log("itemsPre: ", items)
      if (items.length > 0 && selectedObject !== undefined) {
        lastElem.push(items[index]);
        items.splice(index, 1);
      }
      setRecentlyRemovedItems(lastElem);
      setItemSelected(false);
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
    }
  }

  /**
   * this function is called, when the user deletes an item and wants to undo that action
   */
  const undo = () => {
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
    var selectedNode = e.target.getStage().findOne("." + selectedItemName);
    var absPos = selectedNode.getAbsolutePosition();
    var absTrans = selectedNode.getAbsoluteScale();
    var absRot = selectedNode.getAbsoluteRotation();

    const id = e.target.name();
    console.log(id)
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    localItems[index] = {
      ...selectedObject,
      x: absPos.x,
      y: absPos.y,
      scaleX: absTrans.x,
      scaleY: absTrans.y,
      rotation: absRot,
    };
    setItems(localItems)

    console.log('Rotation:', absRot, 'ScaleX:', absTrans.x, 'ScaleY:', absTrans.y)
    console.log('Transformation completed!');
  }

  /**
   * This function is called whenever the user makes changes to the attributes of a text element
   */
  const changeFontAttr = () => {
    if (itemSelected && selectedItemName.startsWith('text')) {
      const fontFamily = (document.getElementById("fontType")! as HTMLInputElement).value;
      const fontSize = (document.getElementById("fontSize")! as HTMLInputElement).valueAsNumber;
      const fontColor = (document.getElementById("fontColor")! as HTMLInputElement).value;
      const textWidth = (document.getElementById("textWidth")! as HTMLInputElement).valueAsNumber;
      const id = selectedItemName;
      const localItems = items.slice();
      const index = items.indexOf(selectedObject);
      localItems[index] = {
        ...selectedObject,
        color: fontColor,
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: textWidth,
      };
      setTimeout(() => {
        setItems(localItems);
      }, 200);
    }
  }

  const selectFile = () => {
    setSelectedType("Image");
  }

  /**
   * Function to change the color of an element selected by a user
   */
  const switchItemColor = () => {
    const itemColor = (document.getElementById("itemColor") as HTMLInputElement).value;
    if (itemSelected === true) {
      const localItems = items.slice();
      const index = localItems.indexOf(selectedObject)
      localItems[index] = {
        ...selectedObject,
        color: itemColor,
      };
      setItems(localItems)
    }
  }

  /**
   * Function to change the background color incase it is not an image
   */
  const switchBGColor = () => {
    let backgroundColor = (document.getElementById("backgroundColor") as HTMLInputElement).value;
    setBackGroundColor(backgroundColor);
  }

  /**
   * Function to switch between an image and a backgroundcolor
   */
  const switchBackground = () => {
    if (backGroundType === "COLOR") {
      setBackGroundNext("COLOR");
      setBackGroundType("IMAGE");
      (document.getElementById("backgroundColor")! as HTMLInputElement).value = "#FFFFFF";
    } else if (backGroundType === "IMAGE") {
      setBackGroundNext("IMAGE");
      setBackGroundType("COLOR");
      (document.getElementById("backgroundColor")! as HTMLInputElement).value = backGroundColor;
    }
  }

  /**
   * Function to change the mouse cursor if the user hovers over a selected element
   */
  const mouseOver = () => {
    if (itemSelected) {
      document.getElementById("main")!.style.cursor = "grab";
    }
  }

  /**
   * Function to change cursor back to default when the user doesn't hover an element anymore
   */
  const mouseLeave = () => {
    document.getElementById("main")!.style.cursor = "crosshair";
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
    //TODO: add the selected item to the canvas
    console.log("user selected item " + item)
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

  return (

    <Grid container>
      <Grid item container justify={"center"} xs={12}>
        <Grid item xs={7}>
          <div className={classes.editorMain} id="main">
            <Stage
              width={windowWidth}
              height={windowHeight}
              className={classes.editorCanvas}
              onMouseDown={handleStageMouseDown}
            >
              <Layer>
                {backGroundType === "COLOR" &&
                  <Rect
                    name="background"
                    fill={backGroundColor}
                    width={windowWidth}
                    height={windowHeight}
                    onClick={(e: any) => handleCanvasClick(e)}
                    onMouseDown={handleStageMouseDown}
                  />
                }
                {backGroundType === "IMAGE" &&
                  <Image
                    name="background"
                    width={windowWidth}
                    height={windowHeight}
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
                          if (pos.x > window.innerWidth / 2) {
                            pos.x = window.innerWidth / 2
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > window.innerHeight / 2) {
                            pos.y = window.innerHeight / 2
                          }
                          if (pos.y < 0) {
                            pos.y = 0
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
                          if (pos.x > windowWidth - item.width) {
                            pos.x = windowWidth - item.width
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > windowHeight - item.height) {
                            pos.y = windowHeight - item.height
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
                          [item.x, item.y, item.x + 100, item.y + 100]
                        }
                        stroke={item.stroke}
                        strokeWidth={item.strokeWidth}

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
                          if (pos.x > window.innerWidth / 2) {
                            pos.x = window.innerWidth / 2
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > window.innerHeight / 2) {
                            pos.y = window.innerHeight / 2
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
                          if (pos.x > window.innerWidth / 2) {
                            pos.x = window.innerWidth / 2
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > window.innerHeight / 2) {
                            pos.y = window.innerHeight / 2
                          }
                          if (pos.y < 0) {
                            pos.y = 0
                          }
                          return pos;
                        }}
                      />) || (
                      item.id.startsWith('text') &&
                      <Text
                        id={item.id}
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
                          display: item.currentlyRendered ? "none" : "block"
                        }}
                        dragBoundFunc={function (pos: Konva.Vector2d) {
                          if (pos.x > window.innerWidth / 2 - item.width / 2) {
                            pos.x = window.innerWidth / 2 - item.width / 2
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > window.innerHeight / 2 - 20) {
                            pos.y = window.innerHeight / 2 - 20
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
                          console.log((window.innerWidth / 2), item.width)
                          if (pos.x > (window.innerWidth / 2) - item.width) {
                            pos.x = (window.innerWidth / 2) - item.width;
                          }
                          if (pos.x < 0) {
                            pos.x = 0
                          }
                          if (pos.y > (window.innerHeight * 0.9) - item.height) {
                            pos.y = (window.innerHeight * 0.9) - item.height;
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
          <textarea
            value={textEditContent}
            className={classes.editorText}
            style={{
              display: textEditVisibility ? "block" : "none",
              top: textEditY + "px",
              left: textEditX + "px",
              width: textEditWidth + "px",
              fontSize: textEditFontSize + "px",
              fontFamily: textEditFontFamily,
              color: textEditFontColor,
              /*height: textEditHeight - (textEditPadding * 2) + 20 + 'px'*/
            }}

            onChange={e => handleTextEdit(e)}
            onKeyDown={e => handleTextareaKeyDown(e)}
          />
        </Grid>

        <Grid item xs={5}>

          <div className={classes.buttonArea} >
            <button className={classes.button} onClick={selectFile}> UPLOAD IMAGE </button>
            <button className={classes.button} onClick={clearCanvas}> CLEAR </button><br />
            <label> SHAPE: </label>
            <select id="itemType" onChange={selectType}>
              <option>Circle</option>
              <option>Rectangle</option>
              <option>Line</option>
              <option>Star</option>
            </select><br />

            <button className={classes.button} onClick={() => selectText((document.getElementById("text")! as HTMLInputElement).value)}> TEXT </button>

            <input className={classes.buttonText} id="text" type="text" defaultValue="TEST"></input> <br />

            <button className={classes.button} id="del" onClick={deleteItem}> DELETE LAST ELEMENT </button>
            <button className={classes.button} id="undo" onClick={undo}> UNDO </button><br />


            <input className={classes.input} type="file" id="input" style={{ display: "none" }} accept={".png,.jpeg,.jpg"} />

            <button className={classes.button} onClick={dupe}> DUPLICATE </button>
            <button className={classes.button} onClick={switchBackground}> SWITCH TO {backGroundNext} </button><br />
            <label> CHOOSE COLOR / BACKGROUND COLOR </label>

            <input className={classes.buttonColor} id="itemColor" type="color" onChange={switchItemColor} disabled={disableColor()} defaultValue="#FFFFFF" value={selectedObject.color} />
            <input className={classes.buttonColor} id="backgroundColor" type="color" onChange={switchBGColor} disabled={backGroundType !== "COLOR"} defaultValue="#FFFFFF" /><br />

            <label > FONT SIZE: </label>
            <input className={classes.buttonNumber} type="number" step="1" id="fontSize" min="1" max="144" defaultValue="20" onChange={changeFontAttr}></input>

            <label > FONT TYPE: </label>
            <select id="fontType" onChange={changeFontAttr}>
              <option style={{ "fontFamily": "arial" }}>Arial</option>
              <option style={{ "fontFamily": "verdana" }}>veranda</option>
              <option style={{ "fontFamily": "Tahoma" }}>Tahoma</option>
              <option style={{ "fontFamily": "Georgia" }}>Georgia</option>
              <option style={{ "fontFamily": "Times New Roman" }}>Times New Roman</option>
            </select><br />

            <label > FONT COLOR: </label>
            <input className={classes.buttonColor} id="fontColor" type="color" onChange={changeFontAttr} defaultValue="#000000" /><br />

            <label> TEXT FIELD WIDTH: </label>
            <input className={classes.buttonNumber} id="textWidth" type="number" step="1" min="200" onChange={changeFontAttr} defaultValue="200"></input><br />
            <label id="positionX"> X: </label>
            <input
              className={classes.buttonNumber}
              id="coordinatesX"
              type="number"
              step={stepSize}
              min="0"
              max={window.innerWidth / 2}
              defaultValue="0"
              onChange={handleCoordinatesXChange}
              disabled={!itemSelected}
            ></input><br />
            <label id="positionY"> Y: </label>
            <input
              className={classes.buttonNumber}
              id="coordinatesY"
              type="number"
              step={stepSize}
              min="0"
              max={window.innerHeight / 2}
              defaultValue="0"
              onChange={handleCoordinatesYChange}
              disabled={!itemSelected}
            ></input><br />

            <label > STEP SIZE: </label>
            <select id="stepSizeOptions" onChange={handleStepSizeChange} defaultValue="5">
              <option > 1 </option>
              <option > 5 </option>
              <option > 10 </option>
              <option > 20 </option>
              <option > 25 </option>
              <option > 50 </option>
              <option > 75 </option>
              <option > 100 </option>
              <option > 250 </option>
            </select>

          </div>
        </Grid>
        <Grid item xs={12}>
          <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
            <List disablePadding={true}>
              {dataList.map((item) => renderListItem(item))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => setDataList(testDataList)}>
            Testdaten
                    </Button>
        </Grid>
      </Grid>
    </Grid>

  );
}

/*
 <StepFrame
      heading={"Szenen-Editor"}
      hintContent={hintContents.typeSelection}
      large={true}
    >
    </StepFrame>
*/