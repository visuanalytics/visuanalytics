# Szeneneditor
# Infoprovider-Auswahl
* Janek
# Szenen-Erstellung

---
## Canvas

Als Canvasframework haben wir uns für KonvaJS entschieden. Konva ist eine 2D-Canvas Bibliothek, ursprünglich in und für JavaScript verfasst, mit einem Port für React und Vue.
In unserer Implementierung haben wir die folgenden Funktionen implementiert:
* Hinzufügen von Elementen (Kreise, Rechtecke, Sterne und Dreiecke)
* Hinzufügen und Beabeiten von Texten
* Hochladen und Verwenden von eigenen Bildern
* Anpassung der Farbe von Elementen
* Anpassung von Schriftart, Schriftfarbe und Schriftgröße
* Drag and Drop von Elementen
* Duplizieren, Löschen und Rückgängig machen

KonvaJS basiert auf HTML5 Canvas. Dabei gibt es verschiedene Ebenen. 
Die generelle Struktur vom Editor ist wie folgt aufgebaut:
* Ebene 1: "Stage"
* Ebene 2: "Layer" mit Elementen

Die Stage bildet dabei die unterste Ebene. 
Sie dient als DOM-Wrapper für alle Layer und höheren Ebenen. 
Auf der Stage liegt ein Layer, welcher die eigentlichen Elemente enthält.
Ein Beispiel dafür wäre ein Kreis, welchen man hinzufügt. 
Auf dem Layer kann außerdem ein Hintergrundbild oder eine Hintergrundfarbe gewählt werden. 
Dazu wird je nach Wahl ein Element erstellt, welches ein Bild oder ein vollflächiges Rechteck ist.
Diese beiden Elemente haben jeweils **keine** "draggable" Eigenschaft, d.h. man kann sie nicht anwählen oder verschieben.
Darauf folgt eine sogenannte "Group".
In dieser Gruppe sind alle Elemente, welche der Benutzer selbst auf dem Canvas hinzufügt.
Sie werden über ein Array aus eigenen Datentypen über die forEach-Methode hinzugefügt.

---

* generelle Implementierung
* Framework
* Funktionsweise
### Datentypen
#### Texte
```
export type CustomText = {
    x: number;
    y: number;
    id: string;
    textContent: string;
    width: number;
    height: number;
    rotation: number;
    fontFamily: string;
    fontSize: number;
    color: string;
    scaleX: number;
    scaleY: number;
};
```

Für alle Elemente, welche man auf dem Layer hinzufügen kann, haben wir einen eigenen Datentyp hinzugefügt. 
Hier oben sieht man den Datentyp für Texte jeglicher Art (API-Texte und eigene Texte).
Über die Variablen "x" und "y" werden die Koordinaten von Elementen gespeichert. 
Die "id" enthält immer die eindeutige ID eines Elements. In "textContent" wird der tatsächliche Text gespeichert.
Dieser wird beim Bearbeiten des Textes überschrieben.
"width" gibt die Breite des Textelementes an.
Darüber lassen sich Linebreaks steuern.
"height" gibt die Höhe des Textfeldes an. Diese wird allerdings nicht verändert
"rotation" gibt an, um wieviel Grad ein Text gedreht ist. 
"fontFamily" und "fontSize" geben jeweils die Schriftart und Schriftgröße des Elements an.
"color" wird für die Schriftfarbe verwendet.
"scaleX" und "scaleY" sind für die Transformation da.

#### Shapes

#### Backend-Typen

#### Items Array

#### Hintergrund

* Farbe
* Bild

### States für die Verwaltung

### Transformation von Elementen

### Transformer

## "Bedienfeld"
* Remove, Duplicate, ...
## Datenauswahl

### ImageLists
#### Abfrage von Bildern
#### Wiederherstellung
#### Posten von Bildern
### DiagramsList

## Speichern der Szene
* Stages (Background, Preview)