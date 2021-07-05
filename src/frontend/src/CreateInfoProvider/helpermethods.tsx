import {
    ArrayProcessingData, BackendCalculate, BackendReplacement,
    DataSource,
    DataSourceKey,
    Diagram,
    InfoProviderFromBackend,
    ListItemRepresentation,
    SelectedDataItem, StringReplacementData
} from "./types";

/* CreateInfoProvider */

/**
 * Returns a set that only contains the keys from selectedData.
 */
export const extractKeysFromSelection = (selectedData: Array<SelectedDataItem>) => {
    const keyArray = new Array<string>();
    selectedData.forEach((item) => keyArray.push(item.key));
    return keyArray;
}


/**
 * Method that transforms a list of array processings into a list of calculate
 * objects as they are needed by the backend
 * @param processings The list of array processings to be transformed
 */
export const createCalculates = (processings: Array<ArrayProcessingData>) => {
    const calculates: Array<BackendCalculate> = [];
    const sumNames: Array<string> = [];
    const sumReplaceNames: Array<string> = [];
    const meanNames: Array<string> = [];
    const meanReplaceNames: Array<string> = [];
    const minNames: Array<string> = [];
    const minReplaceNames: Array<string> = [];
    const maxNames: Array<string> = [];
    const maxReplaceNames: Array<string> = [];
    processings.forEach((processing) => {
        switch(processing.operation.name) {
            case "sum": {
                sumNames.push("_loop|" + processing.array);
                sumReplaceNames.push("_loop|" + processing.name);
                break;
            }
            case "mean": {
                meanNames.push("_loop|" + processing.array);
                meanReplaceNames.push("_loop|" + processing.name);
                break;
            }
            case "min": {
                minNames.push("_loop|" + processing.array);
                minReplaceNames.push("_loop|" + processing.name);
                break;
            }
            case "max": {
                maxNames.push("_loop|" + processing.array);
                maxReplaceNames.push("_loop|" + processing.name);
            }
        }
    })
    //add the object for the sum calculations
    if(sumNames.length > 0) {
        calculates.push({
            type: "calculate",
            action: "sum",
            keys: sumNames,
            new_keys: sumReplaceNames,
            decimal: 2
        });
    }
    //add the object for the mean calculations
    if(meanNames.length > 0) {
        calculates.push({
            type: "calculate",
            action: "mean",
            keys: meanNames,
            new_keys: meanReplaceNames,
            decimal: 2
        });
    }
    //add the object for the min calculations
    if(minNames.length > 0) {
        calculates.push({
            type: "calculate",
            action: "min",
            keys: minNames,
            new_keys: minReplaceNames,
            decimal: 2
        });
    }
    //add the object for the max calculations
    if(maxNames.length > 0) {
        calculates.push({
            type: "calculate",
            action: "max",
            keys: maxNames,
            new_keys: maxReplaceNames,
            decimal: 2
        });
    }
    return calculates;
}

/**
 * Method that transforms a list of string replacements into a list of replacement
 * objects as they are needed by the backend
 * @param replacements The list of string replacements to be transformed
 */
export const createReplacements = (replacements: Array<StringReplacementData>) => {
    const replacementObjects: Array<BackendReplacement> = [];
    replacements.forEach((replacement) => {
        replacementObjects.push({
            type: "replace",
            keys: [replacement.string],
            new_keys: [replacement.name],
            old_value: replacement.replace,
            new_value: replacement.with,
            count: -1
        });
    })
    return replacementObjects;
}


/* DataSelection */

/**
 * Takes an object (supposed to be JSON data) and returns an array representation of it.
 * @param jsonData The data-Object to be turned into an array.
 * @param parent Used for recursive calls, marks the parent of items in a sub-object.
 */
