export interface Param {
    name: string,
    displayName: string,
    type: string,
    optional: boolean,
    defaultValue: string | null,
    enumValues: enumValue[] | null,
    subParams: Param[] | null
}

interface enumValue {
    value: string,
    displayValue: string;
}

export interface ParamValues {
    [key: string]: any
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


// initializes an object with param names as keys and default values ("", false, []) as values
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