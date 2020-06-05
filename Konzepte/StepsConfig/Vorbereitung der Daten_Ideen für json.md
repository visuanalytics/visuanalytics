### Vorbereitung der Daten für ONE BIG JSON

#### weather -> preprocessing-> transform.py

- NUM_DAYS = Anzahl an Tagen für Wetterbericht
- RELEVANT_DATA = welche Daten werden aus der API benötigt
- CITIES = welche Städte werden immer abgefragt
- bestimmte Stadt für ortsbezogenen Wetterbericht
-  preprocess_weather_data: verarbeitet die relevanten Daten für bestimmte Städte und erstellt daraus ein dictionary sowohl für deutschlandweit als auch für eine bestimmte Stadt
- _preprocess_single: schneidet die relevanten Daten aller abgefragten Städte für alle NUM_DAYS aneinander
- _summaries: schneidet die Durchschnittswerte von ein paar relevanten Daten für alle NUM_DAYS aneinander
- _get_for_day: ???
- get_weekday: sucht sich eine Stadt aus und verwendet davon das erste auftauchende Datum und bestimmt mithilfe von date_time.date_to_weekday die Wochentage als String
(-> man könnte ein Modul schreiben, um verschiedene Datumsangaben umzuwandeln, so dass es egal ist welches Format in der API verwendet wird, und man am Ende trotzdem die richtigen Wochentage und das Datum in einer bestimmten Form hat, ggf. auch nur das Jahr)
- get_first_day: sucht sich das erste Datum im vorbereiteten Dictionary heraus
- get_first_day_single: sucht sich das erste Datum aus dem vorbereiteten Dictionary heraus für eine bestimmte Stadt (ortsbezogener Wetterbericht, default: Kiel?)
- get_weather_icon: sucht sich das Wettericon für einen bestimmten Tag für eine bestimmte Stadt heraus (bei bestimmter Stadt wird dieses pro Tag nur einmal benötigt, bei deutschlandweit wird dieses pro Tag für mehrere Städte benötigt)
- get_max_temp: sucht sich die Temperatur aus, die deutschlandweit (bzw. aus CITIES) am höchsten ist.
- get_min_temp: sucht sich die Temperatur aus, die deutschlandweit (bzw. CITIES) am höchsten ist.
- get_city_with_min_temp: sucht sich von allen Städten aus CITIES die Stadt aus, in der die Temperatur an einem bestimmten Tag am niedrigsten ist
- : sucht sich von allen Städten aus CITIES die Städte aus, in denen die Temperatur an einem bestimmten Tag am höchsten ist (höchste von max_temp und niedrigste von den max_temp zusätzlich den Stadtnamen und den icon-code)
- get_common_code_per_day: sucht sich den Code aus allen CITIES heraus, welcher an einem bestimtmen Tag am häufigsten vorkommt

#### weather -> preprocessing-> speech.py

- pres_data_to_text: wandelt einen Druck in einen String um
- percent_to_text: wandelt einen Prozentwert in einen String um
- wind_cdir_full_data_to_text: wandelt einen Text auf Englisch in einen Text auf Deutsch um (Windrichtung, es gibt ein Dictionary dafür)
- wind_spd_data_to_text: wandelt einen Wert in m/s in einen String um
- WEATHER_DESCRIPTIONS: Dictionary mit Texten passend zum Icon-Code aus der Weatherbit-API
- random_weather_descriptions: sucht einen von zwei verschiedenen Codes aus und gibt eine Beschreibung des Wetters als String aus
- : enthält alle abgefragten Städte in Deutschland
- : setzt vor jeden Stadtnamen ein in und speichert es neu als String
- get_data_toda_tomorrow_three: verwendet alle eben aufgeführten Funktionen/Methoden und speichert einen Teil der für den aktuellen deutschlandweiten Wetterbericht benötigten Daten in einem Dictionary
- merge_data: erstellt eine großes Dictionary mit allen relevanten Daten für den deutschlandweiten Wetterbericht
- merge_data_single: erstellt ein Dictionary mit allen relevanten Daten für einen ortsbezogenen Wetterbericht und verwendet dafür die obengenannten Funktionen/Methoden

#### weather -> processing-> speech.py

- get_all_audios_germany: Textvorlagen mit allen einzeln benötigten Audios für die jeweiligen Images aus VIsualization


