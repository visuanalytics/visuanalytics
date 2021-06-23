import React from "react";
import {Diagram, ListItemRepresentation, SelectedDataItem, uniqueId} from "../types";
import {FormelObj} from "./CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {useStyles} from "../style";
import {CreateCustomData} from "./CreateCustomData";
import {ArrayProcessing} from "./ArrayProcessing";


interface DataCustomizationProps {
    continueHandler: () => void;
    backHandler: () => void;
    dataCustomizationStep: number;
    setDataCustomizationStep: (step: number) => void;
    selectedData: Array<SelectedDataItem>;
    setSelectedData: (array: Array<SelectedDataItem>) => void;
    customData: Array<FormelObj>;
    setCustomData: (array: Array<FormelObj>) => void;
    reportError: (message: string) => void;
    listItems: Array<ListItemRepresentation>;
    historizedData: Array<string>;
    setHistorizedData: (array: Array<string>) => void;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    apiName: string;
}

/**
 * Wrapper component for the three steps of data customization: Array processing, formula creation, string processing.
 */
export const DataCustomization: React.FC<DataCustomizationProps> = (props) => {
    const classes = useStyles();


    /**
     * Method that selects the contents to be displayed based on the current step.
     */
    const getContents = () => {
        switch(props.dataCustomizationStep) {
            case 0: {
                return (
                    <ArrayProcessing
                        continueHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep + 1)}
                        backHandler={props.backHandler}
                        reportError={props.reportError}
                    />
                )
            }
            case 1: {
                return (
                    <CreateCustomData
                        continueHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep + 1)}
                        backHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep - 1)}
                        selectedData={props.selectedData}
                        setSelectedData={props.setSelectedData}
                        customData={props.customData}
                        setCustomData={props.setCustomData}
                        reportError={props.reportError}
                        listItems={props.listItems}
                        historizedData={props.historizedData}
                        setHistorizedData={props.setHistorizedData}
                        diagrams={props.diagrams}
                        setDiagrams={props.setDiagrams}
                        apiName={props.apiName}
                    />
                )
            }
            case 2: {
                return (
                    <div></div>
                )
            }
        }
    }



    return(
        <React.Fragment>
            {getContents()}
        </React.Fragment>
    );
}
