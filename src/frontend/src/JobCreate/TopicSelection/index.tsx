import React, { useState, useCallback } from "react";
import { ListItem, Divider, List, TextField, Fade, Switch, FormControlLabel } from "@material-ui/core";
import { TopicPanel } from "./TopicPanel";
import { useStyles } from "../style";
import { Load } from "../../Load";
import { getUrl } from "../../util/fetchUtils";
import { useFetchMultiple } from "../../Hooks/useFetchMultiple";

export interface Topic {
    topicName: string;
    topicId: number;
    topicInfo: string;
}

interface TopicSelectionProps {
    topicIds: number[];
    jobName: string;
    multipleTopics: boolean;
    resetTopicsHandler: () => void;
    setSingleTopicHandler: (topicId: number) => void;
    addTopicHandler: (topicId: number) => void;
    enterJobNameHandler: (jobName: string) => void;
    toggleMultipleHandler: () => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = (props) => {
    const classes = useStyles();

    const [loadFailed, setLoadFailed] = useState(false);
    const handleLoadFailed = useCallback(() => {
        setLoadFailed(true);
    }, [setLoadFailed]);

    const [topics, getTopics] = useFetchMultiple<Topic[]>(getUrl("/topics"), undefined, handleLoadFailed)

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.enterJobNameHandler(event.target.value);
    }

    const toggleChecked = () => {
        props.toggleMultipleHandler();
    };

    const handleReaload = () => {
        setLoadFailed(false)
        getTopics()
    }

    const renderTopicPanel = (topic: Topic) => {
        return (
            <ListItem key={topic.topicName}>
                <TopicPanel
                    topic={topic}
                    topicIds={props.topicIds}
                    selectTopicHandler={!props.multipleTopics ? props.setSingleTopicHandler : props.addTopicHandler}
                />
                <Divider />
            </ListItem>
        );
    }

    return (
        <Fade in={true}>
            <div>
                <div className={classes.SPaddingTB}>
                    <FormControlLabel
                        control={<Switch />}
                        checked={props.multipleTopics}
                        onChange={toggleChecked}
                        label="Videos aneinanderhängen"
                    />
                </div>
                <Divider></Divider>
                <Load
                    failed={{
                        hasFailed: loadFailed,
                        name: "Themen",
                        onReload: handleReaload,
                    }}
                    data={topics}
                    className={classes.MPaddingTB}
                >
                    <List>
                        {topics?.map(t => renderTopicPanel(t))}
                    </List>
                </Load>
                <Divider />
                <div className={classes.MPaddingTB}>
                    <TextField className={classes.inputFields}
                        required
                        value={props.jobName}
                        variant="outlined"
                        label="Job-Name"
                        onChange={handleInput}
                    />
                </div>
            </div>
        </Fade>
    );
};