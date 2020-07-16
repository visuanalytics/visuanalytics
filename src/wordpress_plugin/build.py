import os
import subprocess
import sys
from distutils.dir_util import copy_tree
import zipfile
import shutil

FRONTEND_LOCATION = "../frontend"


def main():
    cwd = os.path.dirname(os.path.realpath(__file__))
    build = os.path.join(cwd, "build/visuanalytics")
    frontend_path = os.path.normpath(
        os.path.join(cwd, FRONTEND_LOCATION))
    args = sys.argv

    # Creat build folder
    os.makedirs(os.path.join(cwd, "build"), exist_ok=True)

    # Copy wordpress Files
    copy_tree(os.path.join(cwd, "visuanalytics"),
              os.path.join(cwd, "build/visuanalytics"))

    # Build Frontend

    if (len(args) > 1):
        os.environ["REACT_APP_VA_SERVER_URL"] = args[1]
        print(os.environ.get("VA_SERVER_URL"))

    subprocess.run("npm run build", shell=True, check=True, cwd=frontend_path)

    os.environ["REACT_APP_VA_SERVER_URL"] = ""

    # Copy Frontend build files
    copy_tree(os.path.join(frontend_path, "build/static/js"),
              os.path.join(build, "src/js"))
    #copy_tree(os.path.join(frontend_path, "/build/images"), "toDirectory")


if __name__ == "__main__":
    main()
