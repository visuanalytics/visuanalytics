import React from "react";
import {ListItem, Divider, List, TextField, Button} from "@material-ui/core";
import {TopicPanel} from "./TopicPanel";
import {useStyles} from ".."


export const TopicSelection: React.FC = () => {
    // const topics: string[] = useFetch("localhost:8080/topics"); TODO: make it work
    const classes = useStyles();
    const topics: string[] = ["Wettervorhersage: Deutschland", "Wettervorhersage: lokal", "Bundesliga-Ergebnisse"]
    const renderTopic = (topic: string) => {
        return (
            <ListItem key={topic}>
                <TopicPanel topic={topic}/>
                <Divider/>
            </ListItem>
        );
    }
    return (
        <div className={classes.jobCreateBox}>
            <div>
                <h3 className={classes.jobCreateHeader}>Thema auswählen</h3>
            </div>
            <Divider/>
            <List>
                {topics.map(t => renderTopic(t))}
            </List>
            <Divider/>
            <div className={classes.paddingSmall}>
                <TextField id="standard-basic" label="Job-Name"></TextField>
            </div>
            <Divider/>
            <div className={classes.paddingSmall}>
                <Button className={classes.continueBtn}>
                    WEITER
                </Button>
            </div>
        </div>
    );
};