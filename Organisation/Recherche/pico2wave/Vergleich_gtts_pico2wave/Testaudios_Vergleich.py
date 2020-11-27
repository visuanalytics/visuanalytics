from gtts import gTTS
text_eins = (f"Am Freitag ist es im Süden und Osten erst noch recht freundlich, von Westen her verdichten sich aber die Wolken und vom Nordwesten bis in die Mitte gibt es zum Teil kräftigen Regen, vereinzelt auch Gewitter. Höchstwerte 18 bis 30 Grad."
f"Am Samstagvormittag ziehen die dichten Wolken samt Regen im Osten ab, während es in der Mitte weiterhin unverändert stark bewölkt ist und besonders in der südlichen Mitte weiter regnet oder schauert. Im Süden ist es zum Teil noch aufgelockert, hier entstehen allerdings erste Schauer oder Gewitter. Diese verstärken sich im Tagesverlauf weiter und bevorzugt zwischen Schwarzwald und Bayerischen Wald gibt es tagsüber längere Zeit Regen, der durchaus auch gewittrig ist. In den restlichen Landes-teilen gibt es ab und zu Schauer sowie einzelne kurze Gewitter und dazwischen zeigt sich vor allem am Nachmittag auch mal die Sonne. Windig bei 14 bis 23 Grad. "
f"Am Sonntag ist es in weiten Landes-teilen weiterhin wechselhaft und windig mit mehr Wolken als Sonne und Regen oder Schauern, vereinzelt mit Blitz und Donner. Im Südwesten ist es wieder freundlicher. 13 bis 22 Grad. "
f"Am Montag bleibt es vor allem nach Osten und Nordosten hin noch wechselhaft mit Schauern. Sonst ist es bei einem Mix aus Sonne und Wolken meist trocken. 13 bis 24 Grad. ")
audio=gTTS(text_eins,lang='de',slow=False)
audio.save("Wetter.mp3")
audio.save("Wetter.wav")

text_zwei = (f"Im Dezember 2019 tauchte in China ein neues Virus aus der Familie der Coronaviren auf: Sars-Cov-2. Es verursacht die Lungenkrankheit Covid-19, typische Symptome sind Fieber, Husten, Atemprobleme, teilweise Schnupfen und Durchfall. Es kann eine lebensbedrohliche Lungenentzündung entstehen. Meist verläuft der Infekt weniger schwer."
f"Die Erkrankung ist ansteckend: von Mensch zu Mensch per Tröpfchen- oder Schmierinfektion.")
audio=gTTS(text_zwei,lang='de',slow=False)
audio.save("Corona.mp3")
audio.save("Corona.wav")

text_drei = (f"Der Ball wird wieder rollen in der Bundesliga und zweiten Bundesliga! Doch der Fußball wird sich anpassen - in der aktuell so besonderen Situation für alle Menschen in Deutschland. Denn die Gesundheit aller steht an erster Stelle. Für die Fortsetzung der Saison hat die von der DFL-Mitgliederversammlung ins Leben gerufene \"Task Force Sportmedizin/Spielbetrieb\" ein detailliertes Hygienekonzept entwickelt."
f"\"Grundlage war die Erstellung eines Konzeptes, dass hygienische, medizinische und Organisatorische Vorgaben definiert. Die vor und während der Wiederaufnahme von Mannschaftstraining, Spielbetrieb, verpflichtend zum Einsatz kommen\", sagt DFL-Geschäftsführer Christian Seifert.")
audio=gTTS(text_drei,lang='de',slow=False)
audio.save("BuLi.mp3")
audio.save("BuLi.wav")