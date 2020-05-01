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

Aktuell sieht es danach aus, dass wir für das Thema Corona die covid19-API, für das Thema Wetter die weatherbit-API und für das Thema News / Ereignisse die zeit-API verwenden.
Ob wir noch weitere Themen (z.B. ISS-Daten) einbauen wollen und falls ja, welche, sollte noch ein mal im Team besprochen werden.

Wir verfügen nun über ein "Team" auf der API-Test-Plattform Postman, dort sind bereits ein paar Requests gespeichert und können getestet werden.