export const transformJSON = (jsonData: any, parent = "") => {
    let stringRep = JSON.stringify(jsonData);
    //console.log(stringRep)
    const resultArray: Array<(ListItemRepresentation)> = [];
    let finished = true;
    stringRep = stringRep.substring(1);
    while (finished) {
        //get the key name
        let key = stringRep.split(":", 2)[0];
        stringRep = stringRep.substring(key.length + 1);
        key = key.substring(1, key.length - 1);
        //console.log("key: " + key);

        let value: any = "";
        //check if the value is another object
        if (stringRep[0] === "{") {
            //The value is a sub-object or an array
            let subObject = stringRep.split("}", 1)[0] + "}"
            let counter = 1;
            //detect the whole sub-object/array
            while (subObject.split("{").length - 1 !== subObject.split("}").length - 1) {
                let splitArray = stringRep.split("}", counter);
                subObject = "";
                for (let i = 0; i < counter; i++) {
                    subObject += splitArray[i] + "}";
                }
                counter += 1;
            }
            //console.log("checking subobject: " + subObject);
            //lookahead to the next key - if it is same_type, we know that we have an array
            let nextKey = subObject.split(":", 2)[0];
            //strip quotation marks and the opening curly bracket
            nextKey = nextKey.substring(2, nextKey.length - 1);
            //console.log("nextKey: " + nextKey);
            if (nextKey === "same_type") {
                //a sub array was detected
                let same_type_value = subObject.split(",", 2)[0];
                same_type_value = same_type_value.substring(nextKey.length + 4);
                //console.log(same_type_value)
                //we also parse the length and store it in the corresponding attribute
                let array_length = subObject.split(",", 2)[1];
                array_length = array_length.substring(9);
                //console.log(array_length);
                //console.log(subObject);
                //if the array has no contents, dont inspect the subObject
                if(array_length === "0") {
                    //when the array contains no values, searching for subobjects only produces errors
                    resultArray.push({
                        keyName: key + "|0",
                        value: "[keine Werte]",
                        parentKeyName: parent,
                        arrayRep: true,
                        arrayLength: parseInt(array_length)
                    })
                } else if (same_type_value === "true") {
                    //check if the value of nextKey is "true" - if this is the case, our value is the subobject
                    //we now need to differentiate if the content is an object or primitives
                    let element = subObject.substring(24 + same_type_value.length + array_length.length).split(":", 1)[0]
                    if (element.substring(1, element.length - 1) === "object") {
                        //when the object starts with sameType as the first key, we need to mark it as array in array and not further display it
                        let object = subObject.substring(33 + same_type_value.length + array_length.length, subObject.length - 1);
                        let objectLookahead = object.split(":")[0];
                        if (objectLookahead.substring(2, objectLookahead.length - 1) === "same_type") {
                            value = "[Array]"
                        } else {
                            value = transformJSON(JSON.parse(object), (parent === "" ? key : parent + "|" + key) + "|0")
                        }
                        resultArray.push({
                            keyName: key + "|0",
                            value: value,
                            parentKeyName: parent,
                            arrayRep: true,
                            arrayLength: parseInt(array_length)
                        })
                    } else {
                        //primitive array contents
                        value = subObject.substring(32 + same_type_value.length + array_length.length, subObject.length - 2);
                        resultArray.push({
                            keyName: key + "|0",
                            value: value,
                            parentKeyName: parent,
                            arrayRep: true,
                            arrayLength: parseInt(array_length)
                        })
                    }
                } else {
                    //if it is false, we set a string containing all the data types
                    let object = subObject.substring(31 + same_type_value.length + array_length.length, subObject.length - 1);
                    let typeString = "";
                    for (let x of object.substring(1, object.length - 1).split(",")) {
                        typeString += x.substring(1, x.length - 1) + ", ";
                    }
                    typeString = typeString.substring(0, typeString.length - 2);
                    // if the typestring contains opening and closing brackets, objects are the types
                    // - we dont fully display them since the data would be too big
                    if(typeString.includes("{")&&typeString.includes("}")) typeString="different object types"
                    resultArray.push({
                        keyName: key + "|0",
                        value: typeString,
                        parentKeyName: parent,
                        arrayRep: true,
                        arrayLength: parseInt(array_length)
                    })
                }
                //cut the handled array-object
                stringRep = stringRep.substring(subObject.length + 1);
                if (stringRep.length === 0) finished = false;
                continue
            }
            //only reached when it is an object, not an array
            value = transformJSON(JSON.parse(subObject), parent === "" ? key : parent + "|" + key);
            stringRep = stringRep.substring(subObject.length + 1);
        } else {
            //the value is a type, the data is primitive
            value = stringRep.includes(",") ? stringRep.split(",", 1)[0] : stringRep.split("}", 1)[0];
            stringRep = stringRep.substring(value.length + 1);
        }
        //get the returned array or the read value and store it in the listItem
        if (value.includes('"')) value = value.substring(1, value.length - 1);
        resultArray.push({
            keyName: key,
            value: value,
            parentKeyName: parent,
            arrayRep: false,
            arrayLength: 0
        })
        if (stringRep.length === 0) finished = false;
    }
    return resultArray;
};


/* DataCustomization */
/**
 * Returns an array of all elements contained in the listItems. Used for checking duplicate names in formula creation.
 * Also includes the names of arrays and objects to avoid further problems, even though they cant be selected (yet).
 * @param listItems The listItems the list should be processed.
 */
