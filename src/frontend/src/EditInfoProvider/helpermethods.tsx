//import React from "react";
import {StrArg} from "../CreateInfoProvider/CreateCustomData/CustomDataGUI/formelObjects/StrArg";



/**
 * This method receives an array with string-arguments and creates the output string with makeStringRep()
 * @param calculation the Array that should be transformed
 *
 */
export const calculationToString = (calculation: Array<StrArg>) => {
    let stringToShow: string = '';

    for (let i: number = 0; i < calculation.length; i++) {
        stringToShow = stringToShow + calculation[i].makeStringRep();
    }

    return stringToShow;
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

/**
 * Receives a string and checks if it consist only of operators (+,-,*,/,%).
 * Only the first character hast to be checked because an operator is only one character.
 * @param arg The String to be checked.
 */
export const checkOperator = (arg: string) => {
    return (
        arg.charAt(0) === '+' ||
        arg.charAt(0) === '-' ||
        arg.charAt(0) === '*' ||
        arg.charAt(0) === '/' ||
        arg.charAt(0) === '%'
    );
}
