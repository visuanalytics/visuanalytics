import React from "react";
import { useStyles } from "./style";
import {Diagram, extractKeysFromSelection, ListItemRepresentation, SelectedDataItem} from "../"
import {hintContents} from "../../util/hintContents";
import {StepFrame} from "../StepFrame";
import {DiagramOverview} from "./DiagramOverview";
import {DiagramTypeSelect} from "./DiagramTypeSelect";
import {ArrayDiagramCreator} from "./ArrayDiagramCreator";
import {HistorizedDiagramCreator} from "./HistorizedDiagramCreator";




/* TODO: following steps for diagram creation:
task 1: pass listItems from dataSelection and history selection from HistorySelection -> DONE
task 2: write method that lists all arrays that fit the requirements -> DONE
task 3: show overview of existing diagrams and give option to use a new one -> DONE
NOT DONE:

task 4: choose if array or historized data
task 5: choose the array (filter all arrays from apiData) - can only contain numbers or objects
     if object: choose which property is meant for y/value (number) and which is meant for x/name (string)
task 6: choose diagram type
task 7: for arrays: display the length got and set the maximum amount of items to be used, display warning that it could possibly deliver less values
task 8: for historized data: choosing options for y/values: currentDate - n * interval between historizations
task 9: for historized data: choose names for the axis (possibly add functionality for date or something?)
task 10: create data format to represent created diagrams
task 11: test button for sending the diagram data to the backend to generate a preview (with random data?)
task 12: sessionStorage compatability
task 13: pass diagrams to wrapper
 */


interface DiagramCreationProps {
    continueHandler: () => void;
    backHandler: () => void;
    listItems: Array<ListItemRepresentation>;
    historizedData: Array<string>;
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    selectedData: Array<SelectedDataItem>
};


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const DiagramCreation: React.FC<DiagramCreationProps> = (props) => {
    const classes = useStyles();

    //holds the current step in the diagram creation process
    const [diagramStep, setDiagramStep] = React.useState(0);
    //holds the ListItemRepresentation of all arrays compatible with diagrams
    const [compatibleArrays, setCompatibleArrays] = React.useState<Array<ListItemRepresentation>>([]);
    //holds the strings of all historized data compatible with diagrams
    const [compatibleHistorized, setCompatibleHistorized] = React.useState<Array<string>>([]);
    //holds the array selected for the current diagram
    const [currentArray, setCurrentArray] = React.useState<ListItemRepresentation>({} as ListItemRepresentation);
    //holds the historized data selected for the current diagram
    const [currentHistorized, setCurrentHistorized] = React.useState<string>("");


    React.useEffect(() => {
        //console.log(props.listItems)
        //getCompatibleArrays(props.listItems);

    }, [])

    React.useEffect(() => {
        setCompatibleArrays(getCompatibleArrays(props.listItems))
    }, [props.listItems])

    React.useEffect(() => {
        setCompatibleHistorized(getCompatibleHistorized(props.historizedData))
    }, [props.historizedData])

    /*
    export type ListItemRepresentation = {
        keyName: string;
        value: any;
        parentKeyName: string;
        arrayRep: boolean;
        arrayLength: number;
    }
     */

    //TODO: number check is missing
    /**
     * Runs through the provided array of listItems recursively and returns all arrays that are compatible for diagram usage.
     * @param listItems The array to be processed.
     * Arrays are compatible if they only contain items of the same type or objects.
     * Arrays containing arrays or arrays containing different primitive types are not compatible.
     * Arrays contained in objects contained in arrays are also not compatible.
     */
    const getCompatibleArrays = (listItems: Array<ListItemRepresentation>) => {
        let compatibleArrays: Array<ListItemRepresentation> = []
        listItems.forEach((item) => {
            if(item.arrayRep) {
                if(Array.isArray(item.value)) {
                    //this is an array containing objects
                    //check if the object contains a numeric value
                    if(checkObjectForNumeric(item.value)) compatibleArrays.push(item);
                } else if(item.value!=="[Array]"&&!item.value.includes(",")) {
                    //when the value is not array and has no commata, the array contains primitive values of the same type
                    //check if the primitive type is numeric
                    if(item.value==="Zahl")compatibleArrays.push(item)
                }
            } else if(Array.isArray(item.value)) {
                //this is an object, we need to check if one of its values is an array
                compatibleArrays = compatibleArrays.concat(getCompatibleArrays(item.value));
            }
        })
        return compatibleArrays;
    }

    /**
     * Evaluates if the object contains a numeric value (not in sub-objects but on the highest level).
     * @param object The object to be checked
     * Returns true if a numeric attribute is contained, false if not.
     */
    const checkObjectForNumeric = (object: Array<ListItemRepresentation>) => {
        for(let index = 0; index < object.length; ++index) {
            if(object[index].value==="Zahl") return true;
        }
        return false;
    }

    /**
     * Filters the selected historized data by which is compatible with diagrams.
     * Only numeric values are allowed.
     * Uses props.selectedData to check the types in order to prevent having to pass types with historizedData.
     */
    const getCompatibleHistorized = (historizedData: Array<string>) => {
        console.log("getting compatible historized");
        const compatibleHistorized: Array<string> = []
        historizedData.forEach((item) => {
            props.selectedData.forEach((data) => {
                if(data.key===item&&data.type==="Zahl") compatibleHistorized.push(item)
            })
        })
        return compatibleHistorized;
    }

    /**
     * Selects the displayed content based on the current step
     * 0: Overview of created diagrams with option for more
     * 1: TypeSelection, also includes Selection of concrete Array
     * 2: Diagram Editor for Arrays
     * 3: Diagram Editor for historized data
     */
    const selectContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <DiagramOverview
                        continueHandler={props.continueHandler}
                        backHandler={props.backHandler}
                        createDiagramHandler={() => setDiagramStep(diagramStep+1)}
                        diagrams={props.diagrams}
                    />
                );
            case 1:
                return (
                    <DiagramTypeSelect
                        continueArray={() => setDiagramStep(2)}
                        continueHistorized={() =>  setDiagramStep(2)}
                        backHandler={() => setDiagramStep(diagramStep-1)}
                        compatibleArrays={compatibleArrays}
                        compatibleHistorized={compatibleHistorized}
                        currentArray={currentArray}
                        setCurrentArray={((item: ListItemRepresentation) => setCurrentArray(item))}
                        currentHistorized={currentHistorized}
                        setCurrentHistorized={(data: string) => setCurrentHistorized(data)}
                    />
                );
            case 2:
                return (
                    <ArrayDiagramCreator
                        continueHandler={props.continueHandler}
                        backHandler={props.backHandler}
                    />
                );
            case 3:
                return (
                    <HistorizedDiagramCreator
                        continueHandler={props.continueHandler}
                        backHandler={props.backHandler}
                    />
                );
        }
    }

    return(
        <StepFrame
            heading = "Diagrammerstellung"
            hintContent = {null}
        >
            {selectContent(diagramStep)}
        </StepFrame>
    )
};
