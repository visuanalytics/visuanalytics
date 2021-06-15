import React, {useEffect, useRef} from "react"
import {SceneCard} from "../SceneCard";
import Box from "@material-ui/core/Box";
import {Collapse, ListItem} from "@material-ui/core";
import List from "@material-ui/core/List";
import {Direction, DurationType, SceneCardData} from "../types";
import {useStyles} from "../style";

interface SceneContainerProps {
    sceneList: Array<SceneCardData>
    setSceneList: (sceneList: Array<SceneCardData>) => void;
}

export const SceneContainer: React.FC<SceneContainerProps> = (props) => {

    const classes = useStyles();

    //true if the timeout for letting scenes reappear is set
    //this is necessary to change the visibility of all invisible scenes with one timeout method so there is no delay
    const timeoutSet = React.useRef(false);

    //this static value will be true as long as the component is still mounted
    //used to check if changing the visibility for animations should still be done
    const isMounted = useRef(true);

    //defines a cleanup method that sets isMounted to false when unmounting
    //this will prevent any state changes caused by timeouts if the component is unmounted
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, [])


    /**
     * Method that removes a scene from the list of selected Scenes
     * @param index
     */
    const removeScene = (index: number) => {
        //concat the sceneList before and behind the element to be removed
        props.setSceneList(props.sceneList.slice(0, index).concat(props.sceneList.slice(index+1)));
    }

    /**
     * Handler method for changing the duration type of the scene
     * @param index The index (in the list) of the scene whose type is changed.
     * @param newDurationType The newly chosen duration type.
     */
    const setDurationType = (index: number, newDurationType: DurationType) => {
        const arCopy = props.sceneList.slice();
        arCopy[index] = {
            ...arCopy[index],
            durationType: newDurationType
        }
        props.setSceneList(arCopy);
    }

    /**
     * Handler method that changes the selected duration of a scene in the video.
     * @param index The index (in the list) of the scene whose duration is changed.
     * @param newDuration The new duration value.
     */
    const setDisplayDuration = (index: number, newDisplayDuration: number, type: DurationType) => {
        const arCopy = props.sceneList.slice();
        if(type === "fixed") {
            arCopy[index] = {
                ...arCopy[index],
                fixedDisplayDuration: newDisplayDuration
            }
        } else{
            arCopy[index] = {
                ...arCopy[index],
                exceedDisplayDuration: newDisplayDuration
            }
        }
        props.setSceneList(arCopy);
    }

    /**
     * Handler method that changes the duration of the spoken text of a selected text in the scene.
     * @param index The index (in the list) of the scene whose text is changed.
     * @param newSpokenText The new spoken text
     */
    const setSpokenText = (index: number, newSpokenText: string) => {
        const arCopy = props.sceneList.slice();
        arCopy[index] = {
            ...arCopy[index],
            spokenText: newSpokenText
        }
        props.setSceneList(arCopy);
    }

    /**
     * Method that moves a single scene in the sceneList left or right.
     * @param sourceIndex The current index of the scene that is moved
     * @param direction Direction of the movement.
     */
    const moveScene = (sourceIndex: number, direction: Direction) => {
        console.log("moveScene")
        //if the we try to go out of bounds, nothing will happen
        if ((sourceIndex < 1 && direction === Direction.Left) || (sourceIndex >= props.sceneList.length - 1 && direction === Direction.Right)) return;
        //create a copy of the moved scene with visibility set to false
        const movedScene = {
            ...props.sceneList[sourceIndex],
            visible: false
        }
        const arCopy = props.sceneList.slice();
        //shift the scene left/right to the moved scene in the necessary direction and set its visibility to false
        arCopy[sourceIndex] = {
            ...arCopy[sourceIndex + (direction === Direction.Left ? -1 : 1)],
            visible: false
        }
        //shift the moved scene to the left/right
        arCopy[sourceIndex + (direction === Direction.Left ? -1 : 1)] = movedScene;
        props.setSceneList(arCopy);
    }


    /**
     * Method that renders a single entry in the list of scenes used in the video.
     * @param sceneEntry The object of the displayed entry.
     * @param index The index of the list the entry is rendered at.
     */
    const renderSceneEntry = (sceneEntry: SceneCardData, index: number) => {
        //console.log(index + " : " + sceneEntry.visible);
        //if the card is not visible, set a timeout that makes it visible again
        if(!sceneEntry.visible) {
            //if the timeout was set by another cards, nothing is necessary
            if(!timeoutSet.current) {
                //console.log("timeout set")
                //mark that the timeout has already been set
                timeoutSet.current = true;
                setTimeout(() => {
                    //only perform this animation when the component is still mounted
                    if(isMounted.current) {
                        //search all scenes that are not visible and create copies that are visible
                        const arCopy = props.sceneList.slice();
                        arCopy.forEach((sceneCard, index) => {
                            if(!sceneCard.visible) {
                                arCopy[index] = {
                                    ...arCopy[index],
                                    visible: true
                                }
                            }
                        })
                        props.setSceneList(arCopy);
                        //reset the timeout variable
                        timeoutSet.current = false;
                    }
                }, 300)
            }
        }

        //it is necessary to let the cards disappear instantly so the user doesnt see the contents get swapped before
        return (
            <ListItem key={sceneEntry.entryId}>
                <Collapse in={sceneEntry.visible} timeout={{ appear: 500, enter: 800, exit: 0 }}>
                    <React.Fragment>
                        <SceneCard
                            entryId={sceneEntry.entryId}
                            sceneName={sceneEntry.sceneName}
                            moveLeft={() => moveScene(index, Direction.Left)}
                            moveRight={() => moveScene(index, Direction.Right)}
                            durationType={props.sceneList[index].durationType}
                            setDurationType={(newDurationType: DurationType) => setDurationType(index, newDurationType)}
                            fixedDisplayDuration={props.sceneList[index].fixedDisplayDuration}
                            setFixedDisplayDuration={(newDisplayDuration: number) => setDisplayDuration(index, newDisplayDuration, props.sceneList[index].durationType)}
                            exceedDisplayDuration={props.sceneList[index].exceedDisplayDuration}
                            setExceedDisplayDuration={(newDisplayDuration: number) => setDisplayDuration(index, newDisplayDuration, props.sceneList[index].durationType)}
                            spokenText={props.sceneList[index].spokenText}
                            setSpokenText={(newSpokenText: string) => setSpokenText(index, newSpokenText)}
                            leftDisabled={index === 0}
                            rightDisabled={index === props.sceneList.length - 1}
                            removeScene={() => removeScene(index)}
                        />
                    </React.Fragment>
                </Collapse>
            </ListItem>
        )
    }

    return (
        <>
            <Box borderColor="primary.main" border={4} className={classes.sceneContainerBox}>
                <List style={{display: 'flex',
                    flexDirection: 'row',
                    padding: 0,}}
                >
                    {props.sceneList.map((sceneEntry, index) => renderSceneEntry(sceneEntry, index))}
                </List>
            </Box>
        </>
    )
}
