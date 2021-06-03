/**
 * Represents a formula in an Object.
 */
export class FormelObj {

    /**
     * The variable name of the formula
     */
    formelName: string;
    /**
     * The actual formula as String
     */
    formelString: string;

    constructor(formelName: string, formelString: string) {
        this.formelName = formelName;
        this.formelString = formelString;
    }

}
