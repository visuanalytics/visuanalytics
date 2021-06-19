import {
    DataSource,
    DataSourceKey,
    Diagram,
    InfoProviderFromBackend,
    ListItemRepresentation,
    SelectedDataItem
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


/* CreateCustomData */
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
