---
layout: post
title: Simulátor RAM stroja na Turingovom stroji
date: 2010-04-28 11:04 
categories: [Emulácia]
tags: RAM, turing, teória
mathjax: true
---

V tomto článku popíšem konštrukciu emulátora pre abstraktný stroj [Random Access Machine (RAM)][ram] na abstraktnom
7-páskovom [Turingovom stroji][tm]. Načo slúžia abstraktné stroje? Túto otázku si položí asi každý, kto si niekedy túto tému
všimne. Ak chcete byť programátor a robiť web stránky, tento článok nie je vôbec pre vás. Tieto stroje ukrývajú hlbší
zmysel.





* content
{:toc}

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

![turingscheme]({{ "/images/simulator-ram/turing.png" | absolute_url }})

A na tomto obrázku je schéma [RAM stroja][ram]:
 
![ramscheme]({{ "/images/simulator-ram/ram.png" | absolute_url }})


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


| Inštrukcia RAM | Kód (symbol na páske) | Možné operandy   | Stav (procedúra) |
|----------------|-----------------------|------------------|------------------|
| `HALT`         | `H`                   |                  | $$q_3$$          |
| `READ`         | `R`                   | `i`, `*i`        | $$q_4$$          |
| `WRITE`        | `W`                   | `=i`, `i`, `*i`  | $$q_5$$          |
| `LOAD`         | `L`                   | `=i`, `i`, `*i`  | $$q_6$$          |
| `STORE`        | `S`                   | `i`, `*i`        | $$q_7$$          |
| `ADD`          | `A`                   | `=i`, `i`, `*i`  | $$q_8$$          |
| `SUB`          | `X`                   | `=i`, `i`, `*i`  | $$q_9$$          |
| `DIV`          | `D`                   | `=i`, `i`, `*i`  | $$q_{10}$$         |
| `MUL`          | `M`                   | `=i`, `i`, `*i`  | $$q_{11}$$         |
| `JZ`           | `P`                   | `i`              | $$q_{12}$$         |
| `JMP`          | `J`                   | `i`              | $$q_{13}$$         |


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

![ramstates]({{ "/images/simulator-ram/ram_states.png" | absolute_url }})

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

| Symbol         | Popis                       |
|----------------|-----------------------------|
| **B**          | Prázdny symbol (**B**lank)  |
| `111...1`      | Celé číslo väčšie ako 0     |
| `0`            | Číslo 0                     |
| `=`            | Označenie priameho operandu |
| `$`            | Označenie začiatku programovej pásky |
| `#`            | Označenie začiatku vstupnej pásky. Tiež slúži ako oddeľovač (separátor) viacerých údajov na páske. |
| `:`            | Oddeľovač adresy a hodnoty registra na páske registrov |
| `2-9`; `a-l`   | Pomocné symboly reprezentujúce návratovú adresu z procedúry |

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

| Symbol(y)      | Význam     |
|----------------|------------|
| `L=111111`     | `LOAD =6`  |
| `D=11`         | `DIV =2`   |
| `W0`           | `WRITE 0`  |
| `H`            | `HALT`     |

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

Teraz už len samotný kód simulátora:

