---
layout: post
title: Podobnosť zdrojových kódov programov
categories: [Algoritmy]
tags: [scala,levenshtein,cosine similarity, vektorizácia textu]
date: 2018-08-26 23:59:00
math: true
author: peterj
description: Pohľad laika programátora na to, ako by sa dala merať podobnosť zdrojových kódov.
---

Kopírovanie je jedna z najpoužívanejších operácií v počítači. Plagiátorstvo tak dostalo dokonalé prostredie na svoju evolúciu.
Snažím sa predstaviť si, ako doslovne cieľ má právo svätiť prostriedky. Téma plagiátorstva v programovaní ma zaujala už pred časom
hlavne z môjho školského prostredia. Videl som, ako niektorí učitelia s týmto fenoménom bojovali právom, ale musím uznať, že občas
sa z niektorých zadaní dalo vyznať len po preštudovaní iného hotového riešenia.

# Úvodné slová

Plagiát v istom slova zmysle "nadobudne život" vtedy, keď človek kópiu, ktorú vytvoril, začne vydávať za originál. V tom je
podľa mňa podstata tej "zlej tváre" plagiátorstva. Pretože ide o určitú formu klamstva, nepoctivosti a snahy o získanie niečoho
nezaslúžene.

Avšak "kopírovať" - časti alebo celky a prípadne ich modifikovať, priamo podporujú nielen [copyleft][33] licencie, ale je to jedna z
najefektívnejších foriem učenia sa. Keď som začínal s programovaním, najviac mi dali cudzie zdrojové kódy, ktoré som nielen
študoval, ale snažil sa ich upraviť, zmeniť tak, aby program robil niečo trochu iné. V programoch som nechával kusy kódu,
ktorým som nerozumel alebo ktoré boli príliš previazané a veľké. Alebo som z cudzích kódov "vykrádal" použiteľné užitočné funkcie
do mojich vlastných programov určených na úplne iný účel.

To mi umožnilo sústrediť sa na to, čo som práve chcel naprogramovať a ignorovať to, čo v danej chvíli nebolo pre mňa dôležité,
ale trebalo to v programe mať. Myslím si, že práve tento prístup mi veľmi pomohol udržať si motiváciu a chuť ostať pri programovaní.
Niektorých mojich známych totiž odradilo to, že sa na niečom zasekli. Na začiatku je podľa mňa správne snažiť "skosiť"
učiacu krivku čo najviac, aj umelým spôsobom, aby boli veci prístupnejšie.

