import React from "react";
import {ListItem, Divider, List, TextField, Fade} from "@material-ui/core";
import {TopicPanel} from "./TopicPanel";
import {useStyles} from "../style";
import {useFetch} from "../../Hooks/useFetch";
import {Param} from "../../util/param";
import {Load} from "../../util/Load";
import { getUrl } from "../../util/fetchUtils";

export interface Topic {
    topicName: string;
    topicId: number;
}

interface TopicSelectionProps {
    topicId: number;
    jobName: string;
    selectTopicHandler: (topicId: number) => void;
    enterJobNameHandler: (jobName: string) => void;
    fetchParamHandler: (params: Param[]) => void;
}

export const TopicSelection: React.FC<TopicSelectionProps> = (props) => {
    const classes = useStyles();

    const topics: Topic[] = useFetch(getUrl("/topics")) as Topic[]

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.enterJobNameHandler(event.target.value);
    }

    const renderTopicPanel = (topic: Topic) => {
        return (
            <ListItem key={topic.topicName}>
                <TopicPanel
                    topic={topic}
                    topicId={props.topicId}
                    selectTopicHandler={props.selectTopicHandler}
                    fetchParamHandler={props.fetchParamHandler}/>
                <Divider/>
            </ListItem>
        );
    }

    return (
        <Fade in={true}>
            <div>
                <Load data={topics}/>
                <List>
                    {topics?.map(t => renderTopicPanel(t))}
                </List>
                <Divider/>
                <div className={classes.paddingSmall}>
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