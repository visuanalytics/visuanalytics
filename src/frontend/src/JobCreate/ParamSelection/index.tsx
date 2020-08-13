import React from "react";
import { Fade, Divider } from "@material-ui/core";
import { useStyles } from "../style";
import { Param, ParamValues } from "../../util/param";
import { Load, LoadFailedProps } from "../../Load";
import { ParamFields } from "../../ParamFields";
import { Topic } from "../TopicSelection";

export interface ParamSelectionProps {
    topicNames: string[];
    params: Param[][] | undefined;
    values: ParamValues;
    loadFailedProps: LoadFailedProps | undefined;
    selectParamHandler: (key: string, value: any, idx: number) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();
    const params = props.params;
    const values = props.values;
    const topicNames = props.topicNames;

    const renderParamFields = (params: Param[] | undefined, topicName: string, idx: number) => {
        return (
            <div key={idx}>
                <div className={classes.MPaddingTB} >
                    <div style={{ textAlign: "center" }}>
                        <h3 className={classes.header}> {(idx + 1) + ". Parameter für '" + topicName + "':"} </h3>
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
                {
                    props.loadFailedProps
                        ?
                        (
                            <Load data={params && (params.length === (topicNames.length))} failed={props.loadFailedProps}
                                className={classes.SPaddingTB}>
                                {params?.map((p, idx) => renderParamFields(p, topicNames[idx], idx))}
                            </Load>
                        )
                        :
                        (
                            <div className={classes.SPaddingTB}>
                                {params?.map((p, idx) => renderParamFields(p, topicNames[idx], idx))}
                            </div>
                        )
                }

            </div>
        </Fade>

    );
};