export const getListItemsNames = (listItems: Array<ListItemRepresentation>) => {
    let listItemNames: Array<string> = [];
    //full name getter: data.parentKeyName===""?data.keyName:data.parentKeyName + "|" + data.keyName
    //loop through all elements
    listItems.forEach((data) => {
        //for all cases (primitive, object, array), the name needs to be added to the list
        listItemNames.push(data.parentKeyName === "" ? data.keyName : data.parentKeyName + "|" + data.keyName);
        //check for objects or array
        if (Array.isArray(data.value)) {
            //recursive call to add all names in the object or array
            listItemNames = listItemNames.concat(getListItemsNames(data.value));
        }
    });
    return listItemNames;
}

/**
 * Receives a string and checks if it consist only of numbers (0-9).
 * @param arg The String to be checked.
 */
export const checkFindOnlyNumbers = (arg: string): boolean => {

    let onlyNumbers: boolean = true;

    for (let i: number = 0; i <= arg.length - 1; i++) {

        if (arg.charAt(i) !== '0' &&
            arg.charAt(i) !== '1' &&
            arg.charAt(i) !== '2' &&
            arg.charAt(i) !== '3' &&
            arg.charAt(i) !== '4' &&
            arg.charAt(i) !== '5' &&
            arg.charAt(i) !== '6' &&
            arg.charAt(i) !== '7' &&
            arg.charAt(i) !== '8' &&
            arg.charAt(i) !== '9'
        ) {
            onlyNumbers = false;
        }

    }

    return onlyNumbers;
}

//TODO: add the string replacement and array processings here
/**
 * Method that transforms an infoProvider from the backend data format to a frontend data format representation
 * @param data
 */
export const transformBackendInfoProvider = (data: InfoProviderFromBackend) => {
    const infoProviderName: string = data.infoprovider_name;
    console.log(infoProviderName);
    const diagrams: Array<Diagram> = data.diagrams_original;
    console.log(diagrams);
    const dataSources: Array<DataSource> = [];
    const dataSourcesKeys: Map<string, DataSourceKey> = new Map();
    data.datasources.forEach((backendDataSource) => {
        //add the dataSource to the array
        dataSources.push({
            apiName: backendDataSource.datasource_name,
            query: backendDataSource.api.api_info.url_pattern,
            noKey: backendDataSource.api.method==="noAuth",
            method: backendDataSource.api.method==="noAuth"?"":backendDataSource.api.method,
            selectedData: backendDataSource.selected_data,
            customData: backendDataSource.formulas,
            historizedData: backendDataSource.historized_data,
            schedule: {
                type: backendDataSource.schedule.type,
                weekdays: backendDataSource.schedule.weekdays,
                time: backendDataSource.schedule.time,
                interval: backendDataSource.schedule.timeInterval,
            },
            listItems: new Array<ListItemRepresentation>(),
            arrayProcessingsList: backendDataSource.arrayProcessingsList,
            stringReplacementList: backendDataSource.stringReplacementList
        });
        //set the api keys in the map
        let apiKeyInput1: string;
        let apiKeyInput2 = "";
        //if the method is Bearer Token, then only key one is set
        if(backendDataSource.api.method==="BearerToken") {
            apiKeyInput1 = backendDataSource.api.api_info.api_key_name;
        } else {
            apiKeyInput1 = backendDataSource.api.api_info.api_key_name.split("||")[0];
            apiKeyInput2 = backendDataSource.api.api_info.api_key_name.substring(apiKeyInput1.length + 2);
        }
        dataSourcesKeys.set(backendDataSource.datasource_name, {
            apiKeyInput1: apiKeyInput1,
            apiKeyInput2: apiKeyInput2
        })
    })

    console.log("created infoProvider for editing:");
    console.log({
        infoproviderName: infoProviderName,
        dataSources: dataSources,
        dataSourcesKeys: dataSourcesKeys,
        diagrams: diagrams
    });

    return {
        infoproviderName: infoProviderName,
        dataSources: dataSources,
        dataSourcesKeys: dataSourcesKeys,
        diagrams: diagrams
    }
}


/* HistorizedDiagramCreator */
/**
 * Returns the string representation of a weekday.
 * @param weekdayNumber The numeric representation of a weekday. (Should range from 0 to 6)
 */
export const getWeekdayString = (weekdayNumber: number) => {
    switch (weekdayNumber) {
        case 0:
            return "Mo";
        case 1:
            return "Di";
        case 2:
            return "Mi";
        case 3:
            return "Do"
        case 4:
            return "Fr";
        case 5:
            return "Sa";
        case 6:
            return "So";
    }
}
