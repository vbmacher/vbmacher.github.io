---
title: Simulátor RAM stroja na Turingovom stroji
date: 2010-04-28 11:04 
categories: [Emulácia, Teoretická informatika]
tags: [ram, turing]
math: true
author: peterj
description: Turingov stroj simulujúci RAM stroj, aj s plagátmi na stenu.
---

V tomto článku popíšem konštrukciu emulátora pre abstraktný stroj [Random Access Machine (RAM)][ram] na abstraktnom
7-páskovom [Turingovom stroji][tm]. Načo slúžia abstraktné stroje? Túto otázku si položí asi každý, kto si niekedy túto tému
všimne. Ak chcete byť programátor a robiť web stránky, tento článok nie je vôbec pre vás. Tieto stroje ukrývajú hlbší
zmysel.

Bol to práve Turingov stroj, ktorý umožnil spoľahlivo a jednoznačne definovať pojem algoritmus (v podstate každý program
pracuje podľa nejakého algoritmu, postupu). [Turing-Churchova téza][turingchurch], sformulovaná na základe ekvivalencie
Turingových strojov a Churchovho lambda kalkulu, hlása, že všetko, čo je algoritmicky riešiteľné, je riešiteľné na
Turingovom stroji. V tomto duchu je Turingov stroj najvýkonnejší počítač na svete.  

Ak vieme napísať program pre Turingov stroj, dá sa naprogramovať aj pre iný, ľubovoľný počítač taký, ktorý je s
Turingovým strojom "kompatibilný". Turingov stroj je však abstraktný a nedá sa prakticky zostrojiť (kvôli nekonečnej páske).
Hlbší zmysel abstraktných strojov spočíva v ich teoretických vlastnostiach - jednoduchosti a technickej neobmedzenosti.
Abstraktný stroj má tak blízko k matematike, jedná sa o výpočtový model, ktorý sa dá teoreticky skúmať. Tieto stroje
sa preto používajú hlavne vo vedeckých kruhoch - jednak pri určovaní teoretickej zložitosti algoritmov, ale aj pri porovnávaní
s inými výpočtovými modelmi. 

## Výpočtová ekvivalencia abstraktných strojov

Je už dobre známe, že stroje RAM a Turingov sú [výpočtovo ekvivalentné][ramturing].
Jedným zo spôsobov dokázania výpočtovej ekvivalencie dvoch ľubovoľných abstraktných strojov `M` a `M'` je práve
vytvorenie dvoch "emulátorov" (správnejšie "simulátorov") - jeden pre stroj `M` simulujúci stroj `M'`; a druhý pre
stroj `M'` simulujúci stroj `M`. Ak sa to podarí, stroje sú ekvivalentné.
 
Ekvivalencia strojov je myslená v zmysle schopnosti počítať - ak je stroj `M` schopný počítať určitú skupinu vecí,
a na stroji `M'` ho vieme nasimulovať, potom aj `M'` musí vedieť počítať minimálne tú istú skupinu vecí (ak nie viac).
Ak však stroj `M'` nasimulujeme na stroji `M`, tak stroj `M` musí vedieť minimálne to isté ako `M'`. Keďže oba stroje
vedia minimálne to čo ten druhý, to znamená, že žiaden nevie viac ako ten druhý. Vedia teda počítať rovnako, sú si ekvivalentné.

## Popis našich strojov

