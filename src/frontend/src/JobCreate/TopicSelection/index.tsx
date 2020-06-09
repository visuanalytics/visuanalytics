import React, { useEffect } from "react";
import { ListItem, Divider, List, TextField, Button } from "@material-ui/core";
import { TopicPanel } from "./TopicPanel";
import { useStyles } from "../style";

interface TopicSelectionProps {
    selectTopicHandler: (topicName: string) => void;
    selectCompleteHandler: (completed: boolean) => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = (props) => {
    // const topics: string[] = useFetch("/topics");
    const classes = useStyles();
    const topics: string[] = ["Wettervorhersage: Deutschland", "Wettervorhersage: lokal", "Bundesliga-Ergebnisse"]
    const [selected, setSelected] = React.useState({ topic: false, name: false });

    useEffect(() => {
        handleSelectComplete();
    }, [selected]);

    const handleSelectComplete = () => {
        const selectCompleted = selected.topic && selected.name;
        props.selectCompleteHandler(selectCompleted);
    }

    const handleTopicSelected = () => {
        setSelected({ ...selected, topic: true });
    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const entered = event.target.value.trim() !== "";
        setSelected({ ...selected, name: entered })
    }

    const renderTopicPanel = (topic: string) => {
        return (
            <ListItem key={topic}>
                <TopicPanel topic={topic} selectTopicHandler={props.selectTopicHandler} selectCompleteHandler={handleTopicSelected} />
                <Divider />
            </ListItem>
        );
    }

    return (
        <div>
            <List>
                {topics.map(t => renderTopicPanel(t))}
            </List>
            <Divider />
            <div className={classes.paddingSmall}>
                <TextField className={classes.inputField} variant="outlined" label="Job-Name" onChange={handleInput}></TextField>
            </div>
        </div>
    );
};