import json
from ast2json import str2json

splitString = "uzjhnjtdryfguljkm"


def get_transformations(tree, k, key_name):
    operations = {
        "ADD": "add",
        "SUB": "subtract",
        "MUL": "multiply",
        "DIV": "divide",
    }

    calc_template = {
        "type": "calculate",
        "action": "",
        "decimal": 0
    }

    new_key_template = "_new_key_"

    calculations = []

    def build_calc_list(tree, k, counter, key_name=None):
        current_calc = tree[k]
        contains_calc = False
        keys = ["lop", "rop"]
        new_key = new_key_template + str(counter) if key_name is None else key_name

        for key in keys:
            if type(current_calc[key]) == dict:
                counter += 1
                current_calc[key] = build_calc_list(current_calc, key, counter)

        calculation = calc_template.copy()
        calculation["action"] = operations[current_calc["operator"]]
        calculation["decimal"] = current_calc["decimal"]
        if type(current_calc["lop"]) == str:
            calculation.update({"keys": [current_calc["lop"].replace(splitString, "|")]})
        else:
            calculation.update({"value_left": current_calc["lop"]})
        if type(current_calc["rop"]) == str:
            calculation.update({"keys_right": [current_calc["rop"].replace(splitString, "|")]})
        else:
            calculation.update({"value_right": current_calc["rop"]})
        calculation.update({"new_keys": [new_key]})

        calculations.append(calculation)
        if k != "tree":
            return new_key

    build_calc_list(tree, k, 0, key_name=key_name)
    return calculations


def parse_to_own_format(rep, decimal):
    if rep["_type"].lower() == "binop":
        return {
            "operator": rep["op"]["_type"][:3].upper(),
            "decimal": decimal,
            "lop": parse_to_own_format(rep["left"], decimal=decimal),
            "rop": parse_to_own_format(rep["right"], decimal=decimal)
        }
    elif rep["_type"].lower() == "name":
        return rep["id"]
    elif rep["_type"].lower() == "constant":
        return rep["value"]
    return None  # raise error?!


def parse_string(calculation_string):
    try:
        return str2json(calculation_string)
    except Exception:
        return None


def generate_step_transform(formula, key_name):
    formula = formula.replace("|", splitString)
    ast_rep = parse_string(formula)
    if not ast_rep:
        return None
    else:
        parsed_result = parse_to_own_format(ast_rep["body"][0]["value"], decimal=2)

        return get_transformations({
            "tree": parsed_result
        }, "tree", key_name)
