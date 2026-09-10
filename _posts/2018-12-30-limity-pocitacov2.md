---
title:  Limity počítačov a myslenia (2/2)
date:   2018-12-30 13:26:00
categories: [Teoretická informatika, Filozofia]
tags: [entscheidungsproblem, turing, limity mysle]
math: true
author: peterj
description: Problém zastavenia, limity počítačov a Church-Turingova ekvivalencia počítačov a mysle človeka. 
---

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

Kladné riešenie problému rozhodnutia, Entscheidungsproblem, ostávalo už ako posledná nádej Hilbertovho programu na formalizáciu
matematiky. Po Gödelovom teoréme nekompletnosti bolo jasné, že nie všetky pravdivé výroky sa dajú dokázať. Teraz bolo potrebné nájsť
odpoveď na otázku, či sa dá nájsť všeobecný postup, algoritmus, ktorý ľubovoľný výrok buď dokáže,
alebo vyvráti či odpovie negatívne v prípade jeho nedokázateľnosti.

# Mechanický proces

[Entscheidungsproblem][3] vyzýva k nájdeniu "algoritmu", teda mechanického procesu, ktorý by systematickým spôsobom vedel prehľadávať
celý "priestor" formálneho systému, až by našiel hľadaný výrok. Keby v priebehu cesty tento výrok našiel, prehlásil by "Áno" (výrok je
všeobecne pravdivý), inak by prehlásil "Nie" (výrok nie je všeobecne pravdivý), aj keby to znamenalo, že je nedokázateľný.

"Mechanický proces" alebo "algoritmus" je zoznam krokov, ktoré reprezentujú *všetko potrebné rozhodovanie*, ktorého slepým nasledovaním
dosiahneme požadovaný cieľ. Nepotrebujeme teda ďalej rozmýšľať nad jednotlivými krokmi, každý krok je jasný a presný. Algoritmus nemá
nejednoznačnosti.

Slovo "algoritmus" má dávny pôvod. Pochádza z 9. storočia (odvodené z mena perzského matematika [al-Khwarizmi][18]) a používalo
sa na označenie postupov operácií s arabskými číslicami. Od 18. storočia sa už intuitívne chápe ako určitý
mechanický postup na riešenie nejakého problému či úlohy. 

Problému rozhodnutia sa venovali hlavne tri postavy, ktoré nezávisle od seba a veľmi originálnym spôsobom nielenže podali riešenie
daného problému, ale prispeli k vzniku teoretických a praktických základov samotných počítačov a programovacích jazykov:

- [Alan Turing][7] - jemu sa budem venovať prednostne v ďalších častiach blogpostu,
- [Alonzo Church][8] - okrem riešenia Entscheidungsproblemu (s ktorým prišiel ako prvý) vymyslel aj tzv. [Lambda kalkul][55], ktorý tvorí základ všetkých
  funkcionálnych programovacích jazykov,
- ale aj samotný [Kurt Gödel][6], ktorý prišiel s [teóriou rekurzie][56], ktorá sa časom pretransformovala na vedný odbor "teória vypočítateľnosti".

# Turingove stroje

[Alan Turing][7] pracoval na Entscheidungsprobleme v 30. rokoch minulého storočia. Výsledky svojej práce publikoval vo svojom slávnom článku
["On computable numbers with application to Entscheidungsproblem"][52] z roku 1937.

Na to, aby mohol dokázať/vyvrátiť existenciu všeobecného algoritmu - mechanického procesu - na problém rozhodnutia, potreboval vytvoriť formálny
systém, v ktorom by tento algoritmus mohol zapísať. Potreboval vymyslieť symboly, axiómy a pravidlá odvodenia, pomocou ktorých by vedel zapísať "výrok"
samotného algoritmu.

Pri snahe sformalizovať "mechanický proces" hľadal inšpiráciu v človeku samotnom. Človek si popri premýšľaní zapisuje
medzivýsledky a konečný výsledok. Premýšľanie si Turing predstavoval ako diskrétnu zmenu "stavu mysle", ktorá viedla
k zapísaniu ďalšieho medzivýsledku alebo výsledku do zošita. Podľa medzivýsledku v zošite a aktuálneho "stavu mysle" človek
"premýšľaním" dôjde do ďalšieho "stavu mysle", ktorý vedie k zapísaniu ďalšieho medzivýsledku, atď. až kým nie je vypočítaný celý príklad.

