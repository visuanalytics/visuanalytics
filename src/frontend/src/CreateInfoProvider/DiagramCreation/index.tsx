import React, {useCallback, useEffect, useRef} from "react";
import { useStyles } from "./style";
import {Diagram, ListItemRepresentation, SelectedDataItem, diagramType, Schedule, uniqueId} from "../index"
import {StepFrame} from "../StepFrame";
import {DiagramOverview} from "./DiagramOverview";
import {DiagramTypeSelect} from "./DiagramTypeSelect";
import {ArrayDiagramCreator} from "./DiagramCreator/ArrayDiagramCreator";
import {HistorizedDiagramCreator} from "./DiagramCreator/HistorizedDiagramCreator";
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { formelObj } from "../CreateCustomData/CustomDataGUI/formelObjects/formelObj";


/* TODO: following steps for diagram creation:
task 1: pass listItems from dataSelection and history selection from HistorySelection -> DONE
task 2: write method that lists all arrays that fit the requirements -> DONE
task 3: show overview of existing diagrams and give option to use a new one -> DONE
task 4: choose if array or historized data
task 5: choose the array (filter all arrays from apiData) - can only contain numbers or objects that contain numbers
     if object: choose which property is meant for y/value (number) and which is meant for x/name (string)
task 6: choose diagram type
task 7: for arrays: set the maximum amount of items to be used, display warning that it could possibly deliver less values
task 8: enable usage with multiple arrays and multiple historized data
task 9: for historized data: choosing options for y/values: currentDate - n * interval between historizations
task 10: for historized data: choose names for the axis,
task 11: create data format to represent created diagrams, create with finalizing, show in overview, delete functionality
task 12: formula support (formula will only contain numbers), add functionality for date/timestamp as names on historized
task 13: sessionStorage compatibility
task 14: rearrange structure
task 15: height and alignment of texts and inputs, color-input
task 16: data format for backend
task 17: write custom fetcher for using in useEffect in Overview and general Creation
task 18: use the fetcher based on the current diagram in both creators to get the preview
task 19: code cleanup
NOT DONE:
task 20: as soon as available: fetch the arrays and historized data from all data sources and not only the current one
task 21: edit feature
task 22: add hintContents
 */

/**
 * Represents an array selected for diagram creation and holds attributes for all settings
 */
export type ArrayDiagramProperties = {
    listItem: ListItemRepresentation;
    numericAttribute: string;
    stringAttribute: string;
    labelArray: Array<string>;
    color: string;
    numericAttributes: Array<ListItemRepresentation>;
    stringAttributes: Array<ListItemRepresentation>
    customLabels: boolean;
}

/**
 * Represents historized data selected for diagram creation and holds attributes for all settings
 */
export type HistorizedDiagramProperties = {
    name: string;
    labelArray: Array<string>;
    color: string;
    intervalSizes: Array<number>;
    dateLabels: boolean;
    dateFormat: string;
}

/**
 * Plot typed which is used for sending diagrams to the backend in fitting format.
 */
export type Plots = {
    customLabels?: boolean;
    primitive?: boolean;
    dateLabels?: boolean;
    plots: {
        type: string;
        x: Array<number>;
        y: string;
        color: string;
        numericAttribute?: string;
        stringAttribute?: string;
        dateFormat?: string;
        x_ticks: {
            ticks: Array<string>;
        };
    };
}


interface DiagramCreationProps {
    continueHandler: () => void;
    backHandler: () => void;
    listItems: Array<ListItemRepresentation>;
    historizedData: Array<string>;
    customData: Array<formelObj>
    diagrams: Array<Diagram>;
    setDiagrams: (array: Array<Diagram>) => void;
    selectedData: Array<SelectedDataItem>;
    reportError: (message: string) => void;
    schedule: Schedule;
    infoProviderName: string;
}


/**
 * Component displaying the second step in the creation of a new Info-Provider.
 * The state of this component handles the input made to its children.
 */
