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

    const renderParamFields = (params: Param[] | undefined, topic: Topic, idx: number) => {
        return (
            <div key={idx}>
                <div className={classes.MPaddingTB} >
                    <div className={classes.MPaddingTB} style={{ textAlign: "center" }}>
                        {(idx + 1) + ". Parameter für '" + topic.topicName + "':"}
                    </div>
                    {
                        params?.length !== 0
                            ?
                            (<ParamFields
                                params={params}
                                values={props.values[idx]}
                                selectParamHandler={props.selectParamHandler}
                                disabled={false}
                                required={true}
                                index={idx}
                            />)
                            :
                            (<div className={classes.MPaddingTB} style={{ textAlign: "center" }}>
                                Für dieses Thema stehen keine Parameter zur Verfügung.
                            </div>)
                    }
                </div>
                {(idx + 1) !== props.params?.length ? (<Divider />) : ""}
            </div>)
    }

    return (
        <Fade in={true}>
            <div className={classes.centerDivMedium}>
                <Load data={props.params} failed={props.loadFailedProps} className={classes.SPaddingTB}>
                    {props.params?.map((p, idx) => renderParamFields(p, props.topics[idx], idx))}
                </Load>
            </div>
        </Fade>

    );
};