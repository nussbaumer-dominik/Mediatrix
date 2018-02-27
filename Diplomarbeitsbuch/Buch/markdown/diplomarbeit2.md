
Kapitel aus der anderen Datei
=============================

Dieses Kapitel wurde als *diplomarbeit2.md* geschrieben und dann 
mit *pandoc* in \TeX\ umgewandelt.

```bash
pandoc --listings -s diplomarbeit2.md -o diplomarbeit2.tex 
```

Wie man sieht ist das ganz einfach, sogar Listings sind möglich. Weitere
Optionen sind möglich bzw. sinnvoll -- siehe Kapitel \ref{skripts}, 
Seite \pageref{skripts}. Man beachte die von Pandoc automatisch genmerierten 
Label für Querverweise.

Vorschlag zur Durchführung:

* ein Ordner mit den Pandoc-Dateien
* ein Skript/Batch-Datei erzeugt daraus die Latex-Dateien
   * in einem neuen Ordner -- das erhöht die Übersichtlichkeit
* die Latex-Dateien werden dann in das Hauptdokument eingebunden

Und nun zu einem Bild. 

![Der Text steht unterhalb](HTL3RLogo.png)

Man kann auch die Breite aber auch angeben.

![Das kleinere Bild](HTL3RLogo.png){width=12cm}

Oder ganz klein

![Das ganz kleine Bild](HTL3RLogo.png){width=2cm}

Auch Listen sind kein Problem, wichtig sind nur Leerzeilen zwischen den Listenpunkten. 
Hier sieht man eine einfache Aufzählung.

*  wichtig
*  auch ganz lange Texte können bei Listen
    geschrieben werden.
  
    Sogar mehrere Absätze sind möglich.

* Ende der Liste.

Welches Zeichen am Anfang der Liste steht ist dabei leicht einzustellen, im *pandoc* Manual gibt es nähere Infos:

1.  eins
2.  zwei

    i.  zwei eins -- Mindestens 4 Zeichen eingerückt
    i.  zwei zwei
   
1.  drei. *Pandoc* zählt richtig, das Zeichen am Anfang der Zeile ist nur ein Muster!

Mit den richtigen Optionen werden URLs automatisch richtig dargestellt und sind im fertigen Pdf auch
*klickbar*: http://pandoc.org/README.html


