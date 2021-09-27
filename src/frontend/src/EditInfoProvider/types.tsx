//import React from "react";
import { StrArg } from "../CreateInfoProvider/DataCustomization/CreateCustomData/CustomDataGUI/formelObjects/StrArg";
/**
 * A type to hold all important information to initialize the EditSingleDataGUI correctly
 */
export type FormelContext = {
  formelName: string;
  parenCount: number;
  formelAsObjects: Array<StrArg>;
  dataFlag: boolean;
  numberFlag: boolean;
  opFlag: boolean;
  leftParenFlag: boolean;
  rightParenFlag: boolean;
  commaFlag: boolean;
  usedComma: boolean;
  usedFormulaAndApiData: Array<string>;
};

export type Schedule = {
  type: string;
  weekdays: number[];
  time: string;
  interval: string;
};
