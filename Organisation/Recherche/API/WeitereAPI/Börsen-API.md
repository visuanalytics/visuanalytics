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

Sonst gibts nach DAX (1-30) noch MDAX (31-80), SDAX (81-130) und TecDAX (30 größte Technologieunternehmen)

angefangen 1.000 (Wert)Punkten, heute bei ca. 11.000



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