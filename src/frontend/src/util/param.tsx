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

// validate parameter values
export const validateParamValues = (values: ParamValues, params: Param[] | undefined): boolean => {
    if (params === undefined)
        return true;

    return params.every((p: Param) => {
        switch (p.type) {
            case "subParams":
                if (!p.optional || values[p.name]) {
                    return p.subParams === null ? true : validateParamValues(values, p.subParams);
                }
                break;
            case "string":
            case "number":
            case "enum":
                if (!p.optional) {
                    const v = values[p.name];
                    return v.trim() !== "";
                }
                break;
            case "multiString":
            case "multiNumber":
                if (!p.optional) {
                    const vs = values[p.name];
                    return vs.map((v: string) => v.trim()).filter((v: string) => v !== "").length > 0;
                }
                break;
        }
        return true;
    })
}

// trim all string / string[] values
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
            cValues[k] = cValues[k].map((s: string) => s.trim()).filter((s: string) => s !== "");
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
            const v = values[p.name];
            if (p.type === "subParams" && (!p.optional || v)) {
                const stValues = toTypedValues(values, p.subParams);
                tValues = { ...tValues, ...stValues };
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