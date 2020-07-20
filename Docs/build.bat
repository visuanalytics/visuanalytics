@ECHO OFF

sphinx-apidoc -f -o modules ../src/visuanalytics
make html