```
(q0, ($,#,B,B,B,B,B)) (q1, ($,#,B,$,#,#,$), (s,s,s,r,r,r,r))

(q1, ($,#,B,B,B,B,B)) (q2, ($,#,B,B,B,B,B), (r,s,s,s,s,s,s))

// vetvenie - hlavná procedúra
(q2, (H,#,B,B,B,B,B)) (q3, (H,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (R,#,B,B,B,B,B)) (q4, (R,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (W,#,B,B,B,B,B)) (q5, (W,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (L,#,B,B,B,B,B)) (q6, (L,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q2, (S,#,B,B,B,B,B)) (q7, (S,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (A,#,B,B,B,B,B)) (q8, (A,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (X,#,B,B,B,B,B)) (q9, (X,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (D,#,B,B,B,B,B)) (q10, (D,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q2, (M,#,B,B,B,B,B)) (q11, (M,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (P,#,B,B,B,B,B)) (q12, (P,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q2, (J,#,B,B,B,B,B)) (q13, (J,#,B,B,B,B,B), (r,s,s,s,s,s,s))

// READ
(q4, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,2), (r,s,s,s,s,s,r))
(q4, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,h), (s,s,s,s,s,s,r))
(q4, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,h), (s,s,s,s,s,s,r))
(q4-1, (#,#,B,B,B,#,B)) (q15, (#,#,B,B,B,B,9), (s,s,s,s,s,l,r))
(q4-2, (#,1,B,B,B,B,B)) (q4-2, (#,1,B,B,B,1,B), (s,r,s,s,s,r,s))
(q4-2, (#,0,B,B,B,B,B)) (q4-2, (#,0,B,B,B,0,B), (s,r,s,s,s,r,s))
(q4-2, (#,#,B,B,B,B,B)) (q16, (#,#,B,B,B,#,B), (s,s,s,s,s,r,s))

// WRITE
(q5, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,4), (r,s,s,s,s,s,r))
(q5, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q5, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q5, (=,#,B,B,B,B,B)) (q5-1, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q5-1, (1,#,B,B,B,B,B)) (q5-1, (1,#,1,B,B,B,B), (r,s,r,s,s,s,s))
(q5-1, (0,#,B,B,B,B,B)) (q5-1, (0,#,0,B,B,B,B), (r,s,r,s,s,s,s))
(q5-1, (#,#,B,B,B,B,B)) (q2, (#,#,#,B,B,B,B), (r,s,r,s,s,s,s))
(q5-2, (#,#,B,B,B,#,B)) (q5-3, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q5-3, (#,#,B,B,B,1,B)) (q5-3, (#,#,1,B,B,B,B), (s,s,r,s,s,l,s))
(q5-3, (#,#,B,B,B,0,B)) (q5-3, (#,#,0,B,B,B,B), (s,s,r,s,s,l,s))
(q5-3, (#,#,B,B,B,#,B)) (q2, (#,#,#,B,B,#,B), (r,s,r,s,s,r,s))
(q5-4, (#,#,B,B,B,#,B)) (q15, (#,#,B,B,B,B,2), (s,s,s,s,s,l,r))

// LOAD
(q6, (L,#,B,B,B,B,B)) (q6-1, (L,#,B,B,0,B,B), (r,s,s,s,r,s,s))
(q6-1, (=,#,B,B,B,B,B)) (q19, (=,#,B,B,#,B,8), (r,s,s,s,r,s,r))
(q6-1, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,#,B,5), (s,s,s,s,r,s,r))
(q6-1, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,#,B,5), (s,s,s,s,r,s,r))
(q6-1, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,#,B,6), (r,s,s,s,r,s,r))

// STORE
(q7, (1,#,B,B,B,B,B)) (q7, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q7, (0,#,B,B,B,B,B)) (q7, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q7, (=,#,B,B,B,B,B)) (q7, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q7, (*,#,B,B,B,B,B)) (q7, (*,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q7, (#,#,B,B,B,B,B)) (q7-1, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q7-1, (#,#,B,B,B,B,B)) (q17, (#,#,B,B,#,B,6), (s,s,s,s,r,s,r))
(q7-2, (1,#,B,B,B,B,B)) (q7-2, (1,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q7-2, (0,#,B,B,B,B,B)) (q7-2, (0,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q7-2, (*,#,B,B,B,B,B)) (q7-2, (*,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q7-2, (S,#,B,B,B,B,B)) (q7-3, (S,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q7-3, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,8), (r,s,s,s,s,s,r))
(q7-3, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,7), (s,s,s,s,s,s,r))
(q7-3, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,7), (s,s,s,s,s,s,r))

// ADD
(q8, (1,#,B,B,B,B,B)) (q8, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q8, (0,#,B,B,B,B,B)) (q8, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q8, (=,#,B,B,B,B,B)) (q8, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q8, (*,#,B,B,B,B,B)) (q8, (*,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q8, (#,#,B,B,B,B,B)) (q8-1, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q8-1, (#,#,B,B,B,B,B)) (q17, (#,#,B,B,#,B,9), (s,s,s,s,r,s,r))
(q8-2, (1,#,B,B,B,B,B)) (q8-2, (1,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q8-2, (0,#,B,B,B,B,B)) (q8-2, (0,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q8-2, (=,#,B,B,B,B,B)) (q8-2, (=,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q8-2, (*,#,B,B,B,B,B)) (q8-2, (*,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q8-2, (A,#,B,B,B,B,B)) (q8-3, (A,#,B,B,#,B,B), (r,s,s,s,r,s,s))
(q8-3, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,9), (s,s,s,s,s,s,r))
(q8-3, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,9), (s,s,s,s,s,s,r))
(q8-3, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,a), (r,s,s,s,s,s,r))
(q8-3, (=,#,B,B,B,B,B)) (q19, (=,#,B,B,B,B,4), (r,s,s,s,s,s,r))

// SUB
(q9, (1,#,B,B,B,B,B)) (q9, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q9, (0,#,B,B,B,B,B)) (q9, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q9, (=,#,B,B,B,B,B)) (q9, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q9, (*,#,B,B,B,B,B)) (q9, (*,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q9, (#,#,B,B,B,B,B)) (q9-1, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q9-1, (#,#,B,B,B,B,B)) (q17, (#,#,B,B,#,B,c), (s,s,s,s,r,s,r))
(q9-2, (1,#,B,B,B,B,B)) (q9-2, (1,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q9-2, (0,#,B,B,B,B,B)) (q9-2, (0,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q9-2, (=,#,B,B,B,B,B)) (q9-2, (=,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q9-2, (*,#,B,B,B,B,B)) (q9-2, (*,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q9-2, (X,#,B,B,B,B,B)) (q9-3, (X,#,B,B,#,B,B), (r,s,s,s,r,s,s))
(q9-3, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,b), (s,s,s,s,s,s,r))
(q9-3, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,b), (s,s,s,s,s,s,r))
(q9-3, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,c), (r,s,s,s,s,s,r))
(q9-3, (=,#,B,B,B,B,B)) (q19, (=,#,B,B,B,B,5), (r,s,s,s,s,s,r))

// DIV
(q10, (D,#,B,B,B,B,B)) (q10-1, (D,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q10-1, (D,#,B,B,B,B,B)) (q10-21, (D,#,B,B,#,B,B), (r,s,s,s,r,s,s))
(q10-21, (1,#,B,B,B,B,B)) (q10-21, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q10-21, (0,#,B,B,B,B,B)) (q10-21, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q10-21, (*,#,B,B,B,B,B)) (q10-21, (*,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q10-21, (=,#,B,B,B,B,B)) (q10-21, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q10-21, (#,#,B,B,B,B,B)) (q17, (#,#,B,B,B,B,i), (s,s,s,s,s,s,r))
(q10-2, (1,#,B,B,B,#,B)) (q10-2, (1,#,B,B,B,#,B), (l,s,s,s,s,s,s))
(q10-2, (0,#,B,B,B,#,B)) (q10-2, (0,#,B,B,B,#,B), (l,s,s,s,s,s,s))
(q10-2, (=,#,B,B,B,#,B)) (q10-2, (=,#,B,B,B,#,B), (l,s,s,s,s,s,s))
(q10-2, (*,#,B,B,B,#,B)) (q10-2, (*,#,B,B,B,#,B), (l,s,s,s,s,s,s))
(q10-2, (D,#,B,B,B,#,B)) (q10-3, (D,#,B,B,B,#,B), (s,s,s,s,s,l,s))
(q10-3, (D,#,B,B,B,1,B)) (q10-5, (D,#,B,B,B,1,B), (r,s,s,s,s,r,s))
(q10-3, (D,#,B,B,B,0,B)) (q10-4, (D,#,B,B,B,0,B), (r,s,s,s,s,r,s))
(q10-4, (1,#,B,B,B,#,B)) (q10-4, (1,#,B,B,B,#,B), (r,s,s,s,s,s,s))
(q10-4, (0,#,B,B,B,#,B)) (q10-4, (0,#,B,B,B,#,B), (r,s,s,s,s,s,s))
(q10-4, (=,#,B,B,B,#,B)) (q10-4, (=,#,B,B,B,#,B), (r,s,s,s,s,s,s))
(q10-4, (*,#,B,B,B,#,B)) (q10-4, (*,#,B,B,B,#,B), (r,s,s,s,s,s,s))
(q10-4, (#,#,B,B,B,#,B)) (q18, (#,#,B,B,B,#,6), (s,s,s,s,s,r,r))
(q10-5, (*,#,B,B,B,#,B)) (q14, (*,#,B,B,B,#,g), (r,s,s,s,s,r,r))
(q10-5, (=,#,B,B,B,#,B)) (q19, (=,#,B,B,B,#,7), (r,s,s,s,s,r,r))
(q10-5, (1,#,B,B,B,#,B)) (q14, (1,#,B,B,B,#,f), (s,s,s,s,s,r,r))
(q10-5, (0,#,B,B,B,#,B)) (q14, (0,#,B,B,B,#,f), (s,s,s,s,s,r,r))
(q10-6, (#,#,B,B,B,B,B)) (q10-7, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q10-7, (#,#,B,B,B,#,B)) (q10-8, (#,#,B,B,B,#,B), (s,s,s,s,s,l,s))
(q10-8, (#,#,B,B,B,1,B)) (q10-8, (#,#,B,B,B,1,1), (s,s,s,s,s,l,r))
(q10-8, (#,#,B,B,B,#,B)) (q10-9, (#,#,B,B,B,#,#), (s,s,s,s,s,s,r))
(q10-9, (#,#,B,B,B,#,B)) (q20, (#,#,B,B,B,#,6), (s,s,s,s,s,r,r))
(q10-10, (#,#,B,B,B,#,B)) (q10-11, (#,#,B,B,B,#,B), (s,s,s,s,s,l,s))
(q10-11, (#,#,B,B,B,1,B)) (q10-16, (#,#,B,B,B,1,1), (s,s,s,s,s,r,s))
(q10-11, (#,#,B,B,B,0,B)) (q10-22, (#,#,B,B,B,0,1), (s,s,s,s,s,r,r))
(q10-22, (#,#,B,B,B,#,B)) (q18, (#,#,B,B,B,#,7), (s,s,s,s,s,r,r))
(q10-16, (#,#,B,B,B,#,1)) (q10-16, (#,#,B,B,B,#,1), (s,s,s,s,s,s,l))
(q10-16, (#,#,B,B,B,#,0)) (q10-16, (#,#,B,B,B,#,0), (s,s,s,s,s,s,l))
(q10-16, (#,#,B,B,B,#,#)) (q10-16, (#,#,B,B,B,#,#), (s,s,s,s,s,s,l))
(q10-16, (#,#,B,B,B,#,$)) (q10-17, (#,#,B,B,B,#,$), (s,s,s,s,s,r,r))
(q10-17, (#,#,B,B,B,B,1)) (q10-17, (#,#,B,B,B,1,1), (s,s,s,s,s,r,r))
(q10-17, (#,#,B,B,B,B,#)) (q10-18, (#,#,B,B,B,#,#), (s,s,s,s,s,r,r))
(q10-18, (#,#,B,B,B,B,1)) (q10-18, (#,#,B,B,B,B,1), (s,s,s,s,s,s,r))
(q10-18, (#,#,B,B,B,B,0)) (q10-18, (#,#,B,B,B,B,0), (s,s,s,s,s,s,r))
(q10-18, (#,#,B,B,B,B,#)) (q10-18, (#,#,B,B,B,B,#), (s,s,s,s,s,s,r))
(q10-18, (#,#,B,B,B,B,B)) (q21, (#,#,B,B,B,B,2), (s,s,s,s,s,s,r))
(q10-12, (#,#,B,B,B,B,#)) (q10-13, (#,#,B,B,B,0,B), (s,s,s,s,s,r,s))
(q10-12, (#,#,B,B,B,B,1)) (q10-14, (#,#,B,B,B,1,B), (s,s,s,s,s,r,l))
(q10-14, (#,#,B,B,B,B,1)) (q10-14, (#,#,B,B,B,1,B), (s,s,s,s,s,r,l))
(q10-14, (#,#,B,B,B,B,#)) (q10-13, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q10-13, (#,#,B,B,B,B,B)) (q10-19, (#,#,B,B,B,#,B), (s,s,s,s,s,r,l))
(q10-19, (#,#,B,B,B,B,1)) (q10-19, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q10-19, (#,#,B,B,B,B,0)) (q10-19, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q10-19, (#,#,B,B,B,B,#)) (q10-19, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q10-19, (#,#,B,B,B,B,$)) (q10-20, (#,#,B,B,0,B,$), (s,s,s,s,r,s,r))
(q10-20, (#,#,B,B,B,B,B)) (q16, (#,#,B,B,#,B,B), (s,s,s,s,r,s,s))

// MUL
(q11, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,B,B,d), (s,s,s,s,s,s,r))
(q11, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,B,B,d), (s,s,s,s,s,s,r))
(q11, (*,#,B,B,B,B,B)) (q14, (*,#,B,B,B,B,e), (r,s,s,s,s,s,r))
(q11, (=,#,B,B,B,B,B)) (q19, (=,#,B,B,B,B,6), (r,s,s,s,s,s,r))
(q11-1, (#,#,B,B,B,#,B)) (q11-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q11-2, (#,#,B,B,B,0,B)) (q11-4, (#,#,B,B,0,0,B), (s,s,s,s,r,r,s))
(q11-2, (#,#,B,B,B,1,B)) (q11-3, (#,#,B,B,B,B,1), (s,s,s,s,s,l,r))
(q11-4, (#,#,B,B,B,B,B)) (q16, (#,#,B,B,#,#,B), (s,s,s,s,r,r,s))
(q11-3, (#,#,B,B,B,1,B)) (q11-3, (#,#,B,B,B,B,1), (s,s,s,s,s,l,r))
(q11-3, (#,#,B,B,B,#,B)) (q11-9, (#,#,B,B,B,#,B), (s,s,s,s,s,r,s))
(q11-9, (#,#,B,B,B,B,B)) (q11-5, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q11-5, (#,#,B,B,B,B,B)) (q11-6, (#,#,B,B,#,B,B), (s,s,s,s,r,s,l))
(q11-6, (#,#,B,B,B,B,$)) (q11-10, (#,#,B,B,B,B,$), (s,s,s,s,s,s,r))
(q11-6, (#,#,B,B,B,B,1)) (q17, (#,#,B,B,B,B,h), (s,s,s,s,s,s,r))
(q11-10, (#,#,B,B,B,B,B)) (q16, (#,#,B,B,B,#,B), (s,s,s,s,s,r,s))
(q11-7, (#,#,B,B,B,#,B)) (q11-8, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q11-8, (#,#,B,B,B,1,B)) (q11-9, (#,#,B,B,B,1,B), (s,s,s,s,s,r,s))
(q11-8, (#,#,B,B,B,0,B)) (q11-11, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q11-11, (#,#,B,B,B,B,#)) (q11-11, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q11-11, (#,#,B,B,B,B,1)) (q11-11, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q11-11, (#,#,B,B,B,B,0)) (q11-11, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q11-11, (#,#,B,B,B,B,$)) (q2, (#,#,B,B,B,B,$), (r,s,s,s,s,s,r))

// JZ
(q12, (1,#,B,B,B,B,B)) (q12, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q12, (0,#,B,B,B,B,B)) (q12, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q12, (#,#,B,B,B,B,B)) (q12-1, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q12-1, (#,#,B,B,B,B,B)) (q17, (#,#,B,B,#,B,8), (s,s,s,s,r,s,r))
(q12-2, (#,#,B,B,B,#,B)) (q12-3, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q12-3, (#,#,B,B,B,1,B)) (q18, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q12-3, (#,#,B,B,B,0,B)) (q12-4, (#,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q12-4, (1,#,B,B,B,B,B)) (q12-4, (1,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q12-4, (0,#,B,B,B,B,B)) (q12-4, (0,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q12-4, (P,#,B,B,B,B,B)) (q13, (P,#,B,B,B,B,B), (r,s,s,s,s,s,s))

// JMP
(q13, (1,#,B,B,B,B,B)) (q19, (1,#,B,B,B,B,2), (s,s,s,s,s,s,r))
(q13, (0,#,B,B,B,B,B)) (q19, (0,#,B,B,B,B,2), (s,s,s,s,s,s,r))
(q13-1, (1,#,B,B,B,B,B)) (q13-1, (1,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (0,#,B,B,B,B,B)) (q13-1, (0,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (=,#,B,B,B,B,B)) (q13-1, (=,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (*,#,B,B,B,B,B)) (q13-1, (*,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (#,#,B,B,B,B,B)) (q13-1, (#,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (R,#,B,B,B,B,B)) (q13-1, (R,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (W,#,B,B,B,B,B)) (q13-1, (W,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (L,#,B,B,B,B,B)) (q13-1, (L,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (S,#,B,B,B,B,B)) (q13-1, (S,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (A,#,B,B,B,B,B)) (q13-1, (A,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (X,#,B,B,B,B,B)) (q13-1, (X,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (M,#,B,B,B,B,B)) (q13-1, (M,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (D,#,B,B,B,B,B)) (q13-1, (D,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (J,#,B,B,B,B,B)) (q13-1, (J,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (P,#,B,B,B,B,B)) (q13-1, (P,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, (H,#,B,B,B,B,B)) (q13-1, (H,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q13-1, ($,#,B,B,B,B,B)) (q13-2, ($,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q13-2, ($,#,B,B,B,#,B)) (q13-3, ($,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q13-3, ($,#,B,B,B,1,B)) (q13-4, ($,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-3, (#,#,B,B,B,1,B)) (q13-4, (#,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-3, ($,#,B,B,B,0,B)) (q2, ($,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-3, (#,#,B,B,B,#,B)) (q2, (#,#,B,B,B,#,B), (r,s,s,s,s,r,s))
(q13-4, (1,#,B,B,B,B,B)) (q13-4, (1,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (0,#,B,B,B,B,B)) (q13-4, (0,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (=,#,B,B,B,B,B)) (q13-4, (=,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (*,#,B,B,B,B,B)) (q13-4, (*,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (R,#,B,B,B,B,B)) (q13-4, (R,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (W,#,B,B,B,B,B)) (q13-4, (W,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (L,#,B,B,B,B,B)) (q13-4, (L,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (S,#,B,B,B,B,B)) (q13-4, (S,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (A,#,B,B,B,B,B)) (q13-4, (A,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (X,#,B,B,B,B,B)) (q13-4, (X,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (M,#,B,B,B,B,B)) (q13-4, (M,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (D,#,B,B,B,B,B)) (q13-4, (D,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (J,#,B,B,B,B,B)) (q13-4, (J,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (P,#,B,B,B,B,B)) (q13-4, (P,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (H,#,B,B,B,B,B)) (q13-4, (H,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q13-4, (#,#,B,B,B,B,B)) (q13-3, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))

(q14, (1,#,B,B,B,B,B)) (q14, (1,#,B,B,1,B,B), (r,s,s,s,r,s,s))
(q14, (0,#,B,B,B,B,B)) (q14, (0,#,B,B,0,B,B), (r,s,s,s,r,s,s))
(q14, (#,#,B,B,B,B,B)) (q14-1, (#,#,B,B,#,B,B), (s,s,s,s,r,s,l))
(q14-1, (#,#,B,B,B,B,c)) (q17, (#,#,B,B,B,B,d), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,d)) (q17, (#,#,B,B,B,B,g), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,e)) (q17, (#,#,B,B,B,B,f), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,h)) (q4-2, (#,#,B,B,B,B,B), (s,r,s,s,s,s,s))
(q14-1, (#,#,B,B,B,B,g)) (q17, (#,#,B,B,B,B,j), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,b)) (q17, (#,#,B,B,B,B,e), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,2)) (q17, (#,#,B,B,B,B,l), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,3)) (q17, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,4)) (q17, (#,#,B,B,B,B,2), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,5)) (q17, (#,#,B,B,B,B,4), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,6)) (q17, (#,#,B,B,B,B,5), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,7)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q14-1, (#,#,B,B,B,B,8)) (q17, (#,#,B,B,B,B,7), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,f)) (q17, (#,#,B,B,B,B,k), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,a)) (q17, (#,#,B,B,B,B,a), (s,s,s,s,s,s,r))
(q14-1, (#,#,B,B,B,B,9)) (q17, (#,#,B,B,B,B,b), (s,s,s,s,s,s,r))

(q15, (#,#,B,B,B,B,B)) (q15-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q15-1, (#,#,B,B,B,#,B)) (q15-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q15-2, (#,#,B,B,B,1,B)) (q15-2, (#,#,B,B,1,B,B), (s,s,s,s,r,l,s))
(q15-2, (#,#,B,B,B,0,B)) (q15-2, (#,#,B,B,0,B,B), (s,s,s,s,r,l,s))
(q15-2, (#,#,B,B,B,#,B)) (q15-3, (#,#,B,B,#,#,B), (s,s,s,s,r,r,l))
(q15-3, (#,#,B,B,B,B,5)) (q17, (#,#,B,B,B,B,b), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,3)) (q17, (#,#,B,B,B,B,4), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,4)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q15-3, (#,#,B,B,B,B,2)) (q17, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,6)) (q17, (#,#,B,B,B,B,e), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,7)) (q17, (#,#,B,B,B,B,g), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,8)) (q17, (#,#,B,B,B,B,k), (s,s,s,s,s,s,r))
(q15-3, (#,#,B,B,B,B,9)) (q4-2, (#,#,B,B,B,B,B), (s,r,s,s,s,s,s))

(q16, (#,#,B,B,B,B,B)) (q16-1, (#,#,B,B,B,B,B), (s,s,s,s,l,l,s))
(q16-1, (#,#,B,B,#,#,B)) (q16-2, (#,#,B,#,B,#,B), (s,s,s,r,l,s,s))
(q16-2, (#,#,B,B,1,#,B)) (q16-2, (#,#,B,1,B,#,B), (s,s,s,r,l,s,s))
(q16-2, (#,#,B,B,0,#,B)) (q16-2, (#,#,B,0,B,#,B), (s,s,s,r,l,s,s))
(q16-2, (#,#,B,B,#,#,B)) (q16-3, (#,#,B,:,#,B,B), (s,s,s,r,r,l,s))
(q16-3, (#,#,B,B,B,1,B)) (q16-3, (#,#,B,1,B,B,B), (s,s,s,r,s,l,s))
(q16-3, (#,#,B,B,B,0,B)) (q16-3, (#,#,B,0,B,B,B), (s,s,s,r,s,l,s))
(q16-3, (#,#,B,B,B,#,B)) (q2, (#,#,B,B,B,#,B), (r,s,s,s,s,r,s))

(q17, (#,#,B,B,B,B,B)) (q17-1, (#,#,B,B,B,B,B), (s,s,s,l,l,s,s))
(q17-1, (#,#,B,1,#,B,B)) (q17-1, (#,#,B,1,#,B,B), (s,s,s,l,s,s,s))
(q17-1, (#,#,B,0,#,B,B)) (q17-1, (#,#,B,0,#,B,B), (s,s,s,l,s,s,s))
(q17-1, (#,#,B,#,#,B,B)) (q17-1, (#,#,B,#,#,B,B), (s,s,s,l,s,s,s))
(q17-1, (#,#,B,$,#,B,B)) (q17-2, (#,#,B,$,B,0,B), (s,s,s,s,l,r,s))
(q17-1, (#,#,B,:,#,B,B)) (q17-4, (#,#,B,:,#,B,B), (s,s,s,l,l,s,s))
(q17-2, (#,#,B,$,1,B,B)) (q17-2, (#,#,B,$,B,B,B), (s,s,s,s,l,s,s))
(q17-2, (#,#,B,$,0,B,B)) (q17-2, (#,#,B,$,B,B,B), (s,s,s,s,l,s,s))
(q17-2, (#,#,B,$,#,B,B)) (q17-3, (#,#,B,$,#,#,B), (s,s,s,r,r,r,s))
(q17-3, (#,#,B,1,B,B,B)) (q17-3, (#,#,B,1,B,B,B), (s,s,s,r,s,s,s))
(q17-3, (#,#,B,0,B,B,B)) (q17-3, (#,#,B,0,B,B,B), (s,s,s,r,s,s,s))
(q17-3, (#,#,B,:,B,B,B)) (q17-3, (#,#,B,:,B,B,B), (s,s,s,r,s,s,s))
(q17-3, (#,#,B,#,B,B,B)) (q17-3, (#,#,B,#,B,B,B), (s,s,s,r,s,s,s))
(q17-3, (#,#,B,B,B,B,B)) (q17-10, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q17-4, (#,#,B,1,1,B,B)) (q17-4, (#,#,B,1,1,B,B), (s,s,s,l,l,s,s))
(q17-4, (#,#,B,0,0,B,B)) (q17-4, (#,#,B,0,0,B,B), (s,s,s,l,l,s,s))
(q17-4, (#,#,B,1,0,B,B)) (q17-5, (#,#,B,1,0,B,B), (s,s,s,s,s,s,s))
(q17-4, (#,#,B,0,1,B,B)) (q17-5, (#,#,B,0,1,B,B), (s,s,s,s,s,s,s))
(q17-4, (#,#,B,1,#,B,B)) (q17-5, (#,#,B,1,#,B,B), (s,s,s,s,r,s,s))
(q17-4, (#,#,B,0,#,B,B)) (q17-5, (#,#,B,0,#,B,B), (s,s,s,s,r,s,s))
(q17-4, (#,#,B,#,1,B,B)) (q17-5, (#,#,B,#,1,B,B), (s,s,s,r,s,s,s))
(q17-4, (#,#,B,#,0,B,B)) (q17-5, (#,#,B,#,0,B,B), (s,s,s,r,s,s,s))
(q17-4, (#,#,B,#,#,B,B)) (q17-6, (#,#,B,#,#,B,B), (s,s,s,r,s,s,s))
(q17-5, (#,#,B,1,1,B,B)) (q17-5, (#,#,B,1,1,B,B), (s,s,s,s,r,s,s))
(q17-5, (#,#,B,0,0,B,B)) (q17-5, (#,#,B,0,0,B,B), (s,s,s,s,r,s,s))
(q17-5, (#,#,B,1,0,B,B)) (q17-5, (#,#,B,1,0,B,B), (s,s,s,s,r,s,s))
(q17-5, (#,#,B,0,1,B,B)) (q17-5, (#,#,B,0,1,B,B), (s,s,s,s,r,s,s))
(q17-5, (#,#,B,1,#,B,B)) (q17-1, (#,#,B,1,#,B,B), (s,s,s,s,s,s,s))
(q17-5, (#,#,B,0,#,B,B)) (q17-1, (#,#,B,0,#,B,B), (s,s,s,s,s,s,s))
(q17-6, (#,#,B,1,#,B,B)) (q17-6, (#,#,B,1,#,B,B), (s,s,s,r,s,s,s))
(q17-6, (#,#,B,0,#,B,B)) (q17-6, (#,#,B,0,#,B,B), (s,s,s,r,s,s,s))
(q17-6, (#,#,B,:,#,B,B)) (q17-7, (#,#,B,:,#,B,B), (s,s,s,r,s,s,s))
(q17-7, (#,#,B,1,#,B,B)) (q17-7, (#,#,B,1,#,1,B), (s,s,s,r,s,r,s))
(q17-7, (#,#,B,0,#,B,B)) (q17-7, (#,#,B,0,#,0,B), (s,s,s,r,s,r,s))
(q17-7, (#,#,B,#,#,B,B)) (q17-11, (#,#,B,#,#,#,B), (s,s,s,r,s,r,s))
(q17-7, (#,#,B,B,#,B,B)) (q17-11, (#,#,B,B,#,#,B), (s,s,s,s,s,r,s))
(q17-11, (#,#,B,1,#,B,B)) (q17-11, (#,#,B,1,#,B,B), (s,s,s,r,s,s,s))
(q17-11, (#,#,B,0,#,B,B)) (q17-11, (#,#,B,0,#,B,B), (s,s,s,r,s,s,s))
(q17-11, (#,#,B,:,#,B,B)) (q17-11, (#,#,B,:,#,B,B), (s,s,s,r,s,s,s))
(q17-11, (#,#,B,#,#,B,B)) (q17-11, (#,#,B,#,#,B,B), (s,s,s,r,s,s,s))
(q17-11, (#,#,B,B,#,B,B)) (q17-8, (#,#,B,B,#,B,B), (s,s,s,s,r,s,s))
(q17-8, (#,#,B,B,1,B,B)) (q17-8, (#,#,B,B,1,B,B), (s,s,s,s,r,s,s))
(q17-8, (#,#,B,B,0,B,B)) (q17-8, (#,#,B,B,0,B,B), (s,s,s,s,r,s,s))
(q17-8, (#,#,B,B,#,B,B)) (q17-9, (#,#,B,B,B,B,B), (s,s,s,s,l,s,s))
(q17-9, (#,#,B,B,1,B,B)) (q17-9, (#,#,B,B,B,B,B), (s,s,s,s,l,s,s))
(q17-9, (#,#,B,B,0,B,B)) (q17-9, (#,#,B,B,B,B,B), (s,s,s,s,l,s,s))
(q17-9, (#,#,B,B,#,B,B)) (q17-10, (#,#,B,B,#,B,B), (s,s,s,s,r,s,l))
(q17-10, (#,#,B,B,B,B,i)) (q10-2, (#,#,B,B,B,B,B), (l,s,s,s,s,l,s))
(q17-10, (#,#,B,B,B,B,h)) (q11-7, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q17-10, (#,#,B,B,B,B,g)) (q11-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q17-10, (#,#,B,B,B,B,f)) (q15, (#,#,B,B,B,B,7), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,e)) (q21, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,d)) (q15, (#,#,B,B,B,B,6), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,j)) (q15, (#,#,B,B,B,B,8), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,k)) (q10-6, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q17-10, (#,#,B,B,B,B,l)) (q15, (#,#,B,B,B,B,9), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,c)) (q9-2, (#,#,B,B,0,B,B), (l,s,s,s,r,s,s))
(q17-10, (#,#,B,B,B,B,b)) (q23, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q17-10, (#,#,B,B,B,B,a)) (q15, (#,#,B,B,B,B,5), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,9)) (q8-2, (#,#,B,B,0,B,B), (l,s,s,s,r,s,s))
(q17-10, (#,#,B,B,B,B,8)) (q12-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q17-10, (#,#,B,B,B,B,2)) (q15, (#,#,B,B,B,B,2), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,3)) (q5-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q17-10, (#,#,B,B,B,B,4)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q17-10, (#,#,B,B,B,B,5)) (q15, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q17-10, (#,#,B,B,B,B,6)) (q7-2, (#,#,B,B,B,B,B), (l,s,s,s,s,s,s))
(q17-10, (#,#,B,B,B,B,7)) (q15, (#,#,B,B,B,B,4), (s,s,s,s,s,s,r))

(q18, (#,#,B,B,B,B,B)) (q18-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q18-1, (#,#,B,B,B,#,B)) (q18-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q18-2, (#,#,B,B,B,1,B)) (q18-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q18-2, (#,#,B,B,B,0,B)) (q18-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q18-2, (#,#,B,B,B,#,B)) (q18-3, (#,#,B,B,B,#,B), (s,s,s,s,s,r,l))
(q18-3, (#,#,B,B,B,B,3)) (q2, (#,#,B,B,B,B,B), (r,s,s,s,s,s,s))
(q18-3, (#,#,B,B,B,B,5)) (q21-10, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q18-3, (#,#,B,B,B,B,7)) (q10-12, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q18-3, (#,#,B,B,B,B,6)) (q2, (#,#,B,B,B,B,B), (r,s,s,s,s,s,s))

(q19, (1,#,B,B,B,B,B)) (q19, (1,#,B,B,B,1,B), (r,s,s,s,s,r,s))
(q19, (0,#,B,B,B,B,B)) (q19, (0,#,B,B,B,0,B), (r,s,s,s,s,r,s))
(q19, (#,#,B,B,B,B,B)) (q19-1, (#,#,B,B,B,#,B), (s,s,s,s,s,r,l))
(q19-1, (#,#,B,B,B,B,2)) (q13-1, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q19-1, (#,#,B,B,B,B,4)) (q23, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q19-1, (#,#,B,B,B,B,5)) (q21, (#,#,B,B,B,B,3), (s,s,s,s,s,s,r))
(q19-1, (#,#,B,B,B,B,6)) (q11-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q19-1, (#,#,B,B,B,B,7)) (q10-6, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q19-1, (#,#,B,B,B,B,8)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))

(q20, (#,#,B,B,B,1,B)) (q20, (#,#,B,B,B,1,B), (s,s,s,s,s,r,s))
(q20, (#,#,B,B,B,0,B)) (q20, (#,#,B,B,B,0,B), (s,s,s,s,s,r,s))
(q20, (#,#,B,B,B,#,B)) (q20, (#,#,B,B,B,#,B), (s,s,s,s,s,r,s))
(q20, (#,#,B,B,B,B,B)) (q20-1, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q20-1, (#,#,B,B,B,B,2)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q20-1, (#,#,B,B,B,B,3)) (q23, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q20-1, (#,#,B,B,B,B,4)) (q21-5, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q20-1, (#,#,B,B,B,B,5)) (q18, (#,#,B,B,B,#,5), (s,s,s,s,s,r,r))
(q20-1, (#,#,B,B,B,B,6)) (q21, (#,#,B,B,B,B,2), (s,s,s,s,s,s,r))

(q21, (#,#,B,B,B,B,B)) (q21-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-1, (#,#,B,B,B,#,B)) (q21-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-2, (#,#,B,B,B,0,B)) (q21-12, (#,#,B,B,B,B,B), (s,s,s,s,s,s,l))
(q21-2, (#,#,B,B,B,1,B)) (q21-3, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-3, (#,#,B,B,B,1,B)) (q21-3, (#,#,B,B,B,1,B), (s,s,s,s,s,l,s))
(q21-3, (#,#,B,B,B,#,B)) (q21-4, (#,#,B,B,B,#,B), (s,s,s,s,s,l,s))
(q21-4, (#,#,B,B,B,0,B)) (q21-4, (#,#,B,B,B,0,B), (s,s,s,s,s,l,s))
(q21-4, (#,#,B,B,B,#,B)) (q20, (#,#,B,B,B,#,5), (s,s,s,s,s,r,r))
(q21-4, (#,#,B,B,B,1,B)) (q20, (#,#,B,B,B,0,4), (s,s,s,s,s,r,r))
(q21-5, (#,#,B,B,B,1,B)) (q21-3, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-5, (#,#,B,B,B,#,B)) (q21-6, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-6, (#,#,B,B,B,0,B)) (q21-7, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-7, (#,#,B,B,B,0,B)) (q21-7, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-7, (#,#,B,B,B,1,B)) (q21-8, (#,#,B,B,B,1,B), (s,s,s,s,s,r,s))
(q21-7, (#,#,B,B,B,#,B)) (q21-9, (#,#,B,B,B,#,B), (s,s,s,s,s,r,s))
(q21-9, (#,#,B,B,B,B,B)) (q21-8, (#,#,B,B,B,0,B), (s,s,s,s,s,r,s))
(q21-8, (#,#,B,B,B,B,B)) (q21-12, (#,#,B,B,B,#,B), (s,s,s,s,s,r,l))
(q21-10, (#,#,B,B,B,#,B)) (q21-11, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-11, (#,#,B,B,B,0,B)) (q21-7, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-12, (#,#,B,B,B,B,2)) (q10-10, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q21-12, (#,#,B,B,B,B,3)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))

(q23, (#,#,B,B,B,B,B)) (q23-1, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q23-1, (#,#,B,B,B,#,B)) (q23-2, (#,#,B,B,B,B,B), (s,s,s,s,s,l,s))
(q23-2, (#,#,B,B,B,0,B)) (q16, (#,#,B,B,B,B,B), (s,s,s,s,s,s,s))
(q23-2, (#,#,B,B,B,1,B)) (q23-3, (#,#,B,B,B,#,B), (s,s,s,s,s,l,s))
(q23-3, (#,#,B,B,B,1,B)) (q23-3, (#,#,B,B,B,1,B), (s,s,s,s,s,l,s))
(q23-3, (#,#,B,B,B,#,B)) (q23-4, (#,#,B,B,B,1,B), (s,s,s,s,s,l,s))
(q23-4, (#,#,B,B,B,0,B)) (q20, (#,#,B,B,B,#,3), (s,s,s,s,s,r,r))
(q23-4, (#,#,B,B,B,#,B)) (q20, (#,#,B,B,B,#,2), (s,s,s,s,s,r,r))
(q23-4, (#,#,B,B,B,1,B)) (q20, (#,#,B,B,B,1,2), (s,s,s,s,s,r,r))
```

