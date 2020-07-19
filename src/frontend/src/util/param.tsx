
export interface Param {
    name: string,
    displayName: string,
    type: string,
    optional: boolean,
    selected: any,
    defaultValue: string | null,
    possibleValues: PossibleValue[] | null,
    subParams: Param[] | null
}

export interface PossibleValue {
    value: string,
    displayValue: string;
}
