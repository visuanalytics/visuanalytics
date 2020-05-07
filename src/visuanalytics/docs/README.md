# Sphinx Dokumentation

## Doku Generieren

### Installation

1. **python3** installieren (falls noch nicht vorhanden)
2. Pakete installieren: `pip install -r requirements.txt`

### HTML Generieren

1. in den Docu ordner wechseln (`cd src/docs`)
2. Docu aus den Python **docstrings** generieren: `sphinx-apidoc -f -o modules ..`
3. **HTML** generieren: `make html`

Die Dokumentation befindet sich dann in `_build/html`.
