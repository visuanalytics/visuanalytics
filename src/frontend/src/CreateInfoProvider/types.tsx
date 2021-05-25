/* CreateInfoProvider */
//TODO: possibly find a better solution - objects are a nice structure, but comparison takes up compute time since conversions are necessary
//data type for elements contained in selectedData
import {formelObj} from "./CreateCustomData/CustomDataGUI/formelObjects/formelObj";

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
    apiKeyInput1: string;
    apiKeyInput2: string;
    noKey: boolean;
    method: string;
    selectedData: SelectedDataItem[];
    customData: formelObj[];
    historizedData: string[];
    schedule: Schedule;
}

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
