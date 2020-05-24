# Vergleich von gTTS mit pico2wave

#### Audiodateien erstellen
- gTTS: siehe Python-Skript unter Data-Analytics/Organisation/Recherche/pico2wave/Vergleich_gtts_pico2wave/Testaudios_Vergleich.py  
- pico2wave: siehe README unter Data-Analytics/Organisation/Recherche/pico2wave/README.md

#### Allgemeiner Vergleich:
- gTTS: Python-Library und Kommandozeilentool, wobei die API von Google Translate verwendet wird
- pico2wave:Kommandozeilentool für Linux/Unix-User, welches von dem Unternehmen SVOX bereitgestellt wird

#### Vergleich mögliche Sprachen:
- gTTS: 78 verschiedene Sprachen, darunter 14 Mal English (z.B. English (Australia) oder English (Ghana)), 3 Mal Spanish, German und Sprachen wie Czech oder Javanese
- pico2wave: deutsch, englisch/amerikanisch, italienisch, französisch und spanisch

#### Vergleich Audioformate:
- gTTS: mp3-Datei
- pico2wave:wav-Datei

#### Vorteile gTTS:
- eine Python-Library, die man direkt einbinden kann, sodass man die Funktionen des Moduls verwenden kann
- einfaches Erstellen der Audiodateien (Dreizeiler)
- viele verschiedene Einstellungen möglich: unterschiedliche Sprachen (lang='de'); Sprechgeschwindigkeit (slow=False oder slow=True); Sprachüberprüfung (lang_check=True);
  Modul, um Text vorzuverarbeiten, um somit Aussprache zu optimieren (gtts.tokenizer mit den Funktionen pre_processor_func und tokenizer_func)
- verschiedene Fehlermeldungen, die abgefangen werden können (AssertionError, ValueError, RuntimeError)
- einzelne Wörter werden richtig und gut betont
- deutliche Aussprache
- gute Audioqualität 
- intellektuelle (arrogante) Stimme, so wie unser Programm

#### Nachteile gTTS:
- teilweise unnatürlicher, stockender Redefluss

#### Vorteile pico2wave:
- sehr kompaktes, einfach zu bedienendes Kommandozeilenprogramm
- guter Redefluss

#### Nachteile pico2wave:
- keine direkte Python-Library, man müsste ein Skript schreiben, um es einzubinden
- bringt keine weiteren Einstellungsmöglichkeiten/ Funktionen mit sich
- Aussprache manchmal etwas monoton, kaum Betonungen

#### Begründung Entscheidung für gTTS:  

Wir haben uns nach einem genaueren Vergleich der beiden TTS-Programme gTTS und pico2wave für das Programm gTTS entschieden. Dieses ließ sich einfach als Python-Library einbinden, sodass wir es direkt verwenden konnten. 
Ebenso fanden wir es gut, dass die Bibliothek eine umfangreiche Funktionalität aufweist. So lassen sich viele Kleinigkeiten optimal für unsere Zwecke anpassen.
Außerdem haben uns im Großen und Ganzen die erzeugten Audiodateien von der Aussprache, der Betonung und der generellen Audioqualität besser gefallen.

#### Quellen

https://wiki.ubuntuusers.de/Sprachausgabe/  
https://gtts.readthedocs.io/en/latest/module.html
