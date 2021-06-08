//import React from "react";
import {StrArg} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
import {DataSource} from "../CreateInfoProvider/types";

/**
 * A type to hold all important information to initialize the EditSingleDataGUI correctly
 */
export type formelContext = {
    formelName: string
    parenCount: number;
    formelAsObjects: Array<StrArg>;
    dataFlag: boolean;
    numberFlag: boolean;
    opFlag: boolean;
    leftParenFlag: boolean;
    rightParenFlag: boolean;
}
