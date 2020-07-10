
export interface Param {
    name: string,
    displayName: string,
    selected: string,
    possibleValues: PossibleValue[]
}

export interface PossibleValue {
    value: string,
    displayValue: string;
}
