import React from "react";
import { Fade, Divider } from "@material-ui/core";
import { useStyles } from "../style";
import { Param, ParamValues } from "../../util/param";
import { Load, LoadFailedProps } from "../../Load";
import { ParamFields } from "../../ParamFields";

export interface ParamSelectionProps {
  topicNames: string[];
  params: Param[][] | undefined;
  values: ParamValues;
  loadFailedProps: LoadFailedProps | undefined;
  selectParamHandler: (key: string, value: any, idx: number) => void;
  style?: React.CSSProperties;
  invalidValues: string[][];
}

export const ParamSelection: React.FC<ParamSelectionProps> = (props) => {
  const classes = useStyles();
  const params = props.params;
  const values = props.values;
  const topicNames = props.topicNames;

  const renderParamFields = (
    topicParams: Param[] | undefined,
    topicName: string,
    idx: number
  ) => {
    return (
      <div
        key={idx}
        className={params && params.length <= 1 ? classes.MPaddingT : undefined}
      >
        {params && params.length > 1 ? (
          <div className={classes.MPaddingTB}>
            <div style={{ textAlign: "center" }}>
              <h3 className={classes.header}>
                {" "}
                {idx + 1 + ". Parameter für '" + topicName + "':"}{" "}
              </h3>
            </div>
          </div>
        ) : (
          ""
        )}
        <ParamFields
          params={topicParams}
          values={values[idx]}
          selectParamHandler={props.selectParamHandler}
          disabled={false}
          required={true}
          index={idx}
          invalidValues={
            props.invalidValues[idx] ? props.invalidValues[idx] : []
          }
        />
        {params && params[idx + 1] && <Divider />}
      </div>
    );
  };

  return (
    <Fade in={true}>
      <div className={classes.centerDivMedium} style={props.style}>
        {props.loadFailedProps ? (
          <Load
            data={params && params.length === topicNames.length}
            failed={props.loadFailedProps}
            className={classes.SPaddingTB}
          >
            {params?.map((p, idx) =>
              renderParamFields(p, topicNames[idx], idx)
            )}
          </Load>
        ) : (
          <div className={classes.SPaddingTB}>
            {params?.map((p, idx) =>
              renderParamFields(p, topicNames[idx], idx)
            )}
          </div>
        )}
      </div>
    </Fade>
  );
};
