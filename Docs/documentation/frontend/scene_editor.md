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

Zunächst wird eine Kopie des Arrays mit allen Elementen erstellt. 
Hierbei geht es darum, Updateprobleme auf dem Canvas zu vermeiden.
Anschließend wird in dieser Kopie ein neues Element hinzugefügt, welches die Koordinaten vom Klick auf den Canvas enthält.
Die ID wird dabei eindeutig auf "star-" und der aktuellen Menge an Elementen gesetzt.
Als Standardfarbe haben wir uns für Schwarz entschieden.
Höhe und Breite werden dabei passend zur Form gesetzt.

#### Backend-Typen
```
export type DataText = {
    description: string,
    type: string,
    anchor_point: string,
    pos_x: number,
    pos_y: number,
    color: string,
    font_size: number,
    font: string,
    pattern: string,
    width: number
}

export type DataImage = {
    description: string,
    type: string,
    pos_x: number,
    pos_y: number,
    size_x: number,
    size_y: number,
    color: string,
    path: string
}
```
DataText und DataImage enthalten das Datenformat, mit welchem das Backend später Texte oder Bild auf der fertigen Szene hinzufügt.
Die benötigten Typen wurden vom Backend vorgegeben.

**description** ist ein optionaler Parameter. Er beschreibt den Text.
**type** beschreibt die Art des Elementes. **type** ist entweder "text" oder "image".
**anchor_point** gibt an, an welcher Stelle der Text verankert wird. Dies kann man mit dem klassischen linksbündig, rechtsbündig oder zentriert setzen.
**pos_x** gibt die Position des Elements in Pixel auf der X-Achse an.
**pos_y** gibt dementsprechend die Position des Elements auf der Y-Achse an.
**color** gibt die Schriftfarbe an.
**font_size** gibt die Schriftgröße des Textes an.
**font** gibt die Schriftart an.
**pattern** enthält den eigentlichen Text.
**width** enthält die Breite des Textes.

Bei den Bildern gibt es noch folgende Parameter:

**size_x** gibt dabei die Breite des Bildes und **size_y** die Höhe des Bildes an.
Die beiden Variablen werden dabei gerundet, da das Backend keine Floats unterstützt. Sie werden durch die Variablen **width** und **scaleX** bzw. **height** und **scaleY** des Elementes errechnet.
**color** gibt die Farbart des Bildes an. Dies kann "RGBA" oder "L" sein.
**path** gibt den Dateipfad zu dem Element auf dem Laufwerk an.

```
export type BaseImg = {
    type: string;
    path: string;
    overlay: Array<DataImage | DataText>;
}
```

Das BaseImg stellt die Basis für die fertige Szene dar. Die Variable **type** muss dabei immer "pillow" sein. **path** enthält den Pfad zum aktuellen Hintergrundbild.
**overlay** enthält ein Array aus den vorher beschriebenen DataText und DataImages.

```
export type JsonExport = {
    scene_name: string;
    used_images: number[];
    used_infoproviders: number[];
    images: BaseImg;
    backgroundImage: number; //ID of the background image
    backgroundType: string;
    backgroundColor: string;
    backgroundColorEnabled: boolean;
    itemCounter: number;
    scene_items: Array<CustomCircle | CustomRectangle | CustomLine | CustomStar | CustomText | CustomImage>;
}
```

Der Typ **JsonExport** enthält die finalen Werte, welche das Backend direkt verarbeiten kann. 
Die Variablen kann man dabei grob in Backenddaten und Frontenddaten unterscheiden.
Backenddaten:

**scene_name** ist ein String und beschreibt den Szenennamen.
**used_images** ist ein Array aus ID's der im Backend verwendeten Bilder.
**used_infoproviders** ist ein Array aus Zahlen, welches die benutzten Infoprovider enthält. Allerdings wird im Frontend nur ein Infoprovider pro Szene unterstützt.
**images** enthält das BaseImg, welches vorher beschrieben wurde.

Frontenddaten:

**backgroundImage** enthält die ID des verwendeten Hintergrundbildes.
**backgroundType** enthält entweder "IMAGE" oder "COLOR".
**backgroundColor** enthält die verwendete Farbe, falls eine Farbe gewählt ist. Die Farbe ist bei keiner Veränderung weiß ("FFFFFF").
**backgroundColorEnabled** ist *true*, wenn eine Hintergrundfarbe verwendet wird, ansonsten *false*.
**itemCounter** enthält die Menge an Elementen, welche im *items*-Array vorhanden sind.
**scene_items** enthält das *items*-Array.

#### Items Array

Das *items*-Array enthält alle Elemente, welche auf dem Canvas hinzugefügt werden, mit Ausnahme von Hintergrundfarbe und Hintergrundbild.
Das Array wird mit Hilfe der folgenden Funktion im Hauptarray dargestellt:
```
{items.map((item: any) => (
    (item.id.startsWith('circle') &&
        <Circle
            key={item.id}
            name={item.id}
            draggable
            x={item.x}
            y={item.y}
            scaleX={item.scaleX}
            scaleY={item.scaleY}
            fill={item.color}
            radius={item.radius}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            rotation={item.rotation}
            onMouseOver={mouseOver}
            onMouseLeave={mouseLeave}
            dragBoundFunc={function (pos: Konva.Vector2d) {
                if (pos.x > 960 - item.radius) {
                    pos.x = 960 - item.radius
                }
                if (pos.x < 0 + item.radius) {
                    pos.x = 0 + item.radius
                }
                if (pos.y > 540 - item.radius) {
                    pos.y = 540 - item.radius
                }
                if (pos.y < item.radius) {
                    pos.y = item.radius
                }
                return pos;
            }}
        />)
```
Im obigen Beispiel sieht man die generelle Darstellung eines Kreises auf dem Canvas. Es werden die Elemente mit Hilfe der *map*-Methode des Arrays auf dem Canvas hinzugefügt.
Je nachdem, mit welchem Wort die ID des Elements beginnt, wird ein neues Konva-Element des zugehörigen Typs erstellt. Diesem Element werden bestimmte Eigenschaften zugewiesen, welche das Verhalten auf dem Canvas bestimmen.
Jedes Element benötigt eine *key*-Eigenschaft und einen Namen, worüber es eindeutig identifiziert werden kann. Dies liegt an der internen Struktur von Konva.
Wichtige Eigenschaften sind außerdem **draggable** und **fill**. Wenn **draggable** definiert ist, so wird das native Drag & Drop von KonvaJS aktiviert.
**fill** entspricht der *color*-Variable der Elemente, hier wird die Farbe festgelegt. Des Weiteren werden einige Methoden übergeben. Hierbei ist die dragBoundFunc interessant.
Darin wird definiert, was passieren soll, wenn der Benutzer das Element über eine bestimmte Koordinate zieht.

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