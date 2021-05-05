/**
 * The String-Argument-Class represents an Object that is created when a Button of the Calculator is triggered
 */
export class StrArg {

    /**
     * Represents the Object as actual string.
     */
    stringRep: string;
    /**
     * Shows if the Object holds an Operator.
     */
    isOp: boolean;

    constructor(strRep: string, isOp: boolean) {
        this.stringRep = strRep;
        this.isOp = isOp;
    }

    /**
     * This Method generates the correct string-representation. If the object holds an Operator it is surrounded by Blank-Charakters
     */
    public makeStringRep (): string {
        if (this.isOp) {
            return (' ' + this.stringRep + ' ');
        } else {
            return this.stringRep;
        }
    }
}
