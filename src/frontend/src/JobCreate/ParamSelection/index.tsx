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
    selectParamHandler: (key: string, value: any) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();

    const renderParamFields = (params: Param[] | undefined, topic: Topic) => {
        return (<div className={classes.MPaddingTB}>
            <div className={classes.MPaddingTB}>
                {"Parameter für '" + topic.topicName + "':"}
            </div>
            {
                params?.length !== 0
                    ?
                    (<ParamFields
                        params={params}
                        values={props.values}
                        selectParamHandler={props.selectParamHandler}
                        disabled={false}
                        required={true}
                    />)
                    :
                    (<div className={classes.MPaddingTB} style={{ textAlign: "center" }}>
                        Für dieses Thema stehen keine Parameter zur Verfügung.
                    </div>)
            }
        </div>)
    }

    return (
        <Fade in={true}>
            <div className={classes.centerDivMedium}>
                <Load data={props.params} failed={props.loadFailedProps} className={classes.SPaddingTB}>
                    {props.params?.map((p, idx) => renderParamFields(p, props.topics[idx]))}
                </Load>
            </div>
        </Fade>

    );
};