def merge_dict(dict1, dict2):
    for k in set(dict1).union(set(dict2)):
        if k in dict2:
            if isinstance(dict1.get(k, None), dict) and isinstance(dict2[k], dict):
                merge_dict(dict1[k], dict2[k])
            else:
                dict1[k] = dict2[k]