Turing pritom dobre chápal, že stačí existencia konečného počtu symbolov s priradeným významom (zvlášť pre každý algoritmus), a pre jednoduchosť
predpokladal, že matematik používa štvorčekovaný zošit, pričom do jedného štvorčeka zapíše vždy maximálne jeden symbol:

![Matika](/assets/img/limity-pocitacov/math-squared.jpg)

Tento proces počítania sa mu podarilo formalizovať do abstraktného počítacieho "stroja", dnes známeho pod názvom [Turingov stroj][58] (T.S.):

![Turingov stroj](/assets/img/limity-pocitacov/turing-machine.png)

T.S. používa nekonečnú "pásku" ako náhradu štvorčekovaného zošita. Samotný T.S. je reprezentovaný tzv. čítaco-zapisovacou "hlavou", ktorá predstavuje
samotné premýšľanie ako *black-box*. Definované je len to, že táto "hlava" dokáže v jednom čase:

- zapísať/vymazať jeden symbol na/z pásky, 
- posunúť "hlavu" na nasledujúci/predchádzajúci symbol pásky
- na základe aktuálneho stavu a symbolu na páske (na ktorý hlava ukazuje) zmeniť stav

Takto zadefinovaný abstraktný stroj, ako Turing ukázal vo svojom článku, umožňoval zapísať každý algoritmus. Napríklad výstup nekonečnej
sekvencie `0 1 0 1 0 1 ...` sa dá zapísať do tabuľky:

| Aktuálny Stav | Aktuálny symbol |  | Zápis symbolu | Posun hlavy | Nový stav |
| ------------- | --------------- ||---------------|-------------|-----------|
| b             | nič             || 0             | doprava     | c         |
| c             | nič             ||               | doprava     | e         |
| e             | nič             || 1             | doprava     | f         |
| f             | nič             ||               | doprava     | b         |


<div id="turingm" style="height:200px; width:500px; background-color: #555"></div>

<script src="{{ site.baseurl }}{% link assets/js/limity-pocitacov/turing-machine.js %}"></script>
<button onclick="step()" style="padding: 10px">Krok</button>
<button onclick="reset()" style="padding: 10px">Reset</button>

Rozhodovanie T.S. je založené len na tom, čo stroj už "videl" alebo zapísal, a to je reprezentované aktuálnym stavom. Môže tak rôznym spôsobom
reagovať na rôzne "sekvencie" symbolov na páske, ktoré videl. Ak sa chce T.S. rozhodovať nad širším kontextom, musí postupne prejsť viacerými symbolmi pásky.


# Vypočítateľné čísla

Turing v článku definuje vypočítateľné čísla ako také, ktoré sú vyčísliteľné. Teda také, ktorých číslice vieme zapísať bez akéhokoľvek "záseku" až donekonečna,
a to pomocou stroja (či algoritmu). Ako príklad vypočítateľných čísel uvádza čísla ako $$\pi$$, $$e$$, reálne korene algebraických rovníc, atď.
Aj prirodzené číslo sa dá zapisovať "donekonečna" - buď pred ním budeme donekonečna vypisovať číslicu 0, alebo za ním môžeme zapísať desatinnú čiarku a za ňou
nekonečný počet číslic 0. V oboch prípadoch sa význam nezmení.

T.S., ktoré zodpovedajú vypočítateľným číslam, Turing označil ako *circle-free* ("bezcyklové"). To môže byť trochu mätúce, pretože "circle-free" stroje sú
chápané ako také, ktoré nikdy neprestanú vypisovať symboly výsledku na pásku. Nemajú teda "premýšľacie zacyklenie". Turing chcel týmto vyjadriť, že *circle-free* stroje sa vždy "posúvajú vpred", že "počítajú".

Aj keď vypočítateľné čísla tvoria nekonečnú množinu, Turing tvrdí, že existujú aj čísla, ktoré vieme matematicky definovať, ale neexistuje algoritmus
na vypisovanie ich číslic. Pojmom *circular* ("zacyklené") označuje stroje, ktoré vypíšu iba konečný počet číslic výsledku.
Potom buď zastavia, alebo pokračujú bez vypisovania ďalších číslic.

