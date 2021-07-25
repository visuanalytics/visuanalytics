import json
from ast2json import str2json

splitString = "uzjhnjtdryfguljkm"


def get_transformations(tree, k, key_name, counter):
    """
    Simuliert einen globalen Scope für die Methode, die die Liste der Transformtypen generiert.

    :param tree: Dictionary mit der Formel repräsentiert als ein abstrakter Syntaxbaum
    :type tree: dict
    :param k: Key zu dem relevanten Part des Syntaxbaums (z.B. der linke oder rechte Operand)
    :type k: str
    :param key_name: falls es sich nicht um ein Ziwschenergebnis handelt, wird das Ergebnis unter diesem Namen abgespeichert, damit es später wiederverwendet werden kann
    :type key_name: str
    :param counter: Zählervariable für die Keys der Zwischenergebnisse
    :type counter: int

    :return: Liste der Transformtypen
    """
    operations = {
        "ADD": "add",
        "SUB": "subtract",
        "MUL": "multiply",
        "DIV": "divide",
        "MOD": "modulo"
    }

    calc_template = {
        "type": "calculate",
        "action": "",
        "decimal": 2,
        "keys": ["_req"]
    }

    new_key_template = "_new_key_"

    calculations = []

    def build_calc_list(tree, k, counter, key_name=None):
        """
        Erstellt rekursiv eine Liste von primitiven Rechenoperationen für den Transform-Schritt, mit der die Formeln
        eines Infoproviders umgesetzt werden können.

        :param tree: Dictionary mit der Formel repräsentiert als ein abstrakter Syntaxbaum
        :type tree: dict
        :param k: Key zu dem relevanten Part des Syntaxbaums (z.B. der linke oder rechte Operand)
        :type k: str
        :param counter: Zählervariable für die Keys der Zwischenergebnisse
        :type counter: int
        :param key_name: falls es sich nicht um ein Ziwschenergebnis handelt, wird das Ergebnis unter diesem Namen abgespeichert, damit es später wiederverwendet werden kann
        :type key_name: str

        :return: Key, an dem das Zwischenergebnis einer Operation zu finden ist
        """
        current_calc = tree[k]
        contains_calc = False
        keys = ["lop", "rop"]
        new_key = new_key_template + str(counter) if key_name is None else key_name

        for key in keys:
            if type(current_calc[key]) == dict:
                counter += 1
                current_calc[key], temporary = build_calc_list(current_calc, key, counter)

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
            return new_key, counter
        return None, counter

    tmp, counter = build_calc_list(tree, k, counter, key_name=key_name)
    return calculations, counter


def parse_to_own_format(rep, decimal, loop_var=None):
    """
    Generiert rekursiv den abstrakten Syntaxbaum mit nur den relevanten Daten, der für die get_transformations-Funktion verständlich ist.

    :param rep: Dictionary, welches von der ast2json-Bibliothek generiert wurde
    :type rep: dict
    :param decimal: Anzahl der Nachkommastellen der Zwischenergebnisse
    :type decimal: int
    :param loop_var: Name der Loop-Variable
    :type loop_var: str

    :return: je nach '_type' wird ein Variablenname, eine Zahl oder ein Dictionary in verständlichem Format zurückgegeben
    """
    if rep["_type"].lower() == "binop":
        return {
            "operator": rep["op"]["_type"][:3].upper(),
            "decimal": decimal,
            "lop": parse_to_own_format(rep["left"], decimal=decimal),
            "rop": parse_to_own_format(rep["right"], decimal=decimal)
        }
    elif rep["_type"].lower() == "name":
        return rep["id"] if not loop_var or (loop_var and rep["id"] != "_loop") else loop_var
    elif rep["_type"].lower() == "constant":
        return rep["value"]
    return None  # raise error?!


def parse_string(calculation_string):
    """
    Wandelt mit Hilfe der ast2json-Bibliothek einen String in einen abstrakten Syntaxbaum. Kann auch zur Überprüfung der Syntax einer Formel genutzt werden.

    :param calculation_string: Stringrepräsentation einer Formel
    :type calculation_string: str

    :return: Formel als abstrakter Syntaxbaum (Dictionary) repräsentiert
    """
    try:
        return str2json(calculation_string)
    except Exception:
        return None


def generate_step_transform(formula, key_name, counter, copy=None, array_key=None, loop_key="", decimal=2):
    """
    Erstellt die Liste der Transformtypen für eine Formel, falls die Formel keinen syntaktischen Fehler hat.
    Dabei kann die Formel auf einen einzelnen Key, oder ein ganzes Array angewendet werden.

    :param formula: Stringrepräsentation der Formel
    :type formula: str
    :param key_name: Name der Formel, unter dem das Ergebnis später zu finden ist
    :type key_name: str
    :param copy: Key, unter dem die Kopie des Arrays zu finden ist
    :type copy: str
    :param array_key: Key des Arrays, über welches u.U. iteriert werden soll (für Arrays)
    :type array_key: str
    :param loop_key: Key des Dictionaries, auf den die Formel bei der Iteration über ein Array angewendet werden soll (für Arrays mit Dictionaries)
    :type loop_key: str
    :param decimal: Anzahl der Nachkommastellen für das Ergebnis und die Zwischenergebnisse
    :type decimal: int

    :return: Liste der Transformtypen
    """
    if copy and not array_key:
        return None
    result = []
    if copy:
        result.append({
            "type": "copy",
            "keys": [array_key],
            "new_keys": [copy]
        })

    loop_var = "_loop|" + loop_key
    if loop_var[-1] == "|":
        loop_var = loop_var.replace("|", "")
    formula = formula.replace("array_var", loop_var).replace("|", splitString)

    ast_rep = parse_string(formula if array_key else formula)

    if not ast_rep:
        return None, counter
    else:
        parsed_result = parse_to_own_format(ast_rep["body"][0]["value"], decimal=decimal, loop_var=(loop_var if array_key else None))

        if array_key:
            transformations, counter = get_transformations({
                    "tree": parsed_result
                }, "tree", key_name, counter) + [
                                 {
                                     "type": "calculate",
                                     "action": "multiply",
                                     "decimal": decimal,
                                     "keys": [key_name],
                                     "value_right": 1,
                                     "new_keys": [loop_var]
                                 }
                             ]
            return result + [{
                "type": "transform_array",
                "array_key": copy if copy else array_key,
                "transform": transformations
            }], counter
        else:
            transformations, counter = get_transformations({
                "tree": parsed_result
            }, "tree", key_name, counter)
            return result + transformations, counter
