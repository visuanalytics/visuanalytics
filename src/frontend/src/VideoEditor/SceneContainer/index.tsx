import React from "react"
import {DraggableScene} from "../DraggableScene";
import Box from "@material-ui/core/Box";
import {ListItem} from "@material-ui/core";
import List from "@material-ui/core/List";


export const SceneContainer = () => {

    type Item = {
        id: number;
        text: string;
    }

    const [cards, setCards] = React.useState<Array<Item>>([
        {
            id: 1,
            text: 'Write a cool JS library',
        },
        {
            id: 2,
            text: 'Make it generic enough',
        },
        {
            id: 3,
            text: 'Write README',
        },
        {
            id: 4,
            text: 'Create some examples',
        },
        {
            id: 5,
            text:
                'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        },
        {
            id: 6,
            text: '???',
        },
        {
            id: 7,
            text: 'PROFIT',
        },
    ]);

    const moveCard = React.useCallback((dragIndex: number, hoverIndex: number) => {
        const dragCard = cards[dragIndex]
        const arCopy = cards.slice();
        arCopy.splice(dragIndex, 1);
        arCopy.splice(hoverIndex, 0, dragCard);
        setCards(arCopy);
    }, [cards])

    const renderCard = (card: { id: number; text: string }, index: number) => {
        return (
            <ListItem>
                <DraggableScene
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard}
                />
            </ListItem>

        )
    }

    return (
        <>
            <Box borderColor="primary.main" border={4} style={{height: "200px", width: "100%", overflowY: "hidden",}}>
                <List style={{display: 'flex',
                    flexDirection: 'row',
                    padding: 0,}}
                >
                    {cards.map((card, i) => renderCard(card, i))}
                </List>
            </Box>
        </>
    )
}
