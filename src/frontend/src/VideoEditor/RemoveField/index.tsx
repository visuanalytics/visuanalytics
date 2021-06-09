import React from "react"
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "../types";
import Typography from "@material-ui/core/Typography";


export const RemoveField = () => {

    //we define a reference drop that makes this a drop target
    const [{ isOver }, drop] = useDrop(
        () => ({
            //define which types of items will be accepted
            accept: ItemTypes.CARD,
            //action to perform when something has dropped here
            drop: () => (console.log("something was dropped")),
            //get information to use as props from monitor
            collect: (monitor) => ({
                //true if the dragged item is over this dropfield
                isOver: monitor.isOver(),
            })
        }), [])

    return (
        <div ref={drop} style={{border: "5px solid red", width:"100%", height:"100%"}}>
            <Typography>
                Drop here to remove a scene.
            </Typography>
        </div>
    )
}
