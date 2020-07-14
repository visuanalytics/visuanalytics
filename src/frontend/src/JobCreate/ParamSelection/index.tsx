import React from "react";
import { Fade } from "@material-ui/core";
import { useStyles } from "../style";
import { Param } from "../../util/param";
import { renderParamField } from "../../util/renderParamFields";
import { Load } from "../../util/Load";

interface ParamSelectionProps {
    topicId: number;
    params: Param[];
    fetchParamHandler: (params: Param[]) => void;
    selectParamHandler: (key: string, value: string) => void;
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        props.selectParamHandler(name, event.target.value);
    }

    return (
        <Fade in={true}>
            <div>
                <Load data={props.params} />
                {props.params?.map((p: Param) =>
                    <div className={classes.paddingSmall} key={p.name}>
                        {renderParamField(p, classes, false, true, (e) => {
                            handleChange(e, p.name)
                        })}
                    </div>
                )}
            </div>
        </Fade>

    );
};