## Veľký plagát - diagram stavov

Na záver uvádzam kompletný farebný a čiernobiely diagram, na ktorom sa nachádzajú všetky stavy a prechody
použitého Turingovho stroja. V podstate ide o vizualizáciu kódu nášho simulátora, uvedeného v predchádzajúcej časti.
Diagram je dosť veľký, môžte si ho vytlačiť a napríklad nalepiť na stenu ako plagát.

- [Farebný diagram]({{ site.url }}/images/simulator-ram/RAM_simulator-color.pdf)
- [Čiernobiely diagram]({{ site.url }}/images/simulator-ram/RAM_simulator.pdf)


[ram]: https://en.wikipedia.org/wiki/Random-access_machine
[tm]: https://en.wikipedia.org/wiki/Multitape_Turing_machine
[turingchurch]: https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis
[ramturing]: https://www.ems-ph.org/journals/show_pdf.php?issn=0034-5318&vol=13&iss=2&rank=5
[turingequiv]: http://ce.sharif.edu/courses/94-95/1/ce414-2/resources/root/Text%20Books/Automata/John%20E.%20Hopcroft,%20Rajeev%20Motwani,%20Jeffrey%20D.%20Ullman-Introduction%20to%20Automata%20Theory,%20Languages,%20and%20Computations-Prentice%20Hall%20(2006).pdf
[simulator]: http://tms.pierreq.com/