Pre zvýšenie jednoduchosti a efektivity na emuláciu RAM stroja použijem 7-páskový Turingov stroj (ktorý
je rozšírením klasického 1-páskového a sú [výpočtovo ekvivalentné][turingequiv].

Na nasledujúcom obrázku je znázornená schéma k-páskového [Turingovho stroja][tm]:

![turingscheme](/assets/img/simulator-ram/turing.png)

A na tomto obrázku je schéma [RAM stroja][ram]:
 
![ramscheme](/assets/img/simulator-ram/ram.png)


Simulátor musí obsahovať digitálnu napodobeninu architektúry simulovaného systému, na ktorej sa dá simulovať
jeho originálne správanie. Ak by sme napodobovali reálny počítač, hovorili by sme o emulátore. Emulátor má navyše jeden
stupeň voľnosti - a to v presnosti - teda miere, akou túto architektúru a jej správanie napodobníme. Simulátor nemá 
voliteľnú presnosť, tá musí byť na sto percent.

## Architektúra simulátora

Architektúra RAM stroja zahŕňa vstupnú a výstupnú pásku, pamäť programu a pamäť dát (známu ako "registre").
Napodobniť túto architektúru znamená nájsť vhodnú formu a interpretáciu (kódovanie) komponentov RAM stroja na stroj,
kde bude simulátor bežať. Komponenty architektúry RAM stroja sú jeho pásky a pamäte. Každú pásku
RAM stroja, ako aj pamäť programu a dát môžme na Turingovom stroji reprezentovať samostatnými
páskami. Zatiaľ teda potrebujeme 4 pásky.

Páska reprezentujúca *pamäť programu* - `P` - bude mať tvar `$IO#IO#...B`.
Symbol `I` reprezentuje zakódovanú inštrukciu RAM stroja, symbol `O` jej operand. Symbol `$` indikuje začiatok
programu (resp. pásky) a symboly `#` sú separátory inštrukcií. Tieto symboly budú hrať úlohu separátorov takmer na
každej páske.

Nasledujúca tabuľka ukazuje kódovanie inštrukcií. Posledný stĺpec tabuľky zatiaľ ignorujme. 


| Inštrukcia RAM | Kód (symbol na páske) | Možné operandy  | Stav (procedúra) |
| -------------- | --------------------- | --------------- | ---------------- |
| `HALT`         | `H`                   |                 | $$q_3$$          |
| `READ`         | `R`                   | `i`, `*i`       | $$q_4$$          |
| `WRITE`        | `W`                   | `=i`, `i`, `*i` | $$q_5$$          |
| `LOAD`         | `L`                   | `=i`, `i`, `*i` | $$q_6$$          |
| `STORE`        | `S`                   | `i`, `*i`       | $$q_7$$          |
| `ADD`          | `A`                   | `=i`, `i`, `*i` | $$q_8$$          |
| `SUB`          | `X`                   | `=i`, `i`, `*i` | $$q_9$$          |
| `DIV`          | `D`                   | `=i`, `i`, `*i` | $$q_{10}$$       |
| `MUL`          | `M`                   | `=i`, `i`, `*i` | $$q_{11}$$       |
| `JZ`           | `P`                   | `i`             | $$q_{12}$$       |
| `JMP`          | `J`                   | `i`             | $$q_{13}$$       |


Symboly `i` v možných operandoch reprezentujú celé a kladné číselné konštanty. Tieto číselné konštanty budú na
páskach reprezentované ako reťazce symbolov `1` pre čísla *väčšie* ako 0 (napr. číslo 3 bude zakódované ako reťazec `111`),
resp. symbolom `0` ak sa číslo *rovná* 0. Záporné, ani desatinné čísla nebudem pre jednoduchosť uvažovať.

*Pamäť dát* `S`, uložená na ďalšej páske, bude uchovávať aktuálne hodnoty registrov RAM stroja. Má tvar
`$#a:v#a:v#...B`. Symbol `a` je číselná konštanta označujúca číslo registra (resp. *adresu*) a symbol `v` jeho *hodnotu*.
Na začiatku je táto páska prázdna, a postupne (počas simulácie) sa bude napĺňať.
 
Registre, ktoré nebudú na páske uložené, majú implicitnú hodnotu 0. Môže sa stať, že na páske sa objaví niekoľko hodnôt
pre ten istý register. Potom platí, že platná hodnota daného registra je tá najpravejšia ("posledná"). Na páske sa bude
uchovávať história zmien jednotlivých registrov v priebehu výpočtu programu.

Tvar *vstupnej* pásky `I` bude `#i#i#...#B`, kde symboly `i` reprezentujú číselné konštanty a v tomto prípade symboly
`#` sú terminátormi. Vstupná páska bude obsahovať minimálne jeden symbol `#`.

Tvar *výstupnej* pásky `O` bude `#i#i...B`. Význam jednotlivých symbolov je už dobre známy. Na začiatku musí byť výstupná
páska prázdna.


Simulátor inštrukcií však bude potrebovať ďalšie 3 pomocné pásky, ktoré budú využívané počas simulácie.
Označím ich ako `A`, `V` a `T`. Pásky `A` (pomocná páska pre ukladanie adries alebo čísel registrov) a `V` (pomocná
páska pre ukladanie hodnôt registrov, a zároveň pomocná páska pre aritmetické inštrukcie) majú rovnaký tvar:
`#i#i#...B`.

Pásku `T` budú používať inštrukcie `MUL` a `DIV` a tiež bude slúžiť na uloženie návratovej adresy z procedúr.
Jej tvar bude `$i#i...#i#nB`, kde význam symbolov `#`, `$` a `i` je jasný. Zavedením návratovej adresy (symbol `n`)
budem môcť vytvoriť *procedúry*, tj. súvisiace množiny inštrukcií, ktoré vykonávajú jednu algoritmickú úlohu.
Podľa hodnoty symbolu `n` budú procedúry na konci vedieť, ktorý stav majú aktivovať ako nasledujúci.

Architektúra simulátora teda predstavuje 7 komponentov, a síce 7 pások Turingovho stroja. Určite však nejde o
minimalizovanú verziu, ale to nebol účel. Podľa horeuvedených symbolov bude čitateľ schopný poskladať vstupnú
celú abecedu simulátora.

## Simulátor inštrukcií

Úlohou simulátora je napodobniť funkciu systému alebo modelu. V našom prípade pôjde o napodobnenie správania sa
inštrukcií. Postup tvorby simulátora je:

1. Vytvoriť dekodér inštrukcií (hlavnú procedúru), ktorý bude čítať a rozoznávať inštrukcie z pásky `P` (v cykle).
   Cyklus sa zastaví (čiže aj celý simulátor sa zastaví), ak dekodér narazí na inštrukciu `HALT` (stav $$q_3$$).
   V tomto prípade simulátor *akceptuje* program, ktorý simulovaný RAM stroj vykoná. Pre syntakticky nesprávny vstup
   v programe nebude mať stroj definované žiadne stavy, čím sa dosiahne *neakceptovanie* programu simulátorom.
2. Vytvoriť procedúry pre jednotlivé inštrukcie, ktorých činnosť definuje sémantika inštrukcií RAM stroja. Po ukončení
   inštrukcie sa znova aktivuje stav pre dekódovanie nasledujúcej inštrukcie.
3. Vytvoriť pomocné procedúry, ktoré jednotlivé inštrukcie využívajú. Treba však uvážiť, ktoré pomocné činnosti by bolo
   vhodné implementovať ako procedúry. Rozhodujúcim faktorom je potenciálny počet ich volaní.

Funkcia hlavnej procedúry (vrátane dekodéra) je na nasledujúcom obrázku:

![ramstates](/assets/img/simulator-ram/ram_states.png)

Funkciu dekodéra preberá stav $$q_2$$. Označenia $$s_1$$ až $$s_{13}$$ predstavujú stav všetkých pások pred prechodom a
po prechode z jedného do druhého stavu.

Stavy $$q_3$$ až $$q_{13}$$ predstavujú volania procedúr jednotlivých inštrukcií. Mapovanie stavov na inštrukcie je
uvedené v poslednom stĺpci tabuľky v predchádzajúcej časti.

Ako je možné vidieť z grafu, zo stavu $$q_2$$ sa môžme dostať do niektorého stavu začínajúceho realizáciu danej
inštrukcie. Pripomína to vetvenie, ktorého konštrukcia je naozaj *bežná* v klasických programovacích jazykoch, ako
je napr. jazyk C, či Java (príkaz `switch`). A práve takýmto spôsobom funguje základná technika emulácie, nazvaná
*interpretácia*.

## Abeceda a jazyk

Pásky Turingovho stroja sa skladajú z nekonečnej postupnosti buniek, zľava ohraničených. Symboly týchto
pások sú definované nad abecedou pásky $$\Gamma$$. Vstupné symboly (ktoré Turingov stroj chápe ako vstup
do algoritmu, ktorý implementuje), sú podmnožinou abecedy vstupnej pásky, a označujeme ich gréckym symbolom $$\Sigma$$.
Množinu všetkých možných (predpísaných) kombinácií týchto symbolov nazývame jazyk stroja. 

Abecedy pások pre náš simulátor sú:

$$
\begin{eqnarray} 
\Sigma & = & \{R,W,L,S,A,X,M,D,J,P,H,=,*,1,0\} \\
\Gamma & = & \Sigma \cup \{ \$,\#,:,B,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l\}
\end{eqnarray} 
$$

Niektoré zo vstupných symbolov reprezentujú označenia inštrukcií RAM stroja,
toto mapovanie je uvedené v tabuľke v predchádzajúcej časti. Ostatné symboly majú nasledujúci význam:

| Symbol       | Popis                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **B**        | Prázdny symbol (**B**lank)                                                                         |
| `111...1`    | Celé číslo väčšie ako 0                                                                            |
| `0`          | Číslo 0                                                                                            |
| `=`          | Označenie priameho operandu                                                                        |
| `$`          | Označenie začiatku programovej pásky                                                               |
| `#`          | Označenie začiatku vstupnej pásky. Tiež slúži ako oddeľovač (separátor) viacerých údajov na páske. |
| `:`          | Oddeľovač adresy a hodnoty registra na páske registrov                                             |
| `2-9`; `a-l` | Pomocné symboly reprezentujúce návratovú adresu z procedúry                                        |

## Stavy stroja

Program Turingovho stroja obsahuje 116 stavov. Počiatočný stav má označenie $$q_0$$. Stavy hlavnej procedúry majú
označenia $$q_1$$, $$q_2$$. Ďalšie stavy v rovnakom tvare, tj. $$q_i$$, reprezentujú myslené procedúry jednotlivých
inštrukcií, resp. ide o pomocné procedúry. Mapovanie inštrukcií RAM stroja na tieto procedúry
(teda príslušné stavy programu Turingovho stroja) je uvedené v tabuľke v časti "Architektúra simulátora" (vyššie).

Každý stav v tvare $$q_{m-n}$$ (kde $$m$$ a $$n$$ sú celé čísla) patrí procedúre, ktorej začiatočný stav je $$q_m$$.

## Kód a testovanie simulátora

Kód simulátora je napísaný pre [tento simulátor Turingovho stroja][simulator].
Súbor s programom simulátora (napr. `ram_sim.txt`) musí obsahovať tieto časti:

```
#TURING MACHINES FILE#

#LANGUAGE#
//finite set of language characters
RWLSAXMDJPH$#=*:10B23456789abcdefghijkl

#INITIAL STATE#
q0

#TAPE0#
//PROGRAM (P)
$L=111111#D=11#W0#HBB

#TAPE1#
//INPUT (I)
#111110#BBBBBBBBB

#TAPE2#
//OUTPUT (O)
BBBBBBBBBBBBBBBBB

#TAPE3#
//STORAGE (S)
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

#TAPE4#
//ADRESSES (A)
BBBBBBBBBBBBBBBBBBBBBBBBBBBB

#TAPE5#
//VALUES (V)
BBBBBBBBBBBBBBBBBBBBBBBBBBBBB

#TAPE6#
//TEMP (T)
BBBBBBBBBBBBBBBBBBBBBBBBBBBBB

#CODE#
 ... kód z nasledujúcej časti ...
```

Páska č.0 (programová) v uvedenej štruktúre obsahuje ako ukážku program, ktorý vydelí číslo 6 číslom 2 a výsledok
vypíše na výstupnú pásku.

Význam jednotlivých symbolov je v nasledujúcej tabuľke:

| Symbol(y)  | Význam    |
| ---------- | --------- |
| `L=111111` | `LOAD =6` |
| `D=11`     | `DIV =2`  |
| `W0`       | `WRITE 0` |
| `H`        | `HALT`    |

Nasleduje kód samotného simulátora (pokračovanie vstupného súboru pod časťou `#CODE#`). Každá inštrukcia Turingovho
stroja je uvedená na samostatnom riadku. Tvar inštrukcie je:

$$(p, (P_1,I_1,O_1,S_1,A_1,V_1,T_1)) (q, (P_2,I_2,O_2,S_2,A_2,V_2,T_2), (D_P, D_I, D_O, D_S, D_A, D_V, D_T))$$

kde $$p$$ je stav, v ktorom sa má stroj nachádzať, aby sa mohla vykonať inštrukcia, a $$q$$ je stav, do ktorého sa
stroj dostane po vykonaní inštrukcie.

Symboly $$P_1, I_1, \ldots, T_1$$ predstavujú symboly na jednotlivých páskach stroja (v presnom poradí), ktoré musia
na páskach byť, aby sa mohla daná inštrukcia vykonať. Stav a symboly pások sú teda indikátormi, či sa daná inštrukcia
vykoná. Stroj je deterministický.

Symboly $$P_2, I_2, \ldots, T_2$$ sú symboly, ktoré prepíšu pôvodné symboly na jednotlivých páskach po vykonaní
danej inštrukcie.

Symboly $$D_P, D_I, \ldots, D_T$$ označujú pohyb hláv na jednotlivých páskach stroja. Každý symbol je množina troch
prvkov: $$\{r, l, s\}$$, kde $$r$$ znamená pohyb o jeden symbol doprava, $$l$$ o jeden symbol doľava a $$s$$ žiadny pohyb.

Celý kód samotného simulátora si môžte stiahnuť [ako gist][code].

## Veľký plagát - diagram stavov

Na záver uvádzam kompletný farebný a čiernobiely diagram, na ktorom sa nachádzajú všetky stavy a prechody
použitého Turingovho stroja. V podstate ide o vizualizáciu kódu nášho simulátora, uvedeného v predchádzajúcej časti.
Diagram je dosť veľký, môžte si ho vytlačiť a napríklad nalepiť na stenu ako plagát.

- [Farebný diagram](/assets/img/simulator-ram/RAM_simulator-color.pdf){:target="_blank"}
- [Čiernobiely diagram](/assets/img/simulator-ram/RAM_simulator.pdf){:target="_blank"}


[ram]: https://en.wikipedia.org/wiki/Random-access_machine
[tm]: https://en.wikipedia.org/wiki/Multitape_Turing_machine
[turingchurch]: https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis
[ramturing]: https://www.ems-ph.org/journals/show_pdf.php?issn=0034-5318&vol=13&iss=2&rank=5
[turingequiv]: http://ce.sharif.edu/courses/94-95/1/ce414-2/resources/root/Text%20Books/Automata/John%20E.%20Hopcroft,%20Rajeev%20Motwani,%20Jeffrey%20D.%20Ullman-Introduction%20to%20Automata%20Theory,%20Languages,%20and%20Computations-Prentice%20Hall%20(2006).pdf
[simulator]: http://tms.pierreq.com/
[code]: https://gist.github.com/vbmacher/b443b1fa28bacca964b18ecc1e7a962f