export const DiagramCreation: React.FC<DiagramCreationProps> = (props) => {
    const classes = useStyles();

    //holds the current step in the diagram creation process
    const [diagramStep, setDiagramStep] = React.useState(0);
    //holds the source type currently used
    const [diagramSource, setDiagramSource] = React.useState<string>("");
    //holds the ListItemRepresentation of all arrays compatible with diagrams
    const [compatibleArrays, setCompatibleArrays] = React.useState<Array<ListItemRepresentation>>([]);
    //holds the strings of all historized data compatible with diagrams
    const [compatibleHistorized, setCompatibleHistorized] = React.useState<Array<string>>([]);
    //holds all array object representations currently used for a diagram
    const [arrayObjects, setArrayObjects] = React.useState<Array<ArrayDiagramProperties>>([]);
    //holds all historized data object representations currently used for a diagram
    const [historizedObjects, setHistorizedObjects] = React.useState<Array<HistorizedDiagramProperties>>([]);
    //holds the name for the currently created diagram
    const [diagramName, setDiagramName] = React.useState<string>("");
    //holds the currently selected diagram type
    const [diagramType, setDiagramType] = React.useState<diagramType>("verticalBarChart")
    //the amount of items selected to be taken from the array
    const [amount, setAmount] = React.useState<number>(1);
    //the diagram currently selected for sending to the backend
    const [selectedDiagram, setSelectedDiagram] = React.useState<Diagram>({} as Diagram)
    //holds the url of the current image returned by the backend
    const [imageURL, setImageURL] = React.useState("");


    /**
     * Restores all data of the current session when the page is reloaded. Used to not loose data on reloading the page.
     */
    React.useEffect(() => {
        //diagramStep
        setDiagramStep(Number(sessionStorage.getItem("diagramStep-" + uniqueId)||0));
        //diagramSource
        setDiagramSource(sessionStorage.getItem("diagramSource-" + uniqueId)||"");
        //arrayObjects
        setArrayObjects(sessionStorage.getItem("arrayObjects-" + uniqueId)===null?new Array<ArrayDiagramProperties>():JSON.parse(sessionStorage.getItem("arrayObjects-" + uniqueId)!));
        //historizedObjects
        setHistorizedObjects(sessionStorage.getItem("historizedObjects-" + uniqueId)===null?new Array<HistorizedDiagramProperties>():JSON.parse(sessionStorage.getItem("historizedObjects-" + uniqueId)!));
        //diagramName
        setDiagramName(sessionStorage.getItem("diagramName-" + uniqueId)||"");
        //diagramType
        setDiagramType(sessionStorage.getItem("diagramType-" + uniqueId) as diagramType||"verticalBarChart");
        //amount
        setAmount(Number(sessionStorage.getItem("amount-" + uniqueId)||1));
    }, [])
    //store step in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("diagramStep-" + uniqueId, diagramStep.toString());
    }, [diagramStep])
    //store diagramSource in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("diagramSource-" + uniqueId, diagramSource);
    }, [diagramSource])
    //store arrayObjects in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("arrayObjects-" + uniqueId, JSON.stringify(arrayObjects));
    }, [arrayObjects])
    //store historizedObjects in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("historizedObjects-" + uniqueId, JSON.stringify(historizedObjects));
    }, [historizedObjects])
    //store diagramName in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("diagramName-" + uniqueId, diagramName);
    }, [diagramName])
    //store diagramType in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("diagramType-" + uniqueId, diagramType);
    }, [diagramType])
    //store amount in sessionStorage
    React.useEffect(() => {
        sessionStorage.setItem("amount-" + uniqueId, amount.toString());
    }, [amount])

    /**
     * Removes all items of this component from the sessionStorage.
     */
    const clearSessionStorage = () => {
        sessionStorage.removeItem("diagramStep-" + uniqueId);
        sessionStorage.removeItem("diagramSource-" + uniqueId);
        sessionStorage.removeItem("arrayObjects-" + uniqueId);
        sessionStorage.removeItem("historizedObjects-" + uniqueId);
        sessionStorage.removeItem("diagramName-" + uniqueId);
        sessionStorage.removeItem("diagramType-" + uniqueId);
        sessionStorage.removeItem("amount-" + uniqueId);
        sessionStorage.removeItem("selectedArrays-" + uniqueId);
        sessionStorage.removeItem("selectedHistorized-" + uniqueId);
        sessionStorage.removeItem("selectedType-" + uniqueId);
        sessionStorage.removeItem("selectedHistorizedOrdinal-" + uniqueId);
        sessionStorage.removeItem("selectedArrayOrdinal-" + uniqueId);
    }

    /**
     * Creates the plots array for a selected diagram to be sent to the backend.
     * @param diagram the diagram to be transformed
     */
    const createPlots = React.useCallback((diagram: Diagram) => {
        console.log(diagram.arrayObjects);
        const plotArray: Array<Plots> = [];
        let type: string;
        //transform the type to the string the backend needs
        switch (diagram.variant) {
            case "verticalBarChart": {
                type = "bar";
                break;
            }
            case "horizontalBarChart": {
                type = "barh";
                break;
            }
            case "dotDiagram": {
                type = "scatter";
                break;
            }
            case "lineChart": {
                type = "line";
                break;
            }
            case "pieChart": {
                type = "pie";
                break;
            }
        }
        if (diagram.sourceType === "Array") {
            if (diagram.arrayObjects !== undefined) {
                diagram.arrayObjects.forEach((item) => {
                    const plots = {
                        customLabels: item.customLabels,
                        primitive: !Array.isArray(item.listItem.value),
                        plots: {
                            type: type,
                            x: Array.from(Array(amount).keys()),
                            y: item.listItem.parentKeyName === "" ? item.listItem.keyName : item.listItem.parentKeyName + "|" + item.listItem.keyName,
                            color: item.color,
                            numericAttribute: item.numericAttribute,
                            stringAttribute: item.stringAttribute,
                            x_ticks: {
                                ticks: item.labelArray
                            }
                        }
                    }
                    plotArray.push(plots);
                })
            }
        } else {
            //"Historized"
            if (diagram.historizedObjects !== undefined) {
                diagram.historizedObjects.forEach((item) => {
                    const plots = {
                        dateLabels: item.dateLabels,
                        plots: {
                            type: type,
                            x: Array.from(Array(amount).keys()),
                            y: item.name,
                            color: item.color,
                            dateFormat: item.dateFormat,
                            x_ticks: {
                                ticks: item.labelArray
                            }
                        }
                    }
                    plotArray.push(plots);
                })
            }
        }
        return plotArray;
    }, [amount])

    /**
     * Handler for the return of a successful call to the backend (posting test diagram)
     * @param jsonData The JSON-object delivered by the backend
     */
    const handleSuccessDiagramPreview = (jsonData: any) => {
        //TODO: set the image path to the current one returned by the backend
    }

    //extracts method from props to use it in the dependencies of handleErrorDiagramPreview
    const reportError = props.reportError;
    /**
     * Handler for unsuccessful call to the backend (posting test-diagram)
     * @param err The error returned by the backend
     */
    const handleErrorDiagramPreview = React.useCallback((err: Error) => {
        reportError("Fehler: Senden des Diagramms an das Backend fehlgeschlagen! (" + err.message + ")");
    }, [reportError]);

    //extract infoProviderName from props to use it in dependencies
    const infoProviderName = props.infoProviderName;

    //this static value will be true as long as the component is still mounted
    //used to check if handling of a fetch request should still take place or if the component is not used anymore
    const isMounted = useRef(true);

    /**
     * Method to send a diagram to the backend for testing.
     * The standard hook "useCallFetch" is not used here since it seemingly caused method calls on each render.
     */
    const fetchPreviewImage = React.useCallback(() => {
        //("fetcher called");
        let url = "/visuanalytics/testdiagram"
        //if this variable is set, add it to the url
        if (process.env.REACT_APP_VA_SERVER_URL) url = process.env.REACT_APP_VA_SERVER_URL + url
        //setup a timer to stop the request after 5 seconds
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), 5000);
        //starts fetching the contents from the backend
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json\n"
            },
            body: JSON.stringify({
                type: "diagram_custom",
                diagram_config: {
                    infoProviderName: infoProviderName,
                    type: "custom",
                    name: diagramName,
                    plots: createPlots({
                        name: diagramName,
                        variant: diagramType,
                        sourceType: diagramSource,
                        historizedObjects: historizedObjects,
                        arrayObjects: arrayObjects
                    })
                }
            }),
            signal: abort.signal
        }).then((res: Response) => {
            //handles the response and gets the data object from it
            if (!res.ok) throw new Error(`Network response was not ok, status: ${res.status}`);
            return res.status === 204 ? {} : res.json();
        }).then((data) => {
            //success case - the data is passed to the handler
            //only called when the component is still mounted
            if(isMounted) handleSuccessDiagramPreview(data)
        }).catch((err) => {
            //error case - the error code ist passed to the error handler
            //only called when the component is still mounted
            if(isMounted) handleErrorDiagramPreview(err)
        }).finally(() => clearTimeout(timer));
    }, [infoProviderName, diagramName, diagramType, diagramSource, historizedObjects, arrayObjects, createPlots, handleErrorDiagramPreview])

    //defines a cleanup method that sets isMounted to false when unmounting
    //will signal the fetchMethod to not work with the results anymore
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    //use of useCallFetch was quit since it caused function calls on each render
    /**
     * Method to get a preview of the created diagram.
     * The backend creates the diagram with the given settings and return it as an image.
     */
    /*const fetchPreviewImage = useCallFetch("/testdiagram",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "custom",
                name: diagramName,
                sourceType: diagramSource,
                plots: createPlots({
                    name: diagramName,
                    variant: diagramType,
                    sourceType: diagramSource,
                    historizedObjects: historizedObjects,
                    arrayObjects: arrayObjects
                })
            })
        }, handleSuccessDiagramPreview, handleErrorDiagramPreview
    );*/


    /**
     * Finishes the creation of a single diagram by writing the data into an object that stores all informations.
     */
    const finishCreate = () => {
        //create the diagram object and add it to the array holding them
        const diagramObject = {
            name: diagramName,
            variant: diagramType,
            sourceType: diagramSource,
            historizedObjects: historizedObjects,
            arrayObjects: arrayObjects
        }
        const arCopy = props.diagrams.slice();
        arCopy.push(diagramObject);
        props.setDiagrams(arCopy);
        //empty all selection states to prepare for the next diagram
        setDiagramSource("");
        setDiagramName("");
        setDiagramType("verticalBarChart");
        setArrayObjects([]);
        setHistorizedObjects([]);
        setAmount(1);
        //since we dont want default values in sessionStorage we empty it here
        clearSessionStorage();
        //go back to overview
        setDiagramStep(0);
    }

    /**
     * Checks if the currently entered name is already contained in the diagrams array.
     */
    const isNameDuplicate = () => {
        for (let index=0; index < props.diagrams.length; index++) {
            if(props.diagrams[index].name===diagramName) return true;
        }
        return false;
    }


    /**
     * Runs through the provided array of listItems recursively and returns all arrays that are compatible for diagram usage.
     * @param listItems The array to be processed.
     * Arrays are compatible if they only contain items of the same type or objects.
     * Arrays containing arrays or arrays containing different primitive types are not compatible.
     * Arrays contained in objects contained in arrays are also not compatible.
     */
    const getCompatibleArrays = useCallback((listItems: Array<ListItemRepresentation>) => {
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
    }, [])

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
    const getCompatibleHistorized = useCallback((historizedData: Array<string>) => {
        //console.log("getting compatible historized");
        const compatibleHistorized: Array<string> = []
        historizedData.forEach((item) => {
            props.selectedData.forEach((data) => {
                if(data.key===item&&data.type==="Zahl") compatibleHistorized.push(item)
            })
            props.customData.forEach((data) => {
                if(data.formelName===item) compatibleHistorized.push(item)
            })
        })
        return compatibleHistorized;
    }, [props.selectedData, props.customData])

    /*
     * Update the lists whenever the source data changes
     */
    React.useEffect(() => {
        setCompatibleArrays(getCompatibleArrays(props.listItems))
    }, [props.listItems, getCompatibleArrays])

    React.useEffect(() => {
        setCompatibleHistorized(getCompatibleHistorized(props.historizedData))
    }, [props.historizedData, getCompatibleHistorized])


    const amountChangeHandler = (newAmount: number) => {
        setAmount(newAmount);
        if(diagramStep===2) {
            //changes come from array creation
            const newArrayObjects: Array<ArrayDiagramProperties> = new Array(arrayObjects.length);
            arrayObjects.forEach((item, index) => {
                const newLabels = new Array(newAmount).fill("");
                for(let i = 0; i < newLabels.length&&i<item.labelArray.length; i++) {
                    newLabels[i] = item.labelArray[i];
                }
                newArrayObjects[index] = {
                    ...item,
                    labelArray: newLabels
                };
            })
            setArrayObjects(newArrayObjects);
        } else if (diagramStep===3) {
            //changes come from historized creation
            const newHistorizedObjects: Array<HistorizedDiagramProperties> = new Array(historizedObjects.length);
            historizedObjects.forEach((item, index) => {
                //change label Array
                const newLabels = new Array(newAmount).fill("");
                for(let i = 0; i < newLabels.length&&i<item.labelArray.length; i++) {
                    newLabels[i] = item.labelArray[i];
                }
                //change interval Array
                const newIntervalSizes = new Array(newAmount).fill(0);
                for(let i = 0; i < newLabels.length&&i<item.labelArray.length; i++) {
                    newIntervalSizes[i] = item.intervalSizes[i];
                }
                newHistorizedObjects[index] = {
                    ...item,
                    labelArray: newLabels,
                    intervalSizes: newIntervalSizes
                };
            })
            setHistorizedObjects(newHistorizedObjects);
        }
    }

    /**
     * Replaces an object within the array holding the object representations of all arrays in use
     * @param object The new object
     * @param ordinal Index of the object to be replaced
     */
    const changeObjectInArrayObjects = (object: ArrayDiagramProperties, ordinal: number) => {
        /*//find the ordinal of the object by comparing keys
        let ordinal = -1;
        for(let index = 0; index < arrayObjects.length; ++index) {
            const element = arrayObjects[index];
            if((element.listItem.parentKeyName===""?element.listItem.keyName:element.listItem.parentKeyName + "|" + element.listItem.keyName)===(object.listItem.parentKeyName===""?object.listItem.keyName:object.listItem.parentKeyName + "|" + object.listItem.keyName)) {
                ordinal = index;
                break;
            }
        }*/
        const arCopy = arrayObjects.slice();
        //this check should never fail
        if(ordinal>=0) {
            arCopy[ordinal] = object;
        }
        setArrayObjects(arCopy);
    }

    /**
     * Replaces an object within the array holding the object representations of all historized data in use
     * @param object The new object
     * @param ordinal Index of the object to be replaced
     */
    const changeObjectInHistorizedObjects = (object: HistorizedDiagramProperties, ordinal: number) => {
        const arCopy = historizedObjects.slice();
        //this check should never fail
        if(ordinal>=0) {
            arCopy[ordinal] = object;
        }
        setHistorizedObjects(arCopy);
    }

    /**
     * Selects the displayed content based on the current step
     * 0: Overview of created diagrams with option for more
     * 1: TypeSelection, also includes Selection of concrete Array
     * 2: Diagram Editor for Arrays
     * 3: Diagram Editor for historized data
     * 4: finalize creation
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
                        setDiagrams={props.setDiagrams}
                        selectedDiagram={selectedDiagram}
                        setSelectedDiagram={(diagram: Diagram) => setSelectedDiagram(diagram)}
                        createPlots={(diagram: Diagram) => createPlots(diagram)}
                        reportError={props.reportError}
                        imageURL={imageURL}
                        setImageURL={(url: string) => setImageURL(url)}
                        infoProviderName={props.infoProviderName}
                    />
                );
            case 1:
                return (
                    <DiagramTypeSelect
                        continueArray={() => {
                            setDiagramStep(2);
                            setDiagramSource("Array");
                        }}
                        continueHistorized={() =>  {
                            setDiagramStep(3);
                            setDiagramSource("Historized");
                        }}
                        backHandler={() => setDiagramStep(diagramStep-1)}
                        compatibleArrays={compatibleArrays}
                        compatibleHistorized={compatibleHistorized}
                        setArrayObjects={(arrayObjects: Array<ArrayDiagramProperties>) => setArrayObjects(arrayObjects)}
                        setHistorizedObjects={(historizedObjects: Array<HistorizedDiagramProperties>) => setHistorizedObjects(historizedObjects)}
                    />
                );
           case 2:
                return (
                    <ArrayDiagramCreator
                        continueHandler={() => setDiagramStep(4)}
                        backHandler={() => setDiagramStep(1)}
                        arrayObjects={arrayObjects}
                        setArrayObjects={(arrayObjects: Array<ArrayDiagramProperties>) => setArrayObjects(arrayObjects)}
                        changeObjectInArrayObjects={changeObjectInArrayObjects}
                        diagramType={diagramType}
                        setDiagramType={(type: diagramType) => setDiagramType(type)}
                        setDiagramName={(name: string) => setDiagramName(name)}
                        amount={amount}
                        setAmount={(amount: number) => amountChangeHandler(amount)}
                        reportError={props.reportError}
                        fetchPreviewImage={fetchPreviewImage}
                        imageURL={imageURL}
                        setImageURL={(url: string) => setImageURL(url)}
                    />
                );
            case 3:
                return (
                    <HistorizedDiagramCreator
                        continueHandler={() => setDiagramStep(4)}
                        backHandler={() => setDiagramStep(1)}
                        historizedObjects={historizedObjects}
                        setHistorizedObjects={(historizedObjects: Array<HistorizedDiagramProperties>) => setHistorizedObjects(historizedObjects)}
                        changeObjectInHistorizedObjects={changeObjectInHistorizedObjects}
                        diagramType={diagramType}
                        setDiagramType={(type: diagramType) => setDiagramType(type)}
                        setDiagramName={(name: string) => setDiagramName(name)}
                        amount={amount}
                        setAmount={(amount: number) => amountChangeHandler(amount)}
                        reportError={props.reportError}
                        schedule={props.schedule}
                        fetchPreviewImage={fetchPreviewImage}
                        imageURL={imageURL}
                        setImageURL={(url: string) => setImageURL(url)}
                    />
                );
            case 4:
                return (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                Bitte wählen sie einen Namen für das Diagramm, um die Erstellung abzuschließen:
                            </Typography>
                        </Grid>
                        <Grid item xs={9} className={classes.elementLargeMargin}>
                            <FormControl fullWidth>
                                <TextField error={isNameDuplicate()} helperText={isNameDuplicate()?"Dieser Name wird bereits durch ein Diagramm anderes verwendet":null} variant="outlined" label="Diagramm-Name" value={diagramName} onChange={(e) => setDiagramName(e.target.value)}/>
                            </FormControl>
                        </Grid>
                        <Grid item container xs={12} justify="space-between" className={classes.elementExtraLargeMargin}>
                            <Grid item>
                                <Button variant="contained" size="large" color="primary" onClick={() => setDiagramStep(diagramSource==="Array"?2:3)}>
                                    zurück
                                </Button>
                            </Grid>
                            <Grid item className={classes.blockableButtonPrimary}>
                                <Button disabled={diagramName===""} variant="contained" size="large" color="primary" onClick={() => finishCreate()}>
                                    weiter
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>
                )
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