# Spočítateľnosť T.S.

Turing v ďalšom kroku ukázal postup toho, ako celú tabuľku, ktorá T.S. definuje, je možné previesť do jediného prirodzeného čísla. Postup prevodu
je priamočiary - symboly sa nahradia číslicami, ako aj oddeľovač riadkov tabuľky sa tiež nahradí číslicou. Vznikne tak jediné číslo, ktoré "enkóduje"
T.S. Toto číslo Turing označil ako D.N. (Description Number). Každá vypočítateľná sekvencia alebo vypočítateľné číslo (pomocou *circle-free* T.S.)
má minimálne jednu reprezentáciu D.N.

"Spočítateľnosť" a "vypočítateľnosť" spolu súvisia, ale vyjadrujú odlišné vlastnosti. Spočítateľnosť sa používa v kontexte množín a znamená,
že ich prvkom možno priradiť navzájom rôzne prirodzené čísla. Vypočítateľnosť sa týka existencie algoritmu pre daný výpočet.
Prirodzené aj racionálne čísla tvoria spočítateľné množiny, reálne čísla nie. Rozhodujúca však nie je existencia priameho nasledovníka podľa veľkosti.

Množina všetkých D.N. je spočítateľná ([enumerable][36]), pretože vieme vždy určiť nasledujúce D.N. (lebo je to prirodzené číslo a syntax vieme overiť
vždy v konečnom počte krokov). Keďže každé D.N. reprezentuje jeden T.S., tak aj množina všetkých T.S. musí byť spočítateľná. To znamená, že musíme vedieť systematickým spôsobom vypísať všetky T.S., ktoré sa vôbec dajú vytvoriť.

D.N., ktoré opisuje *circle-free* T.S., označil ako "uspokojujúce" ("satisfactory"). A Turing dopredu prezrádza, že nie je možné
nájsť všeobecný algoritmus, ktorý by zistil, či dané číslo je alebo nie je "uspokojujúce".

# Univerzálny T.S.

V ďalšom Turing definoval stroj, ktorý je schopný vypočítať ľubovoľné "vypočítateľné číslo". Na vstup dostane D.N. daného výpočtu a výsledkom
bude to isté, čo by vypočítal T.S. reprezentovaný vstupným D.N. Princíp tohto stroja je založený na vytvorení ďalších symbolov a spôsobe enkódovania
vstupného T.S. Univerzálny T.S. je teda akýmsi "simulátorom" T.S.

Ako príklad uvádzam [Game of Life][59] verziu univerzálneho T.S.:

{% include embed/youtube.html id='My8AsV7bA94' %}

# Efektívne vypisovanie vypočítateľných čísel

Vypočítateľné čísla tvoria spočítateľnú množinu. Otázkou však je, či ich vieme všetky systematicky vypisovať pomocou jedného algoritmu.

Systém vypisovania "nasledovníkov" bol už raz použitý, keď Georg Cantor v roku 1891 dokazoval existenciu nespočítateľných
nekonečných množín (množiny reálnych čísel). Použil ho tiež Gödel pri dokazovaní svojho teorému nekompletnosti a bol použitý aj v [Principii Mathematice][11]
v popise [Richardovho paradoxu][61]. Tento systém je známy pod názvom "diagonálny proces" alebo ["diagonálny argument"][54].
Turing najprv uvádza nasledujúci zámerne chybný argument pre binárne sekvencie:

> Ak sú vypočítateľné sekvencie spočítateľné, nech $$\alpha_n$$ je $$n$$-tá vypočítateľná sekvencia a nech $$\phi_n(m)$$ je $$m$$-tá číslica
> sekvencie $$\alpha_n$$. Nech $$\beta$$ je sekvencia, v ktorej $$n$$-tá číslica je definovaná ako $$1 - \phi_n(n)$$. Keďže sekvencia $$\beta$$
> je vypočítateľná, existuje číslo $$K$$, že $$1 - \phi_n(n) = \phi_K(n)$$ pre všetky $$n$$. Ak priradíme $$n = K$$, dostávame $$1 = 2\phi_K(K)$$,
> teda že číslo $$1$$ je párne. To je nemožné. Vypočítateľné sekvencie teda nie sú spočítateľné.

