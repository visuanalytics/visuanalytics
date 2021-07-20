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
Alle Datentypen für Elemente enthalten die folgenden Eigenschaften:
```
x: number;
y: number;
id: string;
width: number;
height: number;
rotation: number;
color: string;
scaleX: number;
scaleY: number;
```
Über die Variablen **x** und **y** werden die Koordinaten des Elements gespeichert.
Die **id** enthält immer die eindeutige ID des Elements.
**width** gibt die Breite des Elements an.
**height** gibt die Höhe des Elements an.
**rotation** gibt an, um wieviel Grad ein Element gedreht ist.
**color** wird für die Schriftfarbe verwendet.
**scaleX** und **scaleY** werden für die Transformation verwendet. 
Der Wert ist standardmäßig als eins festgelegt.
Wenn das Element verkleinert wird, so wird der Wert kleiner als eins, ansonsten größer als eins.

#### Texte
```
textContent: string;
fontFamily: string;
fontSize: number;
```

Für alle Elemente, welche man auf dem Layer hinzufügen kann, haben wir einen eigenen Datentyp hinzugefügt. 
Hier oben sieht man den Datentyp für Texte jeglicher Art (API-Texte und eigene Texte).
In **textContent** wird der eigentliche Text gespeichert, welcher auf dem Canvas dargestellt wird.
**fontFamily** und **fontSize** geben jeweils die Schriftart und Schriftgröße des Elements an.

#### Bilder
```
image: HTMLImageElement;
imageId: number;
imagePath: string;
diagram: boolean;
index: number;
```

Bei Bildern gibt es zu den Variablen, welche in jedem Typ vorhanden sind, die obigen Variablen.
Dabei stellt **image** ein HTMLImageElement dar, welches ein neues window.Image()-Element mit der src von dem angefragten bzw. hochgeladenen Bild enthält.
Konva erstellt über dieses Element das tatsächliche Bild auf dem Canvas.
Die **imageId** ist die ID des Bildes im Backend und wird vom Backend gefetched, sie wird für die finale Erstellung des JSON-Objekted benötigt.
**imagePath** enthält den Pfad des Bildes im Backend, dieser wird ebenfalls gefetched.
**diagram** ist ein boolean, welches Beschreibt, ob ein Bild ein Diagramm ist oder nicht, da bei der Verarbeitung am Ende klar sein muss, wie das Bild im Backend gehandhabt werden muss.
**index** gibt den Index des Bildes im Frontend an.

#### Shapes

Die folgenden Formen können auf dem Canvas hinzugefügt werden:
* Kreise
* Rechtecke
* Sterne
* Dreiecke

Am Beispiel des Sterns kann man gut sehen, was passiert, wenn man ein Sternelement ausgewählt hat und dies auf dem Canvas hinzufügt.

```
case "Star": {
    const arCopy = items.slice();
    arCopy.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        id: 'star-' + itemCounter.toString(),
        color: "#000000",
        rotation: 0,
        width: 200,
        height: 100,
        scaleX: 1,
        scaleY: 1,
    } as CustomStar);
    setItems(arCopy);
    setCurrentItemColor(nextColor);
    incrementCounterResetType();
    return;
}
```

Zunächst wird eine Kopie des Arrays mit allen Elementen erstellt. Hierbei geht es darum, Updateprobleme auf dem Canvas zu vermeiden.

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