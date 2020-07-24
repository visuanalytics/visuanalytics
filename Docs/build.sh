#!/bin/bash

sphinx-apidoc -f -o modules ../src/visuanalytics ../src/visuanalytics/tests/*
make html