/* CreateInfoProvider */
//TODO: possibly find a better solution - objects are a nice structure, but comparison takes up compute time since conversions are necessary
//data type for elements contained in selectedData
import {FormelObj} from "./CreateCustomData/CustomDataGUI/formelObjects/FormelObj";

export type SelectedDataItem = {
    key: string;
    type: string;
}

// data type to save information about the selected schedule for historisation
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
    listItems: Array<ListItemRepresentation>
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
    formulas: Array<FormelObj>
    schedule: {
        type: string;
        time: string;
        date: string;
        time_interval: string;
        weekdays: Array<number>;
    };
    selected_data: Array<SelectedDataItem>;
    historized_data: Array<string>;
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
    value: any;
    parentKeyName: string;
    arrayRep: boolean;
    arrayLength: number;
}


/* CreateCustomData */
/**
 * Defines the type that is expected for the backends answer to our request
 */
export type customDataBackendAnswer = {
    accepted: boolean
    //error: string
}


/* DiagramCreation */
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
    plot: {
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