import React from "react";
import { Fade } from "@material-ui/core";
import { useStyles } from "../style";
import { Param, ParamValues } from "../../util/param";
import { Load } from "../../util/Load";
import { ParamFields } from "../../ParamFields";

interface ParamSelectionProps {
    topicId: number;
    params: Param[];
    values: ParamValues;
    fetchParamHandler: (params: Param[]) => void;
    selectParamHandler: (key: string, value: any) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();

    return (
        <Fade in={true}>
            <div className={classes.centerDivMedium}>
                <div className={classes.paddingS}>
                    <Load data={props.params} />
                    {props.params.length !== 0
                        ?
                        <ParamFields
                            params={props.params}
                            values={props.values}
                            selectParamHandler={props.selectParamHandler}
                            disabled={false}
                            required={true}
                        />
                        :
                        <div className={classes.paddingM} style={{ textAlign: "center" }}>
                            Für dieses Thema stehen keine Parameter zur Verfügung.
                    </div>}
                </div>
            </div>
        </Fade>

    );
};