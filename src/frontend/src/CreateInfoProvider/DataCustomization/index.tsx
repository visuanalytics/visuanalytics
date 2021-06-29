import React from "react";
import {ArrayProcessingData, Diagram, ListItemRepresentation, SelectedDataItem, StringReplacementData} from "../types";
import {FormelObj} from "./CreateCustomData/CustomDataGUI/formelObjects/FormelObj";
import {useStyles} from "../style";
import {CreateCustomData} from "./CreateCustomData";
import {ArrayProcessing} from "./ArrayProcessing";
import {StringProcessing} from "./StringProcessing";


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
    arrayProcessingsList: Array<ArrayProcessingData>
    setArrayProcessingsList: (processings: Array<ArrayProcessingData>) => void;
    stringReplacementList: Array<StringReplacementData>;
    setStringReplacementList: (replacements: Array<StringReplacementData>) => void;
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
                        arrayProcessingsList={props.arrayProcessingsList}
                        setArrayProcessingsList={props.setArrayProcessingsList}
                        stringReplacementList={props.stringReplacementList}
                        listItems={props.listItems}
                        customData={props.customData}
                        setCustomData={props.setCustomData}
                        diagrams={props.diagrams}
                        setDiagrams={props.setDiagrams}
                        historizedData={props.historizedData}
                        setHistorizedData={props.setHistorizedData}
                        apiName={props.apiName}
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
                        arrayProcessingsList={props.arrayProcessingsList}
                        stringReplacementList={props.stringReplacementList}
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
                    <StringProcessing
                        continueHandler={props.continueHandler}
                        backHandler={() => props.setDataCustomizationStep(props.dataCustomizationStep - 1)}
                        reportError={props.reportError}
                        stringReplacementList={props.stringReplacementList}
                        setStringReplacementList={props.setStringReplacementList}
                        arrayProcessingsList={props.arrayProcessingsList}
                        listItems={props.listItems}
                        customData={props.customData}
                        setCustomData={props.setCustomData}
                        diagrams={props.diagrams}
                        setDiagrams={props.setDiagrams}
                        historizedData={props.historizedData}
                        setHistorizedData={props.setHistorizedData}
                        apiName={props.apiName}
                    />
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
