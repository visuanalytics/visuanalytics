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
export const validateParamValues = (params: Param[], values: ParamValues): boolean => {
    return params.every((p: Param) => {
        switch (p.type) {
            case "subParams":
                if (!p.optional || values[p.name]) {
                    return p.subParams === null ? true : validateParamValues(p.subParams, values);
                }
                break;
            case "string":
            case "number":
            case "enum":
                if (!p.optional) {
                    return values[p.name].trim() !== "";
                }
                break;
            case "multiString":
            case "multiNumber":
                if (!p.optional) {
                    return values[p.name].map((v: string) => v.trim()).filter((v: string) => v !== "").length > 0;
                }
                break;
        }
        return true;
    })
}

// trim all string / string[] values
export const trimParamValues = (values: ParamValues): ParamValues => {
    Object.keys(values).forEach((k) => {
        if (typeof (values[k]) === "string") {
            const v = values[k].trim();
            if (v === "") {
                const { [k]: x, ...r } = values;
                values = r;
            } else {
                values[k] = v;
            }
        } else if (values[k] instanceof Array) {
            values[k] = values[k].map((s: string) => s.trim()).filter((s: string) => s !== "");
        }
    })
    return values;
}


// initialize an object with param names as keys
export const initSelectedValues = (params: Param[]) => {
    let selected: ParamValues = {};
    params.forEach(p => {
        switch (p.type) {
            case "string":
            case "number":
            case "enum":
                selected[p.name] = "";
                break;
            case "multiString":
            case "multiNumber":
                selected[p.name] = [""]
                break;
            case "boolean":
                selected[p.name] = false;
                break;
            case "subParams":
                if (p.optional) {
                    selected[p.name] = false;
                }
                let subSelected = {}
                if (p.subParams !== null) {
                    subSelected = initSelectedValues(p.subParams)
                }
                selected = { ...selected, ...subSelected };
        }
    })
    return selected;
}