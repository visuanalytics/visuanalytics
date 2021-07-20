/* CreateInfoProvider */
//TODO: possibly find a better solution - objects are a nice structure, but comparison takes up compute time since conversions are necessary
//data type for elements contained in selectedData
import {FormelObj} from "./DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

export type SelectedDataItem = {
    key: string;
    type: string;
    arrayValueType?: string;
}

// data type to save information about the selected schedule for historization
export type Schedule = {
    type: string;
    weekdays: number[];
    time: string;
    interval: string;
}

export type DataSource = {
    apiName: string;
    query: string;
    noKey: boolean;
    method: string;
    selectedData: SelectedDataItem[];
    customData: FormelObj[];
    historizedData: string[];
    schedule: Schedule;
    listItems: Array<ListItemRepresentation>;
    arrayProcessingsList: Array<ArrayProcessingData>;
    stringReplacementList: Array<StringReplacementData>;
}

/**
 * Type that represents an array processing in the backend,
 * called "Calculate" there.
 */
export type BackendCalculate = {
    type: string;
    action: string;
    keys: Array<string>;
    innerKey?: Array<string>;
    new_keys: Array<string>;
    decimal: number;
}

/**
 * Type that represents a string replacement in the backend,
 * called "Replacement" there.
 */
export type BackendReplacement = {
    type: string;
    keys: Array<String>;
    new_keys: Array<String>;
    old_value: string;
    new_value: string;
    count: number;
}

//data Source as sent to and returned from the backend
export type BackendDataSource = {
    datasource_name: string;
    api: {
        api_info: {
            type: string;
            api_key_name: string;
            url_pattern: string;
        };
        method: string;
        response_type: string;
    };
    // TODO use real data type for arrays (Backend needs to provide information)
    transform: Array<any>;
    storing: Array<any>;
    formulas: Array<FormelObj>,
    calculates: Array<BackendCalculate>;
    replacements: Array<BackendReplacement>;
    schedule: {
        type: string;
        time: string;
        date: string;
        timeInterval: string;
        weekdays: Array<number>;
    };
    selected_data: Array<SelectedDataItem>;
    historized_data: Array<string>;
    arrayProcessingsList: Array<ArrayProcessingData>;
    stringReplacementList: Array<StringReplacementData>;
    listItems: Array<ListItemRepresentation>;
}

//type/format of infoproviders returned by the backend
export type InfoProviderFromBackend = {
    infoprovider_name: string;
    datasources: Array<BackendDataSource>;
    //there is a structure in this type, but since we dont know the diagram names
    //we also dont know how many keys with which names exist
    diagrams: any;
    diagrams_original: Array<Diagram>;
    arrays_used_in_diagrams: Array<string>;
}

export type FrontendInfoProvider = {
    infoproviderName: string;
    dataSources: Array<DataSource>;
    dataSourcesKeys: Map<string, DataSourceKey>;
    diagrams: Array<Diagram>;
}

export type DataSourceKey = {
    apiKeyInput1: string;
    apiKeyInput2: string;
}

//TODO: rename
export type authDataDialogElement = {
    name: string;
    method: string;
}


//unique application id used to avoid collisions in session storage
export const uniqueId = "ddfdd278-abf9-11eb-8529-0242ac130003"

/* BasicSettings */
/**
 * Defines the type that is expected for the backends answer to our request
 */
export type testDataBackendAnswer = {
    status: number
    api_keys: object
}

/* DataSelection */
/** Internal representation of a list item extracted from the JSON object.
 * @param keyName The direct key name of the entry
 * @param value Holds a string with the type of the value or a sub-object
 * @param parentKeyName Holds the keyName of the parent as a full path within the JSON object
 * @param arrayRep True when this entry represents an array, used for specific rendering
 * @param arrayLength Holds the length of the array, if it is such
 */
export type ListItemRepresentation = {
    keyName: string;
    value: string|Array<ListItemRepresentation>;
    parentKeyName: string;
    arrayRep: boolean;
    arrayLength: number;
}


/* DataCustomization */
/**
 * Defines the type that is expected for the backends answer to our request
 */
export type customDataBackendAnswer = {
    accepted: boolean
    //error: string
}


/* DiagramCreation */
//Type providing constants for all supported diagram types
export type diagramType = "dotDiagram" | "lineChart" | "horizontalBarChart" | "verticalBarChart" | "pieChart"

/**
 * Represents a diagram created by the user.
 * @param name Name of the diagram, has to be unique
 * @param variant displays the type of diagram defined.
 */
export type Diagram = {
    name: string;
    variant: diagramType;
    sourceType: string;
    arrayObjects?: Array<ArrayDiagramProperties>;
    historizedObjects?: Array<HistorizedDiagramProperties>;
    amount: number;
    customLabels: boolean;
    labelArray: Array<string>;
    stringAttribute: SelectedStringAttribute;
}


/**
 * Represents an array selected for diagram creation and holds attributes for all settings
 */
export type ArrayDiagramProperties = {
    listItem: ListItemRepresentation;
    numericAttribute: string;
    color: string;
    numericAttributes: Array<ListItemRepresentation>;
    stringAttributes: Array<ListItemRepresentation>
}

/**
 * Represents historized data selected for diagram creation and holds attributes for all settings
 */
export type HistorizedDiagramProperties = {
    name: string;
    color: string;
    intervalSizes: Array<number>;
    //dateLabels: boolean; //both are deactivated since there is no support for date labels by the backend
    //dateFormat: string;
}

/**
 * Represents a string attribute selected for labeling,
 * containing its name and the array it belongs to.
 */
export type SelectedStringAttribute = {
    key: string;
    array: string;
}


/**
 * Plot typed which is used for sending diagrams to the backend in fitting format.
 */
export type Plots = {
    customLabels?: boolean;
    primitive?: boolean;
    //dateLabels?: boolean; //deactived since the backend does not support date labels so far
    plot: {
        type: string;
        x: Array<number>;
        y: string;
        color: string;
        numericAttribute?: string;
        stringAttribute?: string;
        //dateFormat?: string;
        x_ticks: {
            ticks: Array<string>;
        };
    };
}

/* ArrayProcessings */
export type ArrayProcessingData = {
    name: string;
    array: ProcessableArray;
    operation: Operation;
}

export type Operation = {
    name: string;
    displayName: string;
}


/* StringProcessings */
export type StringReplacementData = {
    name: string;
    string: string;
    replace: string;
    with: string;
}

export type BackenFormula = {

}

//TODO: document this!
/**
 * Type that contains the information about a processable array.
 * Used for displaying information in the ArrayProcessings and transforming to calculates.
 */
export type ProcessableArray = {
    valueInObject: boolean; //true if this is a numeric value in an object contained in an array
    key: string;
    innerKey: string; //only used when valueInObject is 'true' - used to display the key path inside the object in the array
}
