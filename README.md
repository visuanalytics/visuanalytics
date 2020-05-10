# VisuAnalytics ![Tests](https://github.com/SWTP-SS20-Kammer-2/Data-Analytics/workflows/Automated%20Testing/badge.svg)

## Server Starten

### Development Server Starten

Flask bringt einen Development Server mit der bei Datei Änderungen Automatisch neu startet.

### Mit Docker

1. `docker build -t visuanalytics src/visuanalytics`
2. `docker run -p 5000:5000 -t visuanalytics`

### In der Console

1. in den src ordner wechseln: `cd src`
2. Python Packete installieren: `pip install -r visuanalytics/requirements.txt`
3. environment variable setzen:
    - Linux: 
        - `export FLASK_APP=visuanalytics.server.server:create_app`
        - `export FLASK_ENV=development`
    - Windows: 
        - `set FLASK_APP = visuanalytics.server.server:create_app`
        - `set FLASK_ENV = development`
3. development Server starten `flask run`

### Mit Pycharm

1. Python Packete installieren: `pip install -r src/visuanalytics/requirements.txt`
2. run configuration Bearbeiten
3. Flask Tempalte hinzufügen
4. Flask Run Config Bearbeiten:
    ~~~
    Target type: Module name
    Target: visuanalytics.server.server
    Aplication: create_app
    ...
    Flask_Debug: True
    ~~~

> Damit die Run Config funktioniert muss der Ordner `src` als 'sources root' makiert sein.

### Production server Starten

TODO

## Doku Generieren

Für die Dokumentation wird das Python Package [Sphinx](https://www.sphinx-doc.org) verwendet.

### Installation


2. Dev Dependencies installieren: `pip install -r src/visuanalytics/requirements-dev.txt`

### HTML Generieren

1. in den Doku ordner wechseln: `cd src/visuanalytics/docs`
2. Doku aus den Python **docstrings** generieren: `sphinx-apidoc -f -o modules ..`
3. **HTML** generieren: `make html`

Die Dokumentation befindet sich dann in `_build/html`.