import React from "react";

export class StrArg {

    stringRep: string;
    isOp: boolean;
    isNumber: boolean;


    constructor(strRep: string, isOp: boolean, isNumber: boolean) {
        this.stringRep = strRep;
        this.isOp = isOp;
        this.isNumber = isNumber;
    }

    public makeStringRep (): string {
        if (this.isOp) {
            return (' ' + this.stringRep + ' ');
        } else {
            return this.stringRep;
        }
    }
}
