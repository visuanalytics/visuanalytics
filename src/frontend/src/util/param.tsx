// represents parameter information
export type Param = StringParam
    | NumberParam
    | MultiNumberParam
    | MultiStringParam
    | BoolParam
    | EnumParam
    | SuperParam

// represents the selected values for a collection of `Param`
export interface ParamValues {
    [key: string]: any
}

interface TypedParamValues {
    [key: string]: { type: string, value: any }
}

interface IParam {
    name: string;
    displayName: string;
    optional: boolean;
}

interface StringParam extends IParam {
    type: "string"
}

interface NumberParam extends IParam {
    type: "number"
}

interface MultiStringParam extends IParam {
    type: "multiString"
}

interface MultiNumberParam extends IParam {
    type: "multiNumber"
}

interface BoolParam extends IParam {
    type: "boolean"
}

interface EnumParam extends IParam {
    type: "enum"
    enumValues: EnumValue[]
}

interface SuperParam extends IParam {
    type: "subParams"
    subParams: Param[]
}

interface EnumValue {
    value: string,
    displayValue: string;
}

// validate a single paramter value
export const validateParamValue = (value: any, param: Param) => {
    const optional = param.optional;
    switch (param.type) {
        case "string":
        case "enum":
            const ev = value.trim();
            if (!optional) {
                return ev !== "" && !ev.includes(",");
            }
            return true;
        case "number":
            const nv = value.trim();
            if (!optional) {
                return nv !== "" && !isNaN(Number(nv));
            }
            return nv === "" || !isNaN(Number(nv));
        case "multiString":
            const msv: string[] = value.map((v: string) => v.trim());
            if (!optional) {
                return msv.length > 0 && msv.every(v => v !== "");
            }
            return true;
        case "multiNumber":
            const mnv: string[] = value.map((v: any) => String(v).trim());
            if (!optional) {
                return mnv.length > 0 && mnv.every(v => v !== "" && !isNaN(Number(v)));
            }
            return mnv.filter(v => v !== "").length === 0 || mnv.every(v => v !== "" && !isNaN(Number(v)));
        default:
            return true;
    }
}


// get list of names of parameters with invalid values
export const getInvalidParamValues = (values: ParamValues, params: Param[] | undefined): string[] => {
    if (params === undefined || (params.length > 0 && Object.keys(values).length === 0))
        return [""];

    let invalid: string[] = [];

    params.forEach((p: Param) => {
        switch (p.type) {
            case "subParams":
                if (!p.optional || values[p.name]) {
                    if (p.subParams !== null) {
                        const subInvalid = getInvalidParamValues(values, p.subParams);
                        invalid = [...invalid, ...subInvalid];
                    }
                }
                break;
            default:
                if (!validateParamValue(values[p.name], p)) {
                    invalid = [...invalid, p.name];
                }
        }
    })
    return invalid;
}

// trim all string / string[] values and remove empty values
export const trimParamValues = (values: ParamValues): ParamValues => {
    let cValues: ParamValues = { ...values }
    Object.keys(cValues).forEach((k) => {
        if (typeof (cValues[k]) === "string") {
            const v = cValues[k].trim();
            if (v === "") {
                const { [k]: x, ...r } = cValues;
                cValues = r;
            } else {
                cValues[k] = v;
            }
        } else if (cValues[k] instanceof Array) {
            const v = cValues[k].map((s: any) => String(s).trim()).filter((s: string) => s !== "");
            if (v.every((s: any) => String(s) === "")) {
                const { [k]: x, ...r } = cValues;
                cValues = r;
            } else {
                cValues[k] = v;
            }
        }
    })
    return cValues;
}


// initialize an object with param names as keys
export const initSelectedValues = (params: Param[] | undefined) => {
    let selected: ParamValues = {};
    params?.forEach(p => {
        switch (p.type) {
            case "string":
            case "number":
            case "enum":
                selected[p.name] = "";
                break;
            case "multiString":
            case "multiNumber":
                selected[p.name] = []
                break;
            case "boolean":
                selected[p.name] = false;
                break;
            case "subParams":
                if (p.optional) {
                    selected[p.name] = false;
                }
                let subSelected = {}
                subSelected = initSelectedValues(p.subParams)
                selected = { ...selected, ...subSelected };
        }
    })
    return selected;
}

export const toTypedValues = (values: ParamValues, params: Param[] | undefined) => {
    let tValues: TypedParamValues = {};
    params?.forEach(p => {
        if (p.name in values) {
            let v = values[p.name];
            if (p.type === "subParams" && (!p.optional || v)) {
                const stValues = toTypedValues(values, p.subParams);
                tValues = { ...tValues, ...stValues };
            }
            if (p.type === "number") {
                v = Number(v);
            }
            if (p.type === "multiNumber") {
                v = v.map((n: any) => Number(n));
            }
            tValues[p.name] = { type: p.type, value: v };
        }
        if ((p.type === "subParams" && !p.optional)) {
            const stValues = toTypedValues(values, p.subParams);
            tValues = { ...tValues, ...stValues };
        }
    })
    return tValues;
}