# Recherche

## API
### Async-Api-Requests

Um die Abfrage von API-Requests zu beschleunigen, 
kann man diese asynchron ausführen. Dies ist für einen Request natürlich langsamer, 
ab zwei aber schon schneller, umso mehr requests man macht, umso größer wird der Unterschied,
da man ungefähr in der Zeit von einem synchronen Request alle asynchronen machen kann.

> z.B. bei unseren 19 API requests an die Weather Api für den Deutschlandweiten wetterbericht 
>ist die asyncrone variante 7 sekunden schneller.

Möglicher Code:

~~~
import asyncio
from aiohttp import ClientSession


async def _fetch(url, session):
    async with session.get(url) as response:
        return await response.json()


async def _fetch_array(urls):
    async with ClientSession() as session:
        tasks = await asyncio.gather(
            *[_fetch(url, session) for url in urls]
        )

        return tasks


def fetch_all(urls):
    loop = asyncio.get_event_loop()
    task = loop.create_task(_fetch_array(urls))
    loop.run_until_complete(task)
    return task.result()
~~~

Der Funktion `fetch_all` übergibt man eine Liste von URLs und diese macht dann alle Requests und man bekommt eine Liste mit den Ergebnissen zurück.

> Der Code wurde noch nicht eingebaut, da man eine weitere Dependency benötigt 
> und noch nicht ganz sicher ist, ob man diese Funktion häufiger benötigt.


### Geeignete APIs

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

# Börsen-API

## Alpha Vantage 

#### Nur DAX möglich, kein MDAX, SDAX oder TecDAX

TIME_SERIES_INTRADAY: timestamp, open, high, low, close, volume

TIME_SERIES_DAILY: date, daily open, daily high, daily low, daily close, daily volume

TIME_SERIES_DAILY_ADJUSTED: date, daily open, daily high, daily low, daily close, daily volume, daily adjusted close, and split/dividend events

TIME_SERIES_WEEKLY: last trading day of each week, weekly open, weekly high, weekly low, weekly close, weekly volume

TIME_SERIES_MONTHLY: last trading day of each month, monthly open, monthly high, monthly low, monthly close, monthly volume



### DAX 30

Deutscher Aktienindex: Index der 30 größten börsennotierten Unternehmen Deutschlands mit unterschiedlichen Gewichtungen -> Deutsche Börse Group entscheidet

börsengelistet oder nicht

Wert wird gegen Zeit aufgetragen. Markt besteht aus mehreren Unternehmen

Symbole für die 30 Unternehmen, die aktuell (Stand: 05.07.2020) im DAX vertreten sind (die kann man nicht alle mit Alpha Vantage abfragen):

| Unternehmen | Symbol |
| ----------- | ------ |
| Adidas | ADS |
| Allianz | ALV |
| BASF | BAS |
| BAYER | BAYN |
| Beiersdorf | BEI|
| BMW | BMW |
|Continental| CON|
|Covestro| COV|
|Daimler| DAI|
|Deutsche Bank| DBK|
|Deutsche Börse| DB1|
|Deutsche Post| DPW|
|Deutsche Telekom| DTE|
|Deutsche Wohnen| DWNI|
|E.ON| EOAN|
|Fresenius| FRE|
|Fresenius Medical| FME|
|Heidelberg Cement| HEI|
|Henkel VZ| HEN3|
|Infineon Technolo| IFX|
|Linde| LIN|
|Merck| MRK|
|MTU Aero Engin| MTX|
|Münchner Rückversicherung| MUV2|
|RWE| RWE|
|SAP| SAP|
|Siemens| SIE|
|Volkswagen VZ| VOW3|
|Vonovia| VNA|
|Wirecard| WDI|

Sonst gibt es nach dem DAX (1-30) noch den MDAX (31-80), den SDAX (81-130) und den TecDAX (30 größte Technologieunternehmen)

Angefangen hat alles bei 1.000 (Wert)Punkten, heute bei ca. 11.000.



## Yahoo Finance

- Über rapidapi

- 500 Anfragen pro Monat kostenfrei
- https://rapidapi.com/blog/yahoo-finance-api-python/
- keine Doku gefunden

## fcsapi

- SDAX, TecDAX, DAX
- https://fcsapi.com/document/stock-api#stock-get-started
- verständliche Doku

## Scraper APIs (kostenfrei)



https://scrapestack.com/

https://scrapersite.com/documentation



Um die aktuellen 30 Top Unternehmer des DAX ausfindig zu machen

https://www.finanzen.net/kurse/kurse_kursliste_detail.asp?inindex=1&intzeit=0&inpage=1

https://www.finanzen.net/kurse/kurse_kursliste_detail.asp?inindex=1&intzeit=0&inpage=2

https://www.finanzen.net/kurse/kurse_kursliste_detail.asp?inindex=1&intzeit=0&inpage=3

## Ideen zur Visualisierung

https://python-yahoofinance.readthedocs.io/en/latest/api.html

#### DAX 

als Diagramm mit Wertpunkte gegen die Zeit aufgetragen (über die letzten 3 Monate [default]) und Tageswerte vorlesen lassen -> optional in Frontend auswählen lassen: Intraday, 1W, 1M, 3M, 6M, 1J, 2J, 3J, 5J, 10J

Am {weekday}, den {Datum} um {Uhrzeit} lag der DAX bei {Wert} Punkten. Im Vergleich zum Vortag ist dies eine Differenz von {Differenz} Prozent. 

https://finance.yahoo.com/quote/DAX/chart?p=DAX

![image-20200706105502095](C:\Users\Tanja\AppData\Roaming\Typora\typora-user-images\image-20200706105502095.png)

#### Tabelle 3 Seiten mit den 30 Top Unternehmen (über die letzten 3 Monate [default])

Kurs | +/- | DIfferenz in  | Umsatz/€ | Umsatz/St. 



![image-20200706105345817](C:\Users\Tanja\AppData\Roaming\Typora\typora-user-images\image-20200706105345817.png)



#### MDAX, SDAX und TecDAX 

so wie DAX anzeigen lassen

optional: Tabellenform für MDAX, SDAX und TecDAX 

https://finance.yahoo.com/quote/%5EMDAXI?p=%5EMDAXI

https://finance.yahoo.com/quote/%5ESDAXI?p=%5ESDAXI

https://finance.yahoo.com/quote/%5ETECDAX/chart?p=%5ETECDAX

Texte:

- Am {weekday}, den {Datum} um {Uhrzeit} lag der MDAX bei {Wert} Punkten. Im Vergleich zum Vortag ist dies eine Differenz von {Differenz} Prozent. 

- Am {weekday}, den {Datum} um {Uhrzeit} lag der SAX bei {Wert} Punkten. Im Vergleich zum Vortag ist dies eine Differenz von {Differenz} Prozent. 

- Am {weekday}, den {Datum} um {Uhrzeit} lag der TecDAX bei {Wert} Punkten. Im Vergleich zum Vortag ist dies eine Differenz von {Differenz} Prozent. 