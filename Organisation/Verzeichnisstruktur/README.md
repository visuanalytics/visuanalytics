# Verzeichnisstruktur für das Projekt

- Anwendung
  - src
    - run.py
    - requirements.txt (Abhängigkeiten des Projekts)
    - config.py (Konfigurationsparameter)
    - instance 
      - config.py ("geheime Konfigurationsparameter wie z.B. API-Keys)
    - server (enthält allgemeine Server-Funktionen)
      - views
      - models
      - static
      - templates
    - visuanalytics (enthält die eigentliche Programmlogik)
      - apis
      - visualization
      - speech
      - util
      - resources
    - tests
    - docs
  - (wordpress)

  Angelehnt an: https://exploreflask.com/en/latest/organizing.html 