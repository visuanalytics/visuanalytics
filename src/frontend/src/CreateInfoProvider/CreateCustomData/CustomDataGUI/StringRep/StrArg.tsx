import React from "react";

export class StrArg {

    stringRep: string;
    isOp: boolean;
    isNumber: boolean;
    indexForNumbers: number;


    constructor(strRep: string, isOp: boolean, isNumber: boolean, indexForNumbers: number) {
        this.stringRep = strRep;
        this.isOp = isOp;
        this.isNumber = isNumber;
        this.indexForNumbers = indexForNumbers;
    }

    public makeStringRep (): string {
        if (this.isOp) {
            return (' ' + this.stringRep + ' ');
        } else {
            return this.stringRep;
        }
    }
}
