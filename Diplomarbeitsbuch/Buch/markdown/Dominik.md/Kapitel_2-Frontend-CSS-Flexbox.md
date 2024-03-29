# Kapitel 2 - Frontend
## Flexbox
Flexbox, offiziell CSS Flexible Box Layout Module, ist eine neue Art und ein neues Konzept um eindimensionale Layouts auf Webseiten umzusetzen. Die herkömmliche Art Objekte auf einer Webseite zu positionieren ist, fixe Positionen und Maße zu vergeben. 

Doch bei Flexbox werden bestimmte Regeln festgelegt, diese machen das Verhalten der Webseite vorhersagbar bei einer Veränderung der Bildschirmgröße. Anschließend ist es dem Browser überlassen, die Breite, Höhe, Position und Anordnung zu wählen. 

#### Das Konzept
Die Grundidee ist es, dem Flex-Container die Möglichkeit zu geben, die Maße der Elemente so zu verändern, dass der Platz auf unterschiedlichen Bildschirmaufslösungen bestmöglich ausgenutzt ist. Um das zu erzielen lässt das Elternelement die Kindelemente je nach Bedarf wachsen oder schrumpfen.

#### technische Spezifikation
Innerhalb eines \<div> Tags können die einzelnen Elemente ihre Größe "flexibel" verändern. Sie wachsen, um freien Platz zu verwenden oder schrumpfen, um innerhalb des Elternobkjekts zu bleiben und einen Overflow zu vermeiden. Der große Vorteil des Flexbox Layouts ist die Richtungsunabhängigkeit. Dadurch ist es sehr flexibel, was Orientierungsänderungen bei mobilen Geräten oder Auflösungsänderungen auf Desktop Geräten betrifft.

#### Erklärung anhand eines realen Beispiels
Auf dem Dashboard soll eine seitliche Navigation angezeigt werden, die auf mobilen Geräten an den unteren Rand des Bildschirms wandert, siehe Abbildung 1. 

![alt text](../../Design/Flexbox_Illustration_1.png)

Mithilfe von Flexbox ist dieses Verhalten einfach zu erzielen.	
Ich erstelle ein Elternelement mit folgenden Eigenschaften:


```Sass
.parent{
  display: flex;
  overflow: hidden;
}
```
Die Kindelemente dieser Flexbox werden auf der horizontalen Hauptachse ausgerichtet. Der Overflow auf der X- und Y-Achse wird ausgeblendet. Die Navigation auf der Seite ist in folgendem Code-Block beschrieben.

Dieses Element ist durch order:1 das erste Element in der Flexbox. Der Overflow auf der Y-Achse ist versteckt, um die Leiste zu fixieren. Weiters werden die Elemente innerhalb vertikal und horizontal zentriert und sind entlang der Y-Achse positioniert.

```Sass
.side-nav{
  display: flex;
  order: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
```
Das Inhaltselement hat order:2 damit es neben dem ersten auf der X-Achse positioniert wird. Ebenso ist der Overflow auf der Y-Achse versteckt. 

```Sass
.content{
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  order: 2;
}
```
Damit die Navigation auf mobilen Geräten am unteren Rand positioniert ist, benötigen wir eine Media Query. Mithilfe dieser können CSS-Stile anhand von verschiedenen Eigenschaften wie z.B. Bildschirmauflösung oder Seitenverhältnis manipuliert werden. Im untenstehenden Code-Block wird dies veranschaulicht. Indem wir die Hauptachse des Flexbox Elternelements auf die Y-Achse ändern, werden die beiden Kindelemente nun vertikal verteilt. Damit nun auch die Navigation unter dem Inhalt positioniert ist ändern wir die order auf 2. Weiters müssen die Höhe und Breite angepasst werden.

```Sass
@media (max-width: 576px){
  .parent{
    flex-direction: column;	//changed
  }

  .side-nav{
      order: 2;				//changed
      width: 100vw;			//changed
      height: 66px;			//changed
    }
  }
```
