Es hat eine ca. 2 Stunden gedauert bis ich Basemap erfolgreich installiert hatte mit verschiedenen Anleitungen probiert. Leider weiß ich nicht mehr, mit welcher es letztendlich geklappt hat.
Mithilfe der Seite
http://www.magben.de/?h1=mathematik_fuer_ingenieure_mit_python&h2=weltkarte
und den dort verwendeten Seiten:
https://data.worldbank.org/indicator/SH.DYN.MORT?end=2016&start=2016&view=map
und
http://www.naturalearthdata.com/downloads/110m-cultural-vectors

Ich habe die Weltkarte mit den Ländergrenzen von https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip
heruntergeladen, die zip entpackt. Der Zugriff auf die Shapes erfolgt wie bei magben über die Country Codes. Ich habe die .dbf-Datei mit Excel geöffnet und geprüft wie die Zeile mit den Country Codes heißt: ADM0_A3
Auf der Seite data.worldbank.org gibt es noch viele weitere Daten. Ich wollte die Weltbevölkerung darstellen, also habe ich die folgenden Daten als .csv heruntergeladen
https://data.worldbank.org/indicator/SP.POP.TOTL?locations=1W&view=map (eingefärbte Karte)
Ich wollte quasi diese Karte selbst aus Daten erstellen
http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv (Download)
Die .csv-Datei habe ich in Excel geöffnet und angeschaut, wo der Country Code zu finden ist (in Spalte 2) und die letzten Daten waren von 2018 (das ist die drittletzte Spalte).
Schon geschriebenes Programm verwendet, um die Daten der Weltbevölkerung 2018 darzustellen, dazu Code ergänzt und etwas abgeändert. Aber den Code weitestgehend so gelassen. Am Ende noch die Ausgabe der Grafik als jpeg eingefügt.
Danach noch hier die Dokumentation und den Code etwas mehr kommentiert.