"Háčik" spočíva v predpoklade, že $$\beta$$ je vypočítateľná sekvencia. Ak by bola, v konečnom počte krokov by sme ju vedeli
vyčísliť. Avšak problém vyčíslenia vypočítateľných sekvencií je ekvivalentný problému zistenia, či nejaké číslo reprezentuje D.N. *circle-free* T.S.
A takýto proces nemáme - s konečným počtom krokov. Dôkaz tohto tvrdenia bude spočívať v pokuse zostrojiť stroj, ktorý počíta sekvenciu $$\beta'$$.
Jej $$n$$-tá číslica je $$\beta'_n = 1 - \beta_n = \phi_n(n)$$, kde $$\beta_n$$ označuje $$n$$-tú číslicu sekvencie $$\beta$$.

Nikde nie je povedané presne, čo tento stroj - počítajúci sekvenciu $$\alpha_n$$ - má robiť. Vieme len, že sekvencia $$\alpha_n$$ má byť vypočítateľná.
Keďže podľa Turinga problém vyčíslenia vypočítateľných sekvencií je ekvivalentný problému zistenia, či nejaký stroj je *circle-free*, predpokladajme,
že máme taký stroj. Teda predpokladajme, že vieme vytvoriť T.S., ktorý dostane na vstupe nejaký ľubovoľný T.S. a výstupom bude odpoveď, či je stroj
*circle-free*.

Predpokladaný rozhodovací stroj skombinujeme s univerzálnym T.S. do stroja, ktorý počíta sekvenciu $$\beta'$$.
Podľa predpokladu musí byť tento nový stroj *circle-free*. Keď však pri vypisovaní narazí na vlastné D.N., výpočet príslušnej diagonálnej číslice
bude čakať na tú istú číslicu svojho vlastného výstupu. Tú teda nikdy nevypíše. Dostávame spor, a preto predpokladaný rozhodovací stroj nemôže existovať.

Turing tým dokázal, že všeobecný algoritmus na rozpoznávanie *circle-free* T.S. neexistuje.

# Limity T.S.

Ako ďalší príklad nevypočítateľnej sekvencie vytvoril T.S. (napr. $$E$$), ktorý zisťuje, či nejaký T.S. (napr. $$M$$) vypíše aspoň raz nejaký
symbol (napríklad $$0$$). Turing tvrdil, že ak sa taký stroj nájde, bude dokonca možné zistiť, či tento T.S. bude symbol vypisovať donekonečna. Ako?
Na to vytvoril ďalší myšlienkový experiment:

Najprv dokážeme, že ak existuje T.S. $$E$$, potom existuje všeobecný postup na zistenie toho, či T.S. $$M$$ bude vypisovať $$0$$ donekonečna.
Majme T.S. $$M_1$$, ktorý bude vypisovať tú istú sekvenciu ako $$M$$, ale s tým rozdielom, že miesto prvého symbolu $$0$$ vypíše $$\overline{0}$$.
Ďalej majme T.S. $$M_2$$, ktorý nahradí prvé dva symboly $$0$$ (nie nevyhnutne za sebou) symbolom $$\overline{0}$$, atď. Teda, ak $$M$$ vypíše:

> $$A\;B\;A\;0\;1\;A\;A\;B\;0\;0\;1\;0\;A\;B ...$$

potom $$M_1$$ vypíše:

> $$A\;B\;A\;\overline{0}\;1\;A\;A\;B\;0\;0\;1\;0\;A\;B\;...$$

a $$M_2$$ vypíše:

> $$A\;B\;A\;\overline{0}\;1\;A\;A\;B\;\overline{0}\;0\;1\;0\;A\;B\;...$$

atď. Teraz majme T.S. $$F$$, ktorý bude postupne vypisovať $$M$$, potom $$M_1$$, $$M_2$$ atď. Skombinujeme $$F$$ s $$E$$ a dostaneme T.S. $$G$$.
Práca $$G$$ bude vyzerať tak, že sa najprv použije $$F$$ na vypísanie $$M$$ a následne ho $$E$$ otestuje:

