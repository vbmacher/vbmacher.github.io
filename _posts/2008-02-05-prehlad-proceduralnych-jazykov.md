---
layout: post
title: Prehľad historických procedurálnych jazykov
date: 2008-02-05 14:00:00
categories: [Kompilátory]
tags: [algol,c,pascal,cobol,basic]
---

V tomto článku trochu bližšie popíšem niektoré staršie, ale aj novšie (alebo teda v súčasnosti dosť
využívané) programovacie jazyky, ktoré sú predstaviteľmi procedurálnej paradigmy.

## ALGOL

ALGOL bol navrhnutý počítačovými vedcami z Európy a Ameriky na zasadnutí v roku 1958 na
[ETH Zurich](http://www.ethz.ch/). Tento jazyk používali väčšinou výskumníci a vedci. Jeho obmedzené
použitie v komerčnej sfére bolo spôsobené absenciou štandardizácie vstupu/výstupu v jeho popise a nie
prílišný záujem o tento jazyk. Algol 60 sa však stal štandardom pre publikácie o algoritmoch.
[John Backus](http://en.wikipedia.org/wiki/John_Backus) napísal syntax tohto jazyka v jeho novej
notácii, ktorú vymysel s názvom Backusova normálna forma, ktorú neskôr rozšíril
[Peter Naur](http://en.wikipedia.org/wiki/Peter_Naur). Táto forma sa začala nazývať
[Backus-Naurova forma (BNF)](http://en.wikipedia.org/wiki/Backus-Naur_form) zápisu syntaxe jazyka
(teda pravidiel gramatiky) a v súčasnosti sa veľmi často používa, hlavne jej variant
EBNF (Extended Bacus-Naur Form).

Keďže vstup/výstup ALGOL-u nebol štandardizovaný, neexistuje portabilná verzia klasického programu
"hello world!". Nasledujúci príklad ukazuje tento program v jazyku ALGOL 60 pre počítač Unisys-A
series:

```
BEGIN
  FILE F(KIND=REMOTE);
  EBCDIC ARRAY E[0:11];
  REPLACE E BY "HELLO WORLD!";
  WRITE(F, *, E);
END.
```

## BASIC

Akronym *BASIC* znamená "Beginner's All-purpose Symbolic Instruction Code" a ide o rodinu jazykov vyššej
úrovne. Prvý BASIC bol vytvorený v roku 1963. Autori boli: [John George Kemeny](http://en.wikipedia.org/wiki/John_George_Kemeny)
a [Thomas Eugene Kurtz](http://en.wikipedia.org/wiki/Thomas_Eugene_Kurtz) na
[Dartmouth College, New Hampshire, USA](http://www.dartmouth.edu/). Tento jazyk vytvorili, aby umožnili
aj študentom a ne-vedcom bližšie sa zoznámiť s počítačmi a ich možnosťami. Jazyk sa stal veľmi
populárny a široko používaný na mikropočítačoch v neskorých 1970-tych rokoch
(napr. [MITS Altair 8800](http://en.wikipedia.org/wiki/Altair_8800)) a v domácich počítačoch v 80-tych
rokoch. BASIC ostáva populárny až dodnes a je základom pre značne modifikované dialekty a nové jazyky,
ako napr. [Microsoft Visual Basic](http://en.wikipedia.org/wiki/Visual_Basic). Existuje asi okolo 250
rôznych [dialektov BASICU](http://en.wikipedia.org/wiki/List_of_BASIC_dialects).

Klasický program "Hello, world!" v BASICu vyzerá asi takto:

```
10 PRINT "Hello, world !"
```

## COBOL

Ide o jeden z najstarších jazykov, ktoré sa dodnes aktívne využívajú. Jazyk vznikol v roku 1959.
Vytvorila ho skupina "The Short Range Committee", jednou z troch skupín zo zasadnutia v Pentagone 28.
a 29. mája 1959, presne rok po Zürich-skom zasadnutí pre ALGOL 58.

COBOL je akronym  "**CO**mmon **B**usiness-**O**riented **L**anguage". Jeho hlavná doména je obchod,
finančníctvo a administratívne systémy pre spoločnosti a vládu. Štandard z roku 2002 zahŕňa podporu
aj pre objektovo-orientované programovanie a iné vylepšenia.

Existovala veľká kritika jeho syntaxe, hlavne že rozsiahla dĺžka príkazov spôsobuje záťaž pre
rozmýšľanie nad tým, čo má program robiť. [Edsger Dijkstra](http://en.wikipedia.org/wiki/Edsger_Dijkstra)
sa dokonca vyjadril, že: *"Použitie COBOLu otupuje myseľ; jeho výučba by sa mala preto pokladať za
trestný čin"*. Obranou bolo vyjadrenie, že kto kritizuje COBOL, určite v ňom nikdy neprogramoval a
často si ho chybne vysvetľuje. Jeho špecifikácia bola neskôr aj tak revidovaná.

Napríklad kód v COBOL-e pre výpočet koreňa kvadratickej rovnice `a*x^2 + b*x + c`
môže vyzerať takto:

```
COMPUTE X = (-B + (B ** 2 - (4 * A * C)) ** .5) / (2 * A)
```

alebo aj takto:

```
MULTIPLY B BY B GIVING B-SQUARED.  
MULTIPLY 4 BY A GIVING FOUR-A.  
MULTIPLY FOUR-A BY C GIVING FOUR-A-C.  
SUBTRACT FOUR-A-C FROM B-SQUARED GIVING RESULT-1.  
COMPUTE RESULT-2 = RESULT-1 ** .5.
SUBTRACT B FROM RESULT-2 GIVING NUMERATOR.
MULTIPLY 2 BY A GIVING DENOMINATOR.
DIVIDE NUMERATOR BY DENOMINATOR GIVING X.
```

Na prvý pohľad to vyzerá dosť zložito. Ktorú formu použiť, závisí od štýlu programovania.
V niektorých prípadoch menej exaktný zápis môže byť ľahšie pochopiteľný:

```
ADD YEARS TO AGE.
MULTIPLY PRICE BY QUANTITY GIVING COST.
SUBTRACT DISCOUNT FROM COST GIVING FINAL-COST.
```

a posledná vec: "Hello, world!"

```
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
MAIN.
    DISPLAY 'Hello, world.'.
    STOP RUN.
```

## Jazyk C

Tento jazyk je azda najpopulárnejší jazyk vôbec a každý "skutočný" programátor by ho mal podľa
môjho názoru poznať. História vývoja jazyka C začína v období rokov 1969 až 1973 a súvisí s vývojom
operačného systému [Unix](http://en.wikipedia.org/wiki/Unix)

Pre implementáciu systému chceli použiť jazyk dostatočne efektívny z pohľadu strojového kódu a zároveň
nezávislý na konkrétnom procesore (čo bolo vtedy dosť protichodné). Ako vylepšenie jazyka
[BCPL](http://en.wikipedia.org/wiki/BCPL) (o ktorom rozmýšľali, že bude implementačným jazykom Unixu)
navrhol Ken Thompson jeho vatiant s názvom [B](http://en.wikipedia.org/wiki/B_%28programming_language%29) (1970).
Aj keď jazyk mal dobré kompilačné vlastnosti, nebol dostatočne univerzálny. Preto sa nakoniec rozhodol
[Dennis Ritchie](http://en.wikipedia.org/wiki/Dennis_Ritchie) vytvoriť nový jazyk, ktorý by spĺňal obe
požiadavky. Vychádzal pritom z Thompsonovho jazyka "B" a podľa oficiálnych zdrojov dostal preto
pomenovanie "C" ako jeho "nasledovník".

C je jazykom strednej úrovne (teda ani nízkoúrovňový ale ani celkom vysko úrovňový) a používa sa hlavne
v oblasti (a dnes čoraz viac len) na systémové programovanie (operačné systémy, ovládače,
real-time aplikácie, emulátory, ale aj programovacie jazyky, ...)

V knihe [The C programming language](http://en.wikipedia.org/wiki/The_C_Programming_Language_(book))
od Briana Kernighana a Dennisa Ritchie-ho (prvý "manuál" k jazyku) bol najzaujímavejší program typu
"Hello, world !", ktorý sa odvtedy začal s obľubou používať pri popise aj iných jazykov.
Takže "Hello, world !" v C:

```c
#include <stdio.h>

int main(void)
{
    printf("Hello, world !\n");
    return 0;
}
```

## Pascal

Ide o jeden z najznámeších jazykov, ktorý sa hojne vyučuje na školách aj dodnes. V súčasnosti sa
čistý Pascal už ani tak nevyužíva, skôr jeho odvodená objektová verzia Delphi.

Jazyk Pascal vytvoril v roku 1970 [N. Wirth](http://en.wikipedia.org/wiki/Niklaus_Wirth) ako malý,
efektívny jazyk, ktorý by mal "povzbudzovať" programátorov používaniu správnych programovacích praktík,
tzv. štruktúrnemu programovaniu.

Jazyk vychádza z jazyka `Algol 60` a pomenovanie dostal podľa francúzskeho matematika a filozofa
[B. Pascala](http://en.wikipedia.org/wiki/Blaise_Pascal).

Wirthov cieľ bol vytvoriť efektívny jazyk založený na tzv. štruktúrovanom programovaní. Ako som už
spomenul, vychádza z jazyka Algol, kde uvádza nové mechanizmy, ako si mohol programátor vytvoriť jeho
vlastné zložitejšie dátové štruktúry. Rovnako tak uľahčil tvorbu dynamických a rekurzívnych dátových
štruktúr ako napríklad zoznamy, stromy alebo grafy.

Jazyk obsahuje dátové štruktúry ako napr. záznamy (`record`), výčtové typy (`type`), množiny (`set`),
dynamicky alokované premenné so smerníkmi, polia s rôzne definovaným rozmedzím.

Jazyk má prísnu typovú kontrolu, implicitná konverzia nie je vôbec možná.

Umožňuje (narozdiel od rodiny C jazykov) vnorené definície procedúr do ľubovoľnej hĺbky a tiež takmer
ľubovoľné definície a deklarácie vo vnútri tela procedúr.

Tieto aspekty umožnili vytvoriť veľmi jednoduchú a koherentnú syntax, kde kompletný program sa
syntakticky veľmi podobá jedinej procedúre.

Príklad programu:

```pascal
program Hello;

begin
    writeln("Hello, world !");
end.
```

# Záver

V tomto článku som spravil prehľad snáď tych úplne najznámejších historických procedurálnych programovacích
jazykov. Hovorím procedurálnych, pretože historicky sú známe aj objektovo-orientované jazyky (napr. Smalltalk),
alebo viac funkcionálne jazyky (napr. Lisp).
