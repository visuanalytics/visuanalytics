import sys
from shutil import which


def all_installed(programs: list):
    for prog in programs:
        _check_installed(prog)


def _check_installed(name: str):
    if which(name) is None:
        # TODO(max) improve error message
        print(f"External program '{name}' is required please install!", file=sys.stderr)
        exit(1)
