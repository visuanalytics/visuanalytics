/**
 * The String-Argument-Class represents an Object that is created when a Button of the Calculator is triggered.
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

    /**
     * Shows if the Object holds a right Paren.
     */
    isRightParen: boolean;

    /**
     * Shows if the Object holds a left Paren.
     */
    isLeftParen: boolean;

    /**
     * Shows if the object holds a Number.
     */
    isNumber: boolean;

    /**
     * Shows if the object holds a comma.
     */
    isComma: boolean;

    constructor(strRep: string, isOp: boolean, isRightParen: boolean, isLeftParen: boolean, isNumber: boolean, isComma: boolean) {
        this.stringRep = strRep;
        this.isOp = isOp;
        this.isRightParen = isRightParen;
        this.isLeftParen = isLeftParen;
        this.isNumber = isNumber;
        this.isComma = isComma;
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
