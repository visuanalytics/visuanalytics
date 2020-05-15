# Geeignete APIs

* https://github.com/ExpDev07/coronavirus-tracker-api
  * Informationen zu Corona (je Land: Einwohnerzahl, Infizierte, Tote etc.)
  * Nachteil: (noch) keine Informationen zur Anzahl der Genesenen verfügbar

* https://covid19api.com/
  * Informationen zu Corona (scheint umfangreicher als das github repo)
  * kein API-Schlüssel notwendig

* https://openweathermap.org/api
  * Wetterdaten
  * im kostelosen Paket: Wetterkarten, aktuelles Wetter, 3-Stunden-Wettervorhersage 
  * Nachteil: nur 3-Stunden-Wettervorhersage

* https://www.weatherbit.io/api
  * Wetterdaten
  * API-Schlüssel notwendig (bereits erstellt)
  * im kostenlosen Paket: historische Wetterdaten (täglich und stündlich), 16-Tage-Wettervorhersage

* https://newsapi.org/docs
  * weltweite News
  * Suche nach keywords, Datum, Quelle, Sprache

* https://www.predicthq.com/events/historical-events
  * historische Ereignisse 
  * kostenloses Paket: 30 Tage in die Zukunft, 60 Tage in die Vergangenheit

* http://developer.zeit.de/index/
  * gesamtes Archiv der ZEIT bzw. ZEIT ONLINE
  * Zugriff auf alle Zeitungsartikel
  * API-Key muss per Email beantragt werden, bisher keine Antwort
  * Problem: es gibt keine direkte Möglichkeit, eine Liste von Schlüsselwörten aller Artikel in einem best. Zeitraum zu pollen,
    * evtl. über "Facetting" möglich
    * kann erst ausprobiert werden, wenn der API-key angekommen ist

* http://open-notify.org/Open-Notify-API/
  * aktueller Standort der ISS
  * Zeitpunkte, wann die ISS einen gegebenen Standort überquert 
  * Namen der Astronauten, die sich momentan im Weltraum befinde
  
* https://rapidapi.com/apidojo/api/yahoo-finance1
  * Finanzübersicht
  * Zusammenfassung zum angefragten Zeitpunkt
  * Gewinner / Verlierer in einer bestimmten Region
   z.B. Day Gainers - US, Day Losers - US, Most Actives - US
  * Daten um Diagramme zu bestimmten Akteuren zu erstellen
  * Gewinne in einer bestimmte Region in einem eingegrenzten Zeitraum
  
* https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api
  * Daten des World Bank’s Climate Change Knowledge Portal
  * basieren auf 15 global circulation models (GCMs), welche die Reaktion des globalen Klimasystems auf steigende Treibhauskonzentrationen simulieren
  * Niederschlag und Temperatur
  * Tages-, Monats- und Jahresdurchschnitt, Veränderungsrate
  * Zeitspannen in der Vergangenheit
  * Zeitspannen in der Zukunft (Prognose)
  
* https://earthquake.usgs.gov/fdsnws/event/1/
  * Übersicht über Erdbeben
  * Erdbeben in einem bestimmten Zeitraum
  * Erdbeben in bestimmten Höhen und Breitengraden
  * Intervall von Erdbebenstärken
  * Filter für bestimmte Alarmlevel: grün, gelb, orange, rot
  * in Kombination anwendbar
  * keine Vorhersage
  
* https://rapidapi.com/sportsop/api/soccer-sports-open-data
  * Fußballergebnisse
  * alle Leagues und Informationen über diese
  * alle Saisons und deren Runden sowie Spielstände
  * bestimmte Spiele anschauen: Ergebnis, Tore, Teams, Fouls
  * Top-Scorer einer bestimmten League in einer bestimmten Saison
  
* https://developer.twitter.com/en/docs
  * verschiedene Twitter APIS
  * historische Tweets
  * realtime Tweets
  * API für Websites
  * API für angezeigte Werbung


Aktuell sieht es danach aus, dass wir für das Thema Corona die covid19-API, für das Thema Wetter die weatherbit-API und für das Thema News / Ereignisse die zeit-API verwenden.

Nach Rücksprache mit Prof.Dr.Kammer kam die Idee auf, ob man nicht die Twitter-API mit einer Sport- oder Corona-API verbinden könnte. Zum Beispiel könnte man die Stimmung zu einem Fußballspiel anhand von Tweets analysieren. Dazu könnte man Hashtags auswerten und diese in einer Wordcloud visualisieren.

Wir verfügen nun über ein "Team" auf der API-Test-Plattform Postman, dort sind bereits ein paar Requests gespeichert und können getestet werden.