#### weather -> processing-> speech_single.py

- get_all_audios_single_city: generiert aus allen gewünschten Audios (hier sind es 5 Stück, weil wir 5 unterschiedliche Images visualisieren wollen)
- _generate_first_day_audio: Textvorlage für den heutigen Wetterbericht
- _generate_second_day_audio: Textvorlage für den morgigen Wetterbericht
- _generate_three_days_audio: Textvorlage für einen Tag einer drei Tage-Wettervorhersage 

#### history -> preprocessing -> transform.py

- preprocess_history_data: erstellt ein Dictionary mit allen relevanten Daten für die Wordclouds
- get_date: wandelt das Datum aus der Zeit-API um in Jahr und vor wie vielen Jahren
- UPPERCASE_WORDS: Wörter, die komplett großgeschrieben werden
- grammar_keywords: wandelt dei Keywords aus der API so um, dass sie alle groß geschrieben werden bzw. komplett groß geschrieben werden.
- string_formatting: wenn in Strings " gesetzt sind, die aber später Probleme bereiten könnten, werden hier mit einem \" ersetzt

#### history -> preprocessing -> speech.py

- random_teaser_text: wird nicht mehr benötigt
- most_often_keys: wird nicht mehr benötigt
- get_teaser_texts: wird nicht mehr benötigt
- merge_data: fügt alle relevanten Daten für die Wordclouds in einem Dictionary zusammen

#### history -> processing -> speech.py

- get_all_audios: generiert alle benötigten Audios
- _generate_audio: Textvorlage für den Text, der für eine Wordcloud vorgelesen werden soll, mit umwandeln (Text-to-Speech) und return-Value ist der Pfad der Audio-Datei. 

## Ideen zur Vereinheitlichung
- Anzahl an Zeiträumen
- Datum: immer von bis (bei Wettervorhersage dann beides gleicher Tag)
- Datum umwandeln in String: Wochentag, DD.MM.YYY, month, year, heute vor x Jahren (heute-Jahr in der Vergangenheit)
- Stadt/Location: true und dann den Namen, default: false z.B. für Zeit-API und deutschlandweiten Wetterbericht
- welche key-value-Paare aus den API-Daten sollen abgefragt werden
- jeweils ein "reduziertes" Dictionary aus den API-Daten, welches pro API aber individuell erstellt werden müsste (da es unterschiedliche Themen sind) ggf. Tags zum Auswählen bei der Erstellung der Jobs
- nachbereitete API-Daten (siehe merge_data): individuell zusammengestelltes Dictionary aus relevanten Daten nur für speech and visualisation
- Anzahl Images für Video = Anzahl Lückentexte = Anzahl Audios
- Dictionary oder Listen für Images-Pfade, Lückentexte und Audio-Pfade und Audiolängen (ggf. mehrfach auf selben Lückentext nur mit anderen Inhalten (aus Dictionaries z.B. verschiedene Tage mit verschiedenen Werten aber gleicher Lückentext) zugreifen)
- daraus jeweils ein Dictionary für jeweils einen Videoausschnitt mit Image-Pfad, Informationen für Image, Lückentext, Audio-Pfad, Audiolänge
- Texte, die jeweils bei einem Image vorgelesen werden sollen (String: je individuell, da es auf API ankommt) (verschiedene Lückentext-Möglichkeiten: weather, history, etc.) -> true/false setzen
- Was soll auf ein Image drauf? Verschiedene Möglichkeiten je auf true/false setzen (Wordcloud, Wetterkarte Deutschland, ortsbezogener Wetterbericht, Weltkarte mit Daten (Corona), Graph/Diagramm/Tabellen mit z.B. x- und y-Werten)

War doch schon recht einheitlich, zumindest die Videoerstellung lief gut, man musste nicht mehr viel machen bei
#### Wetter
- Welche Icons sind relevant? Woher bekommen wir die Bilder?
- Dictionary mit Dateinamen (Wetter-Icons)
- Dictionary mit CITIES
- Dictionary mit Codes für Wetter

#### Wordcloud
- String, in welchem die Wörter drinstehen, die in die Wordcloud sollen (Anzahl der Hufigkeit eines Worts: Wort wird x mal in den String geschrieben)
- Form der Wordcloud (aus Maske heraus erstellen?) -> Image
- Liste mit keywords in richtigem Deutsch


