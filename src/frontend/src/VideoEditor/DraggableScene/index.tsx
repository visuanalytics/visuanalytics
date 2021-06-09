import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}

export interface DraggableSceneProps {
    id: any
    text: string
    index: number
    moveCard: (dragIndex: number, hoverIndex: number) => void
}



/**
 * Component for a draggable scene used in the interface of the videoEditor.
 */
export const DraggableScene: React.FC<DraggableSceneProps> = ({id, text, index, moveCard}) => {


    //setup a reference to this elements DOM tag
    const ref = useRef<HTMLDivElement>(null)

    // define the type of a dragged item object
    type DragItem = {
        index: number
        id: string
        type: string
    }

    //every element needs to be a drop target in order to realize the position switching
    const [{ handlerId }, drop] = useDrop({
        accept: "card",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        //this method is called when something is hovered over this element
        hover(item: DragItem, monitor: DropTargetMonitor) {
            // if for some reason no DOM tag is provided for this element, dont
            // react to the hovering
            if (!ref.current) {
                return
            }
            //get the index of the element hovered over this one
            const dragIndex = item.index
            //get our own index
            const hoverIndex = index

            // If we hover over ourself, there is no need for replacing
            if (dragIndex === hoverIndex) {
                return
            }

            //Determine rectangle on screen
            //returns a rect element specifying position relative to viewport
            //and width/height of the box
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle - determines the x-position of this elements mid relative to the top
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            //returns the offset of the client pointer relative to the viewport
            const clientOffset = monitor.getClientOffset()

            // Get pixel difference of the client to the top of the hovered element
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards: if the pixel difference to the top is not
            // bigger than the pixel difference of the middle, dont move
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards if the pixel difference to the top is not
            // smaller than the pixel difference of the middle, dont move
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            //since the movement went beyond the middle, the dragged element
            //needs to be moved to the hovered position
            moveCard(dragIndex, hoverIndex)

            // mutate the monitor by setting the items index (not best practice, but good for performance)
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        // define the drag type of this element
        type: "card",
        // when being dragged, return the id and the index of this element as
        // the dragged item
        item: () => {
            return { id, index }
        },
        // get the information if we are dragged from the monitor
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
            {text}
        </div>
    )
}
