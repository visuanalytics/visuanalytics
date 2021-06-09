import React from "react"
import {SceneCard} from "../SceneCard";
import Box from "@material-ui/core/Box";
import {ListItem} from "@material-ui/core";
import List from "@material-ui/core/List";


export const SceneContainer = () => {

    type SceneCardData = {
        entryId: string;
        sceneName: string;
        displayDuration: number;
        spokenText: string;
    }

    enum Direction {
        Left = "LEFT",
        Right = "RIGHT"
    }

    //list of the names of all scenes available - holds the data fetched from the backend
    const [availableScenes, setAvailableScenes] = React.useState<Array<string>>([]);

    const [sceneList, setSceneList] = React.useState<Array<SceneCardData>>([
        {entryId: "Szene_1||0", sceneName: "Szene_1", displayDuration: 5, spokenText: ""},
        {entryId: "Szene_2||0", sceneName: "Szene_2", displayDuration: 1, spokenText: ""},
        {entryId: "Szene_3||0", sceneName: "Szene_3", displayDuration: 1, spokenText: ""},
        {entryId: "Szene_4||0", sceneName: "Szene_4", displayDuration: 1, spokenText: ""},
        {entryId: "Szene_5||0", sceneName: "Szene_5", displayDuration: 1, spokenText: ""},
        {entryId: "Szene_6||0", sceneName: "Szene_6", displayDuration: 1, spokenText: ""},
    ]);

    /**
     * Method that appends a new scene to the list of scenes selected for the video.
     * @param sceneName The unique name of the scene to be appended
     */
    const addScene = (sceneName: string) => {
        //search all occurences of this scene and find the highest id number to define the id of this scene
        //necessary since the names alone wont be unique
    }

    /**
     * Handler method that changes the selected duration of a scene in the video.
     * @param index The index (in the list) of the scene whose duration is changed.
     * @param newDuration The new duration value.
     */
    const setDisplayDuration = (index: number, newDisplayDuration: number) => {
        const arCopy = sceneList.slice();
        arCopy[index] = {
            ...arCopy[index],
            displayDuration: newDisplayDuration
        }
        setSceneList(arCopy);
    }

    /**
     * Handler method that changes the duration of the spoken text of a selected text in the scene.
     * @param index The index (in the list) of the scene whose text is changed.
     * @param newSpokenText The new spoken text
     */
    const setSpokenText = (index: number, newSpokenText: string) => {
        const arCopy = sceneList.slice();
        arCopy[index] = {
            ...arCopy[index],
            spokenText: newSpokenText
        }
        setSceneList(arCopy);
    }

    /**
     * Method that moves a single scene in the sceneList left or right.
     * @param sourceIndex The current index of the scene that is moved
     * @param direction Direction of the movement.
     */
    const moveScene = (sourceIndex: number, direction: Direction) => {
        //TODO: some kind of animation when swapping, like short glowing of the swapped cards? Would be good for visuality
        //if the we try to go out of bounds, nothing will happen
        if ((sourceIndex < 1 && direction === Direction.Left) || (sourceIndex >= sceneList.length - 1 && direction === Direction.Right)) return;
        const movedScene = sceneList[sourceIndex];
        const arCopy = sceneList.slice();
        //shift the scene left/right to the moved element right/left
        arCopy[sourceIndex] = arCopy[sourceIndex + (direction === Direction.Left ? -1 : 1)]
        //shift the moved scene to the left/right
        arCopy[sourceIndex + (direction === Direction.Left ? -1 : 1)] = movedScene;
        setSceneList(arCopy);
    }

    /**
     * Method that renders a single entry in the list of scenes used in the video.
     * @param sceneEntry The object of the displayed entry.
     * @param index The index of the list the entry is rendered at.
     */
    const renderSceneEntry = (sceneEntry: SceneCardData, index: number) => {
        return (
            <ListItem key={sceneEntry.entryId}>
                <SceneCard
                    entryId={sceneEntry.entryId}
                    sceneName={sceneEntry.sceneName}
                    moveLeft={() => moveScene(index, Direction.Left)}
                    moveRight={() => moveScene(index, Direction.Right)}
                    displayDuration={sceneList[index].displayDuration}
                    setDisplayDuration={(newDisplayDuration: number) => setDisplayDuration(index, newDisplayDuration)}
                    spokenText={sceneList[index].spokenText}
                    setSpokenText={(newSpokenText: string) => setSpokenText(index, newSpokenText)}
                    leftDisabled={index === 0}
                    rightDisabled={index === sceneList.length - 1}
                />
            </ListItem>
        )
    }

    return (
        <>
            <Box borderColor="primary.main" border={4} style={{width: "100%", overflowY: "hidden",}}>
                <List style={{display: 'flex',
                    flexDirection: 'row',
                    padding: 0,}}
                >
                    {sceneList.map((sceneEntry, index) => renderSceneEntry(sceneEntry, index))}
                </List>
            </Box>
        </>
    )
}
