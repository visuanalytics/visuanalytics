import React from "react";

export class StrArg {

    stringRep: string;
    isOp: boolean;


    constructor(strRep: string, isOp: boolean) {
        this.stringRep = strRep;
        this.isOp = isOp;
    }

    public makeStringRep (): string {
        if (this.isOp) {
            return (' ' + this.stringRep + ' ');
        } else {
            return this.stringRep;
        }
    }
}
