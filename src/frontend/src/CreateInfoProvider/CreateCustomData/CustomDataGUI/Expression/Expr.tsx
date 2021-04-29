import React from "react";

/*export const Expr: React.FC<ExprProps> = (props) => {

    const[stringRep, setStringRep] = React.useState<string>('');
    const[lop, setLop] = React.useState<ExprProps>();

    return (
      <React.Fragment>

      </React.Fragment>
    );
}*/

export class Expr{

    stringRep: string = '';
    flagSimpleOperator: boolean;
    operation;
    lop?: Expr;
    rop?: Expr;


    constructor(flagSimpleOperator: boolean, strRep: string, operation: string) {
        this.operation = operation;
        this.flagSimpleOperator = flagSimpleOperator;
        this.stringRep = strRep;
    }

    public makeStringRep (): string {

        return (' ' + this.stringRep + ' ');

        /*
        if (this.flagSimpleOperator) {
            return (' ' + this.stringRep + ' ');
        } else {
            return (this.lop.makeStringRep() + ' ' + this.operation + ' ' + this.rop.makeStringRep());
        }
        */
    }
}
