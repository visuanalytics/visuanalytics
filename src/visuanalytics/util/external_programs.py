import sys
from shutil import which

def all_installed(programs: list):
    """Testet, ob alle Programme von der Liste installiert sind.

    :param programs: Liste der benötigten Programme.
    :type programs: list
    """
    for prog in programs:
        _check_installed(prog)


def _check_installed(prog: dict):
    if which(prog["name"]) is None:
        url = f": {prog['url']}" if 'url' in prog else ''
        print(f"External program '{prog['name']}{url}' is required, please install!", file=sys.stderr)
        exit(1)
