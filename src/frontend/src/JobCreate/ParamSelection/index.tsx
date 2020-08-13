import React from "react";
import { Fade, Divider } from "@material-ui/core";
import { useStyles } from "../style";
import { Param, ParamValues } from "../../util/param";
import { Load, LoadFailedProps } from "../../Load";
import { ParamFields } from "../../ParamFields";
import { Topic } from "../TopicSelection";

interface ParamSelectionProps {
    topics: Topic[];
    params: Param[][] | undefined;
    values: ParamValues;
    loadFailedProps: LoadFailedProps;
    selectParamHandler: (key: string, value: any, idx: number) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();
    const params = props.params;
    const values = props.values;
    const topics = props.topics;

    const renderParamFields = (params: Param[] | undefined, topic: Topic, idx: number) => {
        return (
            <div key={idx}>
                <div className={classes.MPaddingTB} >
                    <div style={{ textAlign: "center" }}>
                        <h3 className={classes.header}> {(idx + 1) + ". Parameter für '" + topic.topicName + "':"} </h3>
                    </div>
                </div>
                <ParamFields
                    params={params}
                    values={values[idx]}
                    selectParamHandler={props.selectParamHandler}
                    disabled={false}
                    required={true}
                    index={idx}
                />
                <Divider></Divider>
            </div>
        )
    }

    return (
        <Fade in={true}>
            <div className={classes.centerDivMedium}>
                <Load data={params && (params.length === (topics.length))} failed={props.loadFailedProps}
                    className={classes.SPaddingTB}>
                    {params?.map((p, idx) => renderParamFields(p, topics[idx], idx))}
                </Load>
            </div>
        </Fade>

    );
};