- Ak $$M$$ *nikdy nevypíše* $$0$$, tak $$E$$ vypíše $$\mathbin{:}0\mathbin{:}$$
- Potom $$F$$ vypíše $$M_1$$ a $$E$$ ho otestuje. Ak $$M_1$$ nikdy nevypíše $$0$$, tak $$E$$ vypíše $$\mathbin{:}0\mathbin{:}$$
- a tak ďalej.

Teraz otestujme samotný stroj $$G$$ pomocou $$E$$. Ak sa zistí, že $$G$$ nikdy nevypíše $$0$$, to znamená, že $$M$$ vypisuje $$0$$ donekonečna.
Ak T.S. $$G$$ niekedy $$0$$ vypíše, potom $$M$$ donekonečna $$0$$ nevypisuje.

Takže vo všeobecnosti - schopnosťou zistiť, či daný stroj vypisuje nejaký symbol donekonečna, sme práve našli spôsob, ako zistiť, či vstupný T.S. je
*circle-free*. A to je podľa predchádzajúcich výsledkov nemožné. Takže stroj $$E$$ nemôže byť vypočítateľný.

# Entscheidungsproblem

Entscheidungsproblem - problém rozhodnutia - požadoval algoritmus, ktorý by vedel odpovedať na otázku, či ľubovoľný matematický výrok predikátovej
logiky (s rozšírením o axiómy aritmetiky prirodzených čísel) je vo všeobecnosti platný alebo nie. Turing teda potreboval nájsť [kódovanie][60] takýchto
výrokov tak, aby mohli byť vstupom do T.S., ktorý overuje ich platnosť.

Postup bol previesť otázku, či ľubovoľný T.S. niekedy vypíše $$0$$, na otázku dokázateľnosti príslušného výroku. V tejto chvíli bol T.S. už dostatočne
silne obhájený ako zástupca všetkých "mechanických procesov" - všetko, čo je vypočítateľné, je vypočítateľné na T.S.

1. Pre ľubovoľný T.S. $$M$$ zostrojme výrok $$\mathbin{Un}(M)$$, ktorý pri zamýšľanej interpretácii vyjadruje "$$M$$ niekedy vypíše $$0$$".
2. Ak Entscheidungsproblem je riešiteľný, potom existuje mechanický proces na zistenie, či $$\mathbin{Un}(M)$$ je dokázateľný.
3. Podľa predch. výsledkov je $$\mathbin{Un}(M)$$ dokázateľný vtedy a len vtedy, ak $$M$$ niekedy vypíše $$0$$
4. Ak vieme zistiť, či $$M$$ vypíše $$0$$, potom vieme zistiť, či ľubovoľný T.S. niekedy vypíše $$0$$
5. Podľa predch. výsledkov takýto stroj sa zostrojiť nedá
6. Teda predpokladaný všeobecný rozhodovací algoritmus neexistuje, čo znamená, že Entscheidungsproblem je neriešiteľný.

Sám Gödel veľmi uznával prácu Alana Turinga. Osobne sa nikdy nestretli,
aj keď obidvaja istú dobu pôsobili v Princetone. Turing tam v rokoch 1936–1938 študoval na Princetonskej univerzite u Alonza Churcha, ktorý nezávisle od Turinga (a efektívne skôr)
zistil, že Entscheidungsproblem nemá riešenie.

Čo je zaujímavé, je, že výsledky všetkých troch velikánov - Gödela, Turinga aj Churcha - sa zhodujú a ich formálne systémy (teória rekurzie, T.S. a
lambda kalkul) sú ekvivalentné. To znamená, že schopnosti a sila každého z týchto formalizmov sú rovnaké. Napr. to, čo je vypočítateľné na T.S., je efektívne
vypočítateľné lambda kalkulom, a naopak.

# Limity ľudskej mysle

Turingove stroje sú veľmi dôležité z niekoľkých hľadísk:

- Zahŕňajú základné myšlienky, ako by mohol fungovať počítač a jeho "programovanie" - dobre definujú algoritmus
- Umožňujú teoreticky skúmať algoritmy (nielen "vypočítateľnosť", ale aj zložitosť a ďalšie veci)
- Prispievajú určitým spôsobom k [agnosticizmu][82]

Teorém nekompletnosti, ako aj nemožnosť riešiť Entscheidungsproblem, prezrádzajú niečo viac aj o povahe nášho sveta,
nielen o povahe matematického sveta. Podľa [Church-Turingovej tézy][64] je to, čo človek je vôbec schopný vypočítať, iba to, čo vypočíta
Turingov stroj. Táto téza teda obmedzuje samotného človeka - tvrdí, že človek má úplne rovnaké limity ako Turingov stroj. Keďže hovoríme o práci
a myslení človeka, nehovoríme o formálnom systéme. Z tohto dôvodu tézu nie je možné dokázať formálne, avšak intuitívne je úplne akceptovaná.

Predstavme si, že problém rozhodnutia alebo jemu ekvivalentný - [problém zastavenia (Halting problem)][66] ("dá sa zostrojiť T.S., ktorý zistí, či
nejaký T.S. zastaví?") - je riešiteľný. Teda predstavme si, že existuje algoritmus (T.S.), ktorý dokáže riešiť Halting problem. Ak by sme mali takýto
algoritmus, mohli by sme napríklad vymyslieť kompilátory, ktoré by automaticky vedeli detekovať, že naše programy sa rútia do nekonečných cyklov,
prípadne iné užitočné veci. Tiež by sme mohli vyriešiť ťažké matematické problémy, ako napríklad [silnú Goldbachovu domnienku][65] (toto mám z
tejto [lekcie][72]):

Predstavme si nasledujúci algoritmus:

```scala
def goldbachConjecture(): Boolean = {
  def isPrime(n: BigInt): Boolean = {
      if (n < 2) return false
      var divisor = BigInt(2)
      while (divisor * divisor <= n) {
          if (n % divisor == 0) return false
          divisor += 1
      }
      true
  }

  def percolate(n: BigInt): Boolean = {
      var p = BigInt(2)
      while (p <= n / 2) {
          if (isPrime(p) && isPrime(n - p)) return true
          p += 1
      }
      false
  }

  var n = BigInt(4)
  while (percolate(n)) {
      n = n + 2
  }
  false
}
```

Zastaví niekedy tento program (napísaný v jazyku Scala)? Ak zastaví, potom Goldbachova domnienka neplatí a vyriešime tým veľký matematický problém.
Avšak ani keby sme počítaču dali všetky prostriedky na svete (CPU, pamäť) a ani ak by premenné mohli nadobúdať nekonečne veľké hodnoty, ani tak 
"nevieme a nebudeme vedieť" (*ignoramus et ignorabimus*), či program niekedy zastaví. To je jeden z priamych dôsledkov neriešiteľnosti Entscheidungsproblemu.

# Náznaky ďalšieho vývoja

Od Turingovho článku ubehlo už dosť veľa času. Bezprostredné pokračovanie malo formu skôr opráv (hlavne [Emil Post][70]).
Ďalej sa ukázalo, že Entscheidungsproblem nie je vôbec jediným problémom, ktorý nemá riešenie (ako napr. spomenutý [Halting problem][66],
ale napríklad ani [Hilbertov desiaty problém][68] ho nemá).

Postupne sa v priebehu ďalšieho rozvoja "teórie vypočítateľnosti" definovali triedy vypočítateľnosti - ako miera "vyjadrovacej sily", ktorou systém (napríklad programovací jazyk alebo iný abstraktný stroj či formalizmus) disponuje (viď napr. [Turing completeness][67]).

[Noam Chomsky][71] definoval [hierarchiu formálnych jazykov][78] podľa vyjadrovacej sily, ktorú majú, a dal ich do súvislosti s abstraktnými strojmi a
ich vyjadrovacou silou. 

Tak vzniklo mnoho ďalších abstraktných strojov a automatov, ktoré ešte lepšie približujú reálne počítače a tým umožňujú ich pohodlnejšie teoreticky skúmať, napr. s vyjadrovacou
silou T.S.:

- [RAM stroj][73] - predstaviteľ [Harvardskej architektúry][76],
- [RASP stroj][74] - predstaviteľ [von-Neumannovskej architektúry][77],
- [PRAM][75] - na analýzu paralelných algoritmov
- atď.

Alebo s menšou vyjadrovacou silou:

- [zásobníkové automaty][81] - odpovedajú sile bezkontextových jazykov
- [konečné automaty][80] - odpovedajú sile regulárnych jazykov
- atď.

Skúmanie zložitosti samotných algoritmov vyústilo do definície [tried zložitosti][79] (P, NP, NP-complete, ...).

Tiež sa našla súvislosť medzi dokazovaním matematických viet a počítačovými programami ([Curry-Howardov izomorfizmus][69]), ktorý hovorí, že matematický
dôkaz a program na počítači sú si ekvivalentné (je možné previesť jeden do druhého).

# Záver

Teória vypočítateľnosti je stále aktívny vedný odbor, ale podľa toho, čo som počul, je len málo ľudí na svete, ktorí sa mu dnes venujú.
Ja sám nie som matematik ani logik. Téma ma zaujala od prvej chvíle - prišla mi veľmi dôležitá, ale nešiel som cestou za príspevkami do tohto
vedného odboru. Po rokoch som sa k téme vrátil, pretože som zistil, že nakoniec ide o filozofický problém, ktorý sa dá dobre pochopiť aj bez
zamerania na matematiku.

Téma je zároveň veľmi dôležitá - celé je to o pochopení toho, kde je hranica medzi "objavom" a "výtvorom". Aj keď je vedľajším produktom hnacích síl
"objavu" a "výtvoru" akési obmedzenie, stále je to obmedzenie abstraktné a dáva pocit akejsi neuchopiteľnosti - a nakoniec - život ide aj tak ďalej.

Popri snahe pochopiť tieto obmedzenia vznikli neuveriteľné veci, ktoré boli smerodatné pre súčasný vývoj počítačov, algoritmov a programovacích jazykov.
Našťastie existuje obrovská množina problémov, ktoré počítače riešiť dokážu, aj keď samy majú len nepatrný "výkon" v porovnaní s Turingovými strojmi.
Nekonečná páska T.S. a jeho neobmedzená teoretická rýchlosť samotného vykonávania ho robia tým najvýkonnejším strojom na svete, s absolútnou platnosťou.
Napriek tomu ostávajú počítače tie najsofistikovanejšie stroje, aké kedy človek doteraz vyrobil.


[1]: https://en.wikipedia.org/wiki/Burali-Forti_paradox
[2]: https://en.wikipedia.org/wiki/Russell%27s_paradox
[3]: https://en.wikipedia.org/wiki/Entscheidungsproblem
[4]: https://en.wikipedia.org/wiki/Boolean_satisfiability_problem
[5]: https://en.wikipedia.org/wiki/Computability_theory
[6]: https://en.wikipedia.org/wiki/Kurt_G%C3%B6del
[7]: https://en.wikipedia.org/wiki/Alan_Turing
[8]: https://en.wikipedia.org/wiki/Alonzo_Church
[9]: https://en.wikipedia.org/wiki/First-order_logic
[10]: https://en.wikipedia.org/wiki/Axiom
[11]: https://en.wikipedia.org/wiki/Principia_Mathematica
[12]: https://en.wikipedia.org/wiki/Bertrand_Russell
[13]: https://en.wikipedia.org/wiki/Alfred_North_Whitehead
[14]: https://www.storyofmathematics.com/20th_russell.html
[15]: https://en.wikipedia.org/wiki/Vienna_Circle
[16]: https://www.storyofmathematics.com/20th_godel.html
[17]: https://en.wikipedia.org/wiki/G%C3%B6del%27s_completeness_theorem
[18]: https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi
[19]: https://en.wikipedia.org/wiki/Ignoramus_et_ignorabimus
[20]: https://en.wikipedia.org/wiki/David_Hilbert
[21]: https://en.wikipedia.org/wiki/Hilbert%27s_problems
[22]: https://en.wikipedia.org/wiki/Gottlob_Frege
[23]: https://en.wikipedia.org/wiki/Set_theory
[24]: https://en.wikipedia.org/wiki/Georg_Cantor
[25]: https://cs.wikipedia.org/wiki/Axiomatick%C3%A1_teorie_mno%C5%BEin
[26]: https://en.wikipedia.org/wiki/Deductive_reasoning
[27]: https://en.wikipedia.org/wiki/Notation#Mathematics
[28]: https://en.wikipedia.org/wiki/Peano_axioms
[29]: https://precariousimagination.wordpress.com/tag/john-von-neumann/
[30]: https://en.wikipedia.org/wiki/Emil_du_Bois-Reymond#The_Seven_World_Riddles
[31]: https://www.forgottenbooks.com/en/books/UeberdieGrenzendesNaturerkennens_10327234
[32]: https://en.wikipedia.org/wiki/Transcendence_(philosophy)#Kant_(and_modern_philosophy)
[33]: https://www.maa.org/press/periodicals/convergence/david-hilberts-radio-address-english-translation
[34]: https://en.wikipedia.org/wiki/Philip_Wadler
[35]: https://en.wikipedia.org/wiki/Hilbert%27s_second_problem
[36]: https://en.wikipedia.org/wiki/Enumeration
[37]: https://en.wikipedia.org/wiki/Foundations_of_mathematics#Foundational_crisis
[38]: https://en.wikipedia.org/wiki/Formal_system
[39]: https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems
[40]: https://en.wikipedia.org/wiki/Foundations_of_mathematics#Boolean_algebra_and_logic
[41]: https://sk.wikipedia.org/wiki/Modus_ponens
[42]: https://www.goodreads.com/book/show/183015.Uncle_Petros_and_Goldbach_s_Conjecture
[43]: https://www.goodreads.com/book/show/51287.Incompleteness
[44]: https://en.wikipedia.org/wiki/Liar_paradox
[45]: https://en.wikipedia.org/wiki/John_von_Neumann
[46]: https://en.wikipedia.org/wiki/K%C3%B6nigsberg
[47]: https://en.wikipedia.org/wiki/Institute_for_Advanced_Study
[48]: https://www.tuke.sk/wps/portal
[49]: https://kpi.fei.tuke.sk/sk/person/stefan-hudak
[50]: https://en.wikipedia.org/wiki/Chrysippus#Logic
[51]: https://en.wikipedia.org/wiki/Term_logic
[52]: https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf
[53]: https://en.wikipedia.org/wiki/Computable_number
[54]: https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument
[55]: https://en.wikipedia.org/wiki/Lambda_calculus
[56]: https://en.wikipedia.org/wiki/Computability_theory
[57]: https://www.geeksforgeeks.org/turing-machine-for-multiplication/
[58]: https://en.wikipedia.org/wiki/Turing_machine
[59]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[60]: https://en.wikipedia.org/wiki/Code
[61]: https://en.wikipedia.org/wiki/Richard%27s_paradox
[62]: https://books.google.sk/books?id=dSUTDAAAQBAJ&pg=PA91&lpg=PA91&dq=on+computable+numbers+emil+post+correction&source=bl&ots=IdD3VOuB8-&sig=cyCzFGPei_eQnSi2Fu7QFYd_knI&hl=en&sa=X&ved=2ahUKEwjnldSnhMLfAhVwMewKHfupAcoQ6AEwB3oECAEQAQ#v=onepage&q=on%20computable%20numbers%20emil%20post%20correction&f=false
[63]: https://en.wikipedia.org/wiki/Gentzen%27s_consistency_proofs
[64]: https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis
[65]: https://en.wikipedia.org/wiki/Goldbach%27s_conjecture
[66]: https://en.wikipedia.org/wiki/Halting_problem
[67]: https://en.wikipedia.org/wiki/Turing_completeness
[68]: https://en.wikipedia.org/wiki/Hilbert%27s_tenth_problem
[69]: https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence
[70]: https://en.wikipedia.org/wiki/Emil_Leon_Post
[71]: https://en.wikipedia.org/wiki/Noam_Chomsky
[72]: https://courses.engr.illinois.edu/cs373/sp2009/lectures/lect_21.pdf
[73]: https://en.wikipedia.org/wiki/Random-access_machine
[74]: https://en.wikipedia.org/wiki/Random-access_stored-program_machine
[75]: https://en.wikipedia.org/wiki/Parallel_random-access_machine
[76]: https://en.wikipedia.org/wiki/Harvard_architecture
[77]: https://en.wikipedia.org/wiki/Von_Neumann_architecture
[78]: https://en.wikipedia.org/wiki/Chomsky_hierarchy
[79]: https://en.wikipedia.org/wiki/Complexity_class
[80]: https://en.wikipedia.org/wiki/Finite-state_machine
[81]: https://en.wikipedia.org/wiki/Pushdown_automaton
[82]: https://sk.wikipedia.org/wiki/Agnosticizmus