Dokonca aj dnes kopírujeme - či už kód alebo myšlienky - hlavne zo [Stack Overflow][34], ktoré však, [zdá sa, oficiálne nikoho netrápi](https://meta.stackexchange.com/questions/270014/is-copy-pasting-code-from-stack-overflow-an-infringement-to-cc-by-sa-3-0-or-is-i).

## O čom bude blogpost

Začal som sa zaoberať myšlienkou preskúmať niektoré veľmi jednoduché (a možno trochu netypické) metódy na určenie miery
podobnosti dvoch zdrojových kódov v tom istom programovacom jazyku - riešení toho istého zadania. Výsledkom porovnania by malo byť
desatinné číslo od $$0$$ (sú rozdielne) do $$1$$ (sú totožné).

## Vplyv na výsledok

Som presvedčený o existencii predpokladov, ktoré musia platiť, aby porovnávanie dvoch riešení malo vôbec zmysel. Inými slovami,
aby pri použití optimálnej metódy boli všetky výsledky rovnako pravdepodobné. Teda aby sme nevedeli určiť výsledok ešte predtým ako
použijeme danú porovnávaciu metódu.

Výsledok by sme vedeli určiť napríklad v prípade, ak by sme mali dve ortogonálne (nesúvisiace) zadania. Riešenia by v
takom prípade boli už z podstaty rozdielne. Rovnako rozdielne riešenia (aspoň syntakticky) by sme dostali, keby boli použité
rozdielne programovacie jazyky. Zadanie teda musí byť jedno, a povolený jeden spoločný programovací jazyk.

Na druhej strane, spoľahlivé výsledky - za predpokladu použitia optimálneho algoritmu - môžme dostať len ak samotné
zadanie *umožní* vytvárať rôznorodé riešenia. Problém v tomto prípade spôsobuje tzv. boiler-plate kód, ktorému sa nemusí
vždy dať vyhnúť už z podstaty a preto ho môžme čakať v každom riešení. S problémom sa dá vysporiadať tak, že budeme očakávať
istú mieru podobnosti, ktorú nebudeme považovať za plagiátorstvo.

# Levenshteinova vzdialenosť

Základným princípom tohto algoritmu je nájdenie minimálneho počtu úprav (zmien znakov), ktoré treba urobiť (či už v prvom alebo
druhom texte), aby sme dosiahli zhodu zdrojových kódov.

Ak by sme to mali robiť ručne na papieri, intuitívne by sme začali napríklad umiestnením dvoch slov pod seba tak, aby spolu buď
začínali, alebo končili:

<pre>
      &darr;
a h o j
  h o j
      &uarr;
</pre>

Z tohto príkladu hneď vidíme, že by stačilo pridať písmeno "a" na začiatok druhého slova, alebo ho odobrať zo začiatku prvého
slova aby bola dosiahnutá zhoda. Algoritmus preto nerozlišuje, ktorú operáciu vykonáme, efekt je rovnaký - potrebujeme práve
*jednu* zmenu znaku.

Menej viditeľný minimálny počet potrebných zmien sa musí robiť viac systematicky. V tom prípade nám počiatočná pozícia dvoch textov
určuje koreň fiktívneho "rozhodovacieho" stromu, ktorého ďalšie vetvenie vzájomne pozične posunie tieto dva texty: 

```
            ahoj|hoj_________________________________________________
          /                                     \                   \
        aho|hoj____________________            ahoj|ho___________  aho|ho
      /                    \      \          /                  \    |
    ah|hoj______________  aho|ho  ah|ho    aho|ho______________  ... ...
  /      \             \    |      |     /             \      \
a|hoj   ah|ho_____    a|ho ...    ...  ah|ho_____     aho|h  ah|h
  |    /     \    \     |             /     \    \      |      |
a|ho a|ho   ah|h  a|h  a|h          a|ho   ah|h  a|h  ah|h    a|h
  |    |      |                       |      |          |
  a|h  a|h    a|h                     a|h    a|h        a|h
```

Tento strom vizualizuje tri operácie:

1. Posun prvého slova doprava
2. Posun druhého slova doprava
3. Posun obidvoch slov doprava

Každá cesta, tvorená unikátnym "zostupom" z koreňa stromu až do listu prechádza určitým počtom vrcholov a hrán. Každej hrane
priradíme číslo buď 0 alebo 1 takto:

1. Ak hrana prechádza do situácie, v ktorej sa mení pozícia jedného zo slov, priradíme jej číslo 1
2. Ak hrana prechádza do situácie, v ktorej sa mení pozícia oboch slov tak číslo priradíme takto:
    1. Ak sa písmená na poslednej pozícii rovnajú, tak 0
    2. Ak sa písmená na poslednej pozícii nerovnajú, tak 1

Každú cestu teda ohodnotíme týmito "bodmi", ktoré spočítame. Následne vyberieme tú cestu, ktorá má minimálny počet bodov. 

V našom prípade však nepotrebujeme vedieť presný postup ako docielime zhodu, postačí nám vedieť len hodnotu tej najkratšej cesty.
Túto hodnotu potom normalizujeme na rozsah od $$0$$ do $$1$$ takto:

$$norm = levenshtein(text_1, text_2)/max(|text_1|, |text_2|)$$

kde $$levenshtein$$ je hodnota levenshteinovej vzdialenosti. Samotnú funkciu v Scale vieme napísať rekurzívne takto:

```scala
val x = "ahoj"
val y = "hoj"

def levenshtein(i:Int, j: Int) = {
  if (i == 0 || i == 0) return math.max(i,j)
  math.min(
    1 + levenshtein(i - 1, j),  // Posun prvého slova doprava
    1 + levenshtein(i, j - 1),  // Posun druhého slova doprava

    if (x(i) != y(j)) 1 + levenshtein(i - 1, j - 1) // Posun oboch slov doprava, úprava znaku
    else levenshtein(i - 1, j - 1) // Posun oboch slov doprava bez úpravy znaku
  )
}
```

Tento algoritmus vlastne prejde celý hore-spomínaný "strom" a vyberie tú najkratšiu cestu k zhode. Čo si však môžme
všimnúť je, že určité časti stromu sa opakujú. To je väčšinou príznakom, že môžme využiť techniku dynamického programovania
a znížiť tak asymptotickú zložitosť algoritmu.

Dynamické programovanie znamená väčšinou ukladanie si medzivýsledkov výpočtu a ich následné využitie, ak sa dostaneme
do situácie, ktorú sme už predtým počítali. Varianta pomocou dynamického programovania môže vyzerať v Scale takto:


```scala
  def levenhstein(x: String, y: String): Double = {
    def min(args: Int*) = args.min

    val (lenX, lenY) = (x.length, y.length)
    val maxLen = math.max(lenX, lenY)

    if (min(lenX, lenY) == 0) return 0 // Normalizovaná 0

    val edits = Array.fill(lenX, lenY)(0)

    for (i <- 1 until lenX) edits(i)(0) = i
    for (j <- 1 until lenY) edits(0)(j) = j

    for (i <- 1 until lenX; j <- 1 until lenY) {
      val cost = if (x(i) == y(j)) 0 else 1

      edits(i)(j) = min(
        edits(i - 1)(j) + 1,
        edits(i)(j - 1) + 1,
        edits(i - 1)(j - 1) + cost
      )
    }

    // normalization
    1 - edits(lenX - 1)(lenY - 1).toDouble / maxLen.toDouble
  }
```

V poslednom riadku sa deje normalizácia, ktorú potrebujeme ak chceme výsledok v rozsahu 0 - 1, podľa pôvodnej
definície. 

## Problémy distance algoritmov

Algoritmy z kategórie "edit distance", kde patrí aj Levenshteinova vzdialenosť, trpia určitými nevýhodami:

- čím sú dĺžky porovnávaných programov rozdielnejšie, tým menšiu podobnosť (viac "edit" operácií) algoritmy vracajú
- algoritmy sú citlivé rovnako na všetky kategórie tokenov (napr. použité kľúčové slová vs. komentáre budú merané "rovnakým
  metrom"). Napríklad, v prípade rovnakých programov, kde jeden z nich bude okomentovaný a druhý nie, náš algoritmus bude
  tvrdiť, že programy sú rozdielne.

Z toho vyplýva, že použitie edit distance algoritmov samo o sebe nie je vhodné na test plagiátorstva. Situáciu však
vieme zlepšiť, keď z programov najprv vyhodíme nadbytočné medzery a komentáre (program "normalizujeme") a až potom aplikujeme
algoritmus.

Pri normalizácii si však musíme dať pozor na to, aby sme zas neodstraňovali literály, a štýl pisateľa (napr. zbytočné bloky,
alternatívne zápisy ako napr. if-then vs. terciálny operátor, atď.). Štýl je totiž jedna z charakteristík, ktorá je vlastná
konkrétnemu autorovi.

# Kosínusová podobnosť

Jedným zo spôsobov, ako sa vyrovnať s rôznou váhou jednolivých tokenov pri porovnávaní je - ako som spomenul - odstrániť
nepodstatné tokeny. Avšak nie vždy musia mať tokeny binárnu dôležitosť; niekedy chceme dať tokenom skutočnú váhu. Umožní
nám to napríklad metóda, ktorá sa používa hlavne pri spracovávaní prirodzeného textu. Tento algoritmus berie do úvahy
váhu slov, pričom váha slova je definovaná ako jeho početnosť v texte.

Pozrime sa na obrázok z [Wikipédie][30]:

![TwoVectors](/assets/img/podobnost-zadani/Dot_Product.svg)

Vidíme na ňom dva vektory, $$\vec{a}$$ a $$\vec{b}$$, ktoré sú umiestnené tak, aby mali rovnaký začiatok. Z matematiky
vieme, že vektor je definovaný len svojou veľkosťou a smerom, preto si vektory môžme umiestniť ako chceme, keď zachováme
tieto dve veci.

Ako by sa dali takéto dva vektory porovnať? Jednoduchšie sa porovnávajú dĺžky: majme teda dĺžky $$m$$ a $$n$$,
potom $$m / n$$ udáva ich pomer, podľa ktorého vieme povedať, ktorá z nich je "dlhšia" alebo či sa rovnajú:

- $$m / n = 1$$ &rArr; rovnajú sa
- $$m / n > 1$$ &rArr; $$m > n$$
- $$m / n < 1$$ &rArr; $$m < n$$

V prípade dvoch vektorov však máme okrem veľkosti aj smer, ktorý musíme brať do úvahy. Vektory sú k sebe tým bližšie,
čím menší uhol zvierajú a čím menej rozdielna je ich vzájomná veľkosť. Existuje veličina, ktorá zahŕňa presne to,
čo potrebujeme. Táto veličina jednoznačne reprezentuje vzájomnú polohu dvoch vektorov. Berie do úvahy ako ich veľkosť,
tak aj uhol medzi nimi. Ide o skalárny súčin.

## Skalárny súčin geometricky

Geometrickým spôsobom je skalárny súčin (anglicky [dot product][31]) definovaný ako:

$$a \cdot b = (\|\vec{a}\| cos(\theta)) \|\vec{b}\| $$

Tento tvar som si trochu upravil, aby bola jasná korešpondencia s obrázkom. Čo tento skalárny súčin vlastne vyjadruje?
Je to jedno číslo, ktoré má známe vlastnosti, napríklad:

- ak sú vektory navzájom kolmé (bez ohľadu na vzájomnú veľkosť), platí $$a \cdot b = 0$$
- ak majú vektory rovnaký smer (sú rovnobežné), ale majú rozdielnu veľkosť, platí: $$a \cdot b = \|\vec{a}\| \|\vec{b}\|$$
  (teda $$\theta = 0°$$)
- ak majú vektory rovnaký smer aj veľkosť (sú zhodné), platí:
  $$a \cdot b = a \cdot a = \|\vec{a}\| \|\vec{a}\| = \|\vec{a}\|^2$$

Sú to tri zaujímavé situácie - prvá a posledná nie náhodou pripomína dva extrémy podobnosti, ako sme si ich definovali
na začiatku (0 pre žiadnu podobnosť a 1 pre zhodu). Ale len pripomína - skalárny súčin síce je "reprezentatívnym" číslom
vzájomnej polohy a veľkosti dvoch vektorov (hlavnou myšlienkou merania ich "podobnosti"), ale ešte nie sme hotoví, pretože
číslo potrebujeme normalizovať.

Normalizáciu nám dá $$cos(\theta)$$, pretože kosínus má obor hodnôt v rozsahu 0 - 1. Je to vlastne geniálny "trik", pretože
nám tým vznikne "pomer" dvoch vektorov:

$$cos(\theta) = \frac{a \cdot b}{\|\vec{a}\| \|\vec{b}\|}$$

Tu sa teoreticky môžme zaseknúť, pretože vidíme, že na to aby sme mohli vypočítať $$cos(\theta)$$, potrebujeme vedieť skalárny
súčin dvoch vektorov, na ktorý potrebujeme práve $$cos(\theta)$$. Dostali sme sa do nekonečnej rekurzie :)

## Skalárny súčin algebraicky

Našťastie skalárny súčin sa dá vyjadriť aj inak, ak si vektory definujeme algebraickým spôsobom. Teda ak zložky vektora
sú diskrétne hodnoty:

$$
\begin{eqnarray}
\vec{a} & = & [a_0, a_1, ..., a_n] \\
\vec{b} & = & [b_0, b_1, ..., b_n]
\end{eqnarray}
$$

Geometrický skalárny súčin (podľa úvodného obrázku) je výsledok násobenia projekcie vektora $$\vec{a}$$ s veľkosťou vektora
$$\vec{b}$$. Táto projekcia ($$\|\vec{a}\| cos(\theta)$$) alebo "priemet" ako keby reprezentovala tie body z $$\vec{a}$$,
ktoré vidíme, keď sa na $$\vec{b}$$ pozrieme "zhora". Nazýva sa "skalárna projekcia".

Je možné ukázať, že zložky algebraicky definovaných vektorov sú vlastne skalárne projekcie v smere osí karteziánskej sústavy
súradníc. Teda ak máme dvojrozmerné vektory (ako v našom obrázkovom príklade), zložky $$a_0$$ resp. $$a_1$$ sú skalárnymi
projekciami na os $$x$$ resp. $$y$$ (pohľad "zhora" na vektor odpovedá $$a_0$$ a pohľad "zboku" na vektor odpovedá $$a_1$$).

Vďaka tomuto pozorovaniu vieme odvodiť, že skalárny súčin vektorov v algebraickom tvare sa dá napísať takto:

$$
a \cdot b = \sum_i{a_i b_i}
$$

Tento výsledok je veľmi dôležitý, pretože sa konečne vieme pohnúť z "nekonečnej rekurzie" a dosiahnuť použiteľný vzorec
pre kosínusovú podobnosť:

$$cos(\theta) = \frac{\sum_i{a_i b_i}}{\|\vec{a}\| \|\vec{b}\|}$$

Je myslím veľmi zaujímavé, že takto definovaná kosínusová podobnosť kombinuje obe definície skalárneho súčinu - geometrického
aj algebraického.


## Vektorizácia textu

Keďže kosínusová podobnosť pracuje s vektormi, musíme si nejakým spôsobom previesť text (zdrojový kód) na algebraický
vektor. V súčasnej dobe (napr. v NLP - Natural Language Processing) je veľmi populárna metóda, ktorá definuje zložky
vektora ako dvojice `(slovo, počet výskytov tohto slova)`. Napríklad text "Daruj mi ružu, daruj mi aj leukoplast" sa
dá previesť do vektora:

$$
\vec{a} = [(\text{daruj}, 2), (\text{mi}, 2), (\text{ružu,}, 1), (\text{aj}, 1), (\text{leukoplast}, 1)]
$$

V Scale by sme tento prevod mohli dosiahnuť veľmi jednoducho:

```scala
def vectorize(text: String) = {
  content.split("\\s").groupBy(key => key).mapValues(group => group.length)
}
```

## Skalárny súčin vektorizovaného textu

Otázkou teraz ostáva, ako vypočítame skalárny súčin takýchto vektorov? Algebraicky je "dot product" definovaný ako
$$\sum_i{a_i b_i}$$. Teda ak naše vektory sú:

$$
\begin{eqnarray}
\vec{a} & = & [(\text{daruj}, 2), (\text{mi}, 2), (\text{ružu,}, 1), (\text{aj}, 1), (\text{leukoplast}, 1)] \\
\vec{b} & = & [(\text{daruj}, 2), (\text{mi}, 2), (\text{kvet,}, 1), (\text{aj}, 1), (\text{vázu}, 1)]
\end{eqnarray}
$$

ich veľkosť je rovnaká, takže jediným problémom ostáva, ako vypočítať $$a_i * b_i$$. Tu sa musíme trochu zastaviť. Čo
je index $$i$$? Je to index položky v našom vektore? Nie celkom. Jednotlivé slová vo vektore si môžme predstaviť
ako dimenzie vektora. Ak by sme vektory mali prirovnať ku klasickým euklidovským vektorom, tak jednotlivé slová by
odpovedali jednotlivým osiam v kartézskej sústave súradníc. Medzi sebou môžme "násobiť" len tie zložky vektora, ktoré
sú v rovnakých dimenziách. Do reči ľudí - vynásobíme medzi sebou počet výskytov slova v každom z vektorov:

```scala
def dotProduct(vectorA: Map[String, Int], vectorB: Map[String, Int]) = vectorA.map {
    case (word, count) => vectorB.getOrElse(word, 0) * count
  }.sum
```

Ako ste si možno všimli, v prípade, že slovo z vektora $$\vec{a}$$ sa vo vektore $$\vec{b}$$ nenachádza, tak toto
slovo neberieme do úvahy. Môže sa to zdať ako chyba, ale v skutočnosti ide o správne riešenie, pretože neexistencia
určitého slova v druhom vektore znižuje zhodu (znižuje hodnotu skalárneho súčinu vektorov, ktorý je v menovateli
kosínusovej podobnosti).

## Konečne "finálne" riešenie

Ostáva nám ešte vypočítať veľkosť vektorov, aby sme nakoniec mohli určiť finálnu kosínusovú podobnosť. Spojím to
dokopy:

```scala
  def magnitude(vector: Map[String, Int]): Double = {
    math.sqrt(vector.values.map(count => count * count).sum)
  }

  def cosine(textA: String, textB: String):Double = {
    val vectorA = vectorize(textA)
    val vectorB = vectorize(textB)
  
    val rawMagnitude = magnitude(vectorA) * magnitude(vectorB)
    val magnitude = if (rawMagnitude == 0) 1 else rawMagnitude

    dotProduct(vectorA, vectorB) / magnitude
  }
```

A pre naše vektory $$\vec{a}$$ a $$\vec{b}$$, teda pre vety:

1. "daruj mi ružu, daruj mi aj leukoplast"
2. "daruj mi kvet, daruj mi aj vázu"

dostávame kosínusovú podobnosť $$81\%$$. Pre porovnanie, naša Levenshteinova podobnosť dáva hodnotu $$62\%$$.
Zo siedmich slov sú päť rovnakých, teda $$\frac{5}{7} = 0.71 \equiv 71\%$$ (pri rovnakej váhe slov). Kosínusová vzdialenosť
vzala do úvahy aj opakujúce sa slová v rámci jedného textu ("daruj" a "mi"), takže pre ňu texty vyzerali skôr ako:

1. `[("daruj",2), ("mi",2), ("ružu,",1), ("aj",1), ("leukoplast",1)]`
2. `[("daruj",2), ("mi",2), ("kvet,",1), ("aj",1), ("vázu",1)]`

Početnosť slov je "váhou" slova, a v tomto prípade máme zhodu v tých najviac vážených slovách ("daruj" a "mi"), čo
viac prispieva k celkovej zhode textov, a preto je hodnota vyššia ($$81\%$$).

Ak by vety mali tvar:

1. "daruj mi ružu, aj leukoplast"
2. "daruj mi kvet, aj vázu"

Tak kosínusová podobnosť dá $$60\%$$ a Levenshtein $$55.2\%$$. Evidentne lepšie je na tom kosínusová podobnosť,
pretože tu váha slov je rovnaká a tri z piatich slov sú zhodné, čo je $$\frac{3}{5} = 0.60 \equiv 60\%$$.

## Problémy algoritmov vektorizácie texu

Hlavným problémom algoritmov typu "vector similarity" je váha slova definovaná ako jeho početnosť:

- váhu potrebujeme niekedy umelo upraviť podľa predefinovanej dôležitosti tokenov (napríklad komentáre ju budú mať nulovú)
- programy s nepormerne väčším počtom výskytov jedného tokenu a menším počtom iných tokenov budú vykazovať veľkú zhodu
  napriek tomu, že budú rozdielne
- sémantické rozdiely syntakticky priveľmi podobných programov sa do úvahy neberú. To však platí pre všetky metódy.

Príklad posledného bodu sú funkcie `max` a `min`:

```java
int max (int[] list) {
  int acc = list[0];
  for (int i = 1; i < list.length; i++) {
    if (list[i] > acc) {
      acc = list[i];
    }
  }
  return acc;
}
```

vs.

```java
int min (int[] list) {
  int acc = list[0];
  for (int i = 1; i < list.length; i++) {
    if (list[i] < acc) {
      acc = list[i];
    }
  }
  return acc;
}
```

Kosínusová podobnosť dáva v tomto prípade $$99.7\%$$ a levenshtein $$97.5\%$$, pričom sémantika je evidentne opačná, avšak syntakticky sú si
programy skutočne veľmi podobné. Levenshtein tu dal trochu lepší výsledok, lebo zavážili rozdielne znaky, zatiaľ čo v prípade kosínusovej podobnosti
boli názvy funkcií ignorované, rovnako tak aj názvy premenných.

Sémantické rozdiely, ktoré sú definované jedným rozdielnym "znamienkom" (v našom prípade `<` vs. `>`) nie je možné brať do úvahy bez toho, aby
sme program simulovali. Podobnosť zdrojových kódov je a bude navždy obmedzená len na syntax, prípadne môže byť teoreticky rozšírená o rozpoznávanie
nejakých známych "patternov" s preddefinovanou váhou. Takéto patterny sa však dajú definovať a hľadať už len s pomocou
[derivačného stromu][21] (stromová štruktúra sparsovaného textu) za spolupráce parsera. Metódy ako Levenshtein alebo Kosínusová vzdialenosť sú implementovateľné ľahko, postačí jednoduchý lexikálny analyzátor (na ktorý často stačí regulárna gramatika).

# Za optimálnou metodikou

Existuje niekoľko typov či kategórií algoritmov na porovnávanie štruktúrovaného alebo neštruktúrovaného textu, z ktorých som spomenul
dvoch reprezentantov z dvoch takýchto kategórií.

## "Edit distance" - počet úprav

Ak nám ide o to, do akej miery sú texty skopírované, presnejšie do akej miery je text *poupraveným* tvarom iného textu, má zrejme zmysel
hľadať minimálny počet úprav, ktoré by viedli od pôvodného textu k novému.

Bude nás teda zaujímať tzv. "vziadelonsť medzi úpravami" - anglicky to znie lepšie ako "[edit distance][10]". Do tejto kategórie
patria aj niektoré algoritmy na porovnávanie grafov/stromov, ktoré naznačím nižšie - kde hovoríme o tzv.
"[graph edit distance][11]", resp. "[tree edit distance][19]".

Pre jednoduchosť zatiaľ vypusťme znalosť gramatiky, a skúsme nájsť algoritmy, ktoré pracujú len s čistým textom.
Máme hneď niekoľko možností:

- [Levenshteinova vzialenosť][14], ktorá podporuje operácie: vkladanie (insert), zmazanie (delete) a
  substitúciu (substitution) s rovnakou váhou
- [Damerau–Levenshteinova][12] vzdialenosť, ktorá naviac podporuje transpozíciu písmen
- [Hammingova vzdialenosť][15], ktorá podporuje len substitúciu a dá sa preto použiť len pre rovnako dlhé texty
- [Jaro-Winklerova][13] vzdialenosť, ktorá podporuje len transpozíciu písmen, a zvyšuje podobnosť textov ktoré sú zhodné
  na dlhšom prefixe

Vlastnosťou edit-distance algoritmov, ako už bolo spomenuté je, že sú citlivé na presnosť a poradie znakov.

## Izomorfizmus derivačných stromov

Z technického hľadiska porovnávame dva texty, ktoré musia vyhovovať formálnej gramatike toho istého programovacieho
jazyka zadania. Preto pri samotnom porovnávaní informáciu o gramatike môžme využiť:

- Sparsovanie programu umožní jeho kvalitné "normalizovanie". Napríklad - odstránia sa komentáre či nadbytočné medzery.
  Taktiež je možné [derivačný strom][21] (stromová štruktúra sparsovaného textu) pretransformovať a napr.
  znormalizovať názvy premenných.
- Derivačné stromy môžme medzi sebou rovno porovnať, všeobecne ako "mieru ich izomorfizmu".

V súčasnosti existuje niekoľko kategórií na porovnávanie [podobnosti grafov][20] a stromov:

1. odpoveď na otázku ["sú stromy izomorfné?"][22] (typu áno/nie). Ale to nám nedá dostatočne jemnú granularitu.
2. jemenejšiu granularitu (napr. [tu][23] alebo články [tu][25]) nám dá odpoveď na otázku - aký je minimálny počet grafových úprav
  na jednom derivačnom strome (je jedno ktorom), aby sme dosiahli izomorfizmus. Je to varianta otázky: *"Do akej miery v strome existujú rovnaké podstromy?"* - alebo ešte inak - *"Do akej miery programy obsahujú rovnaké vzory?"*
3. existujú aj [štatistické metódy][26] porovnania (koľko majú grafy vrcholov, koľko majú hrán, aký stupeň 
  majú vrcholy, atď.) - napr. [tu][27] alebo [tu][28].
4. metódy na porovnanie nejakých s grafom nesúvisiacich informácií extrahovaných z grafu, v našom prípade z anotovaného
  derivačného stromu (napríklad porovnanie názvov a/alebo počtu premenných, porovnanie konštánt (literálov), atď.).

Niektoré z týchto algoritmov principiálne môžu mať problém s definovaním "jemnozrnnosti" podobnosti dvoch
zadaní v požadovanom rozsahu od 0 do 1. Najlepšou metódou sa mne osobne javí preto možnosť č.2, avšak celkovo na mňa pôsobí
značne zložitým dojmom.

## Vektorizácia textu

Kontrastom k tzv. "edit distance" algoritmom sú algoritmy merajúce podobnosť vektorov ("vector similarity"), ktoré sa
používajú hlavne pri spracovávaní prirodzeného textu. Tieto algoritmy berú do úvahy aj váhu slov, pričom váha slova je
často definovaná ako jeho početnosť. Vektory sa dajú porovnať medzi sebou priamo. Najznámejšie algoritmy na porovnanie
vektorov sú:

- [Jaccardov index][17]
- [Kosínusová podobnosť][16]

Kvalita porovnávania dvoch zdrojových kódov programov bude závisieť hlavne od dobrej vektorizáce, pričom slová sú
v tomto prípade lexikálne symboly (tokeny). Program teda potrebujeme do určitej miery sparsovať, ale bude stačiť len lexikálny
analyzátor ("lexer" či "tokenizer") daného programovacieho jazyka, ktorý je jednoduchší než celý parser (gramatika lexikálnych
symbolov je vo veľkej väčšine prípadov regulárna (nepotrebujeme zásobník), oproti syntaktickému analyzátoru, kde je často
bezkontextová (potrebujeme zásobník)).

## "Štylometria"

Posledným typom algortimov na hľadanie podobnosti sú tzv. "[štylometrické][4]" algoritmy, ktorých cieľom nie je porovnanie dvoch
textov medzi sebou, ale rovno nájdenie autora textu. V tomto prípade sa väčšinou využíva strojové učenie (machine learning).

Princíp je prilbižne takýto: máme k dispozícii texty, pričom vieme, že text $$T_i$$ napísal autor $$A_i$$. Čím viac textov
máme, tým lepšie. Pomocou týchto textov vytvoríme pre každého autora "model" (napr. využitím umelej neurónovej siete), ktorý
bude obsahovať extrahované štylometrické informácie, špecifické pre autora.

Keď máme modely, môžme ich využiť na hľadanie autora nového textu, o ktorom nevieme, ktorému z týchto autorov patrí.

Výhodou tohto prístupu je, že hneď vieme nájsť prípadného autora - samozrejme s určitou pravdepodobnosťou.
Nevýhodou zas je, že potrebujeme relatívne veľký počet textov o ktorých vieme, že ich napísal autor $$XY$$, na vytvorenie
modelu. V rámci jedného predmetu v ročníku na škole existuje väčšinou len jedno zadanie, takže nemáme veľmi možnosť vytvoriť
si model autora.

# Záver

V tomto blogposte som sa venoval technickým možnostiam porovnávania dvoch zdrojových kódov.
V rámci toho vznikol malý projektík na GitHube, s názvom [diffcode][32], ktorý je napísaný v Scale a po skompilovaní
by mal hneď fungovať. Implementuje dve do trochu väčšej hĺbky vysvetlené metódy porovnávania textov - levenshteinovu
vzdialenosť a kosínusovú podobnosť.

Pre praktické účely porovnávania školských zadaní však metodiky nestačia, a bude potrebné sa ešte lepšie zamyslieť nad
riešením.



[1]: https://www.scss.tcd.ie/Khurshid.Ahmad/Research/Sentiments/K_Teams_Buchraest/a7-abbasi.pdf
[2]: http://www.socsci.ru.nl/idak/teaching/batheses/MarciaFissette_scriptie.pdf
[3]: https://github.com/nachocano/stylometry
[4]: https://www.cs.drexel.edu/~ac993/papers/caliskan_deanonymizing.pdf
[5]: https://link.springer.com/chapter/10.1007/978-3-319-23036-8_10
[6]: http://www.aicbt.com/authorship-attribution/online-software/
[7]: https://github.com/evllabs/JGAAP
[8]: https://events.ccc.de/congress/2015/Fahrplan/system/event_attachments/attachments/000/002/845/original/Aylin_32C3.pdf
[9]: https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm
[10]: https://en.wikipedia.org/wiki/Edit_distance
[11]: https://en.wikipedia.org/wiki/Graph_edit_distance
[12]: https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
[13]: https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
[14]: https://en.wikipedia.org/wiki/Levenshtein_distance
[15]: https://en.wikipedia.org/wiki/Hamming_distance
[16]: https://en.wikipedia.org/wiki/Cosine_similarity
[17]: https://en.wikipedia.org/wiki/Jaccard_index
[18]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[19]: http://tree-edit-distance.dbresearch.uni-salzburg.at/
[20]: http://www.cs.uoi.gr/~pvassil/downloads/GraphDistance/LauraZager.pdf
[21]: https://en.wikipedia.org/wiki/Parse_tree
[22]: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.453.3730&rep=rep1&type=pdf
[23]: http://ieeexplore.ieee.org/document/682179/
[24]: https://www.sciencedirect.com/science/article/pii/S0167865501000228
[25]: https://dl.acm.org/citation.cfm?id=376815&picked=prox
[26]: http://barabasi.com/f/103.pdf
[27]: https://www.cs.cornell.edu/home/kleinber/auth.pdf
[28]: https://pdfs.semanticscholar.org/ee0b/cca471ecb22cc032695cfdc9668fd8931852.pdf
[29]: https://en.wikipedia.org/wiki/Whitespace_(programming_language)
[30]: https://en.wikipedia.org/wiki/Dot_product#/media/File:Dot_Product.svg
[31]: https://en.wikipedia.org/wiki/Dot_product
[32]: https://github.com/vbmacher/diffcode
[33]: https://en.wikipedia.org/wiki/Copyleft
[34]: https://stackoverflow.com/
