# Verzeichnisstruktur für das Projekt

- src
    - visuanalytics
        - run.py
        - requirements.txt
        - config.py
        - instance
            - config.py
        - server
            - views
            - models
            - static
            - templates
        - analytics
            - api
              - weather.py
              - twitter.py
              - corona.py
              - ...
            - preprocessing
              - weather.py
              - twitter.py
              - corona.py
              - ...
            - processing
              - weather
                - speech.py
                - video.py
              - twitter
                - wordcloud.py
                - ...
            - linking
              - weather.py
              - corona.py
              - ... 
           - control
             - weather
               - full_forecast.py
             - corona
               - ...
           - util
           resources
         - tests
            - ...
         - docs
    - (wordpress) 

  Angelehnt an: https://exploreflask.com/en/latest/organizing.html 
  
  Eventuell könnten unter 
