---
title: Konflikty každodenné - Darcs
date: 2008-09-19 18:00:00
categories: [Utility]
tags: [darcs, vcs]
author: peterj
description: Riešenie konfliktov vo VCS Darcs, ktorý na rozdiel od git-u nepoužíva snapshoty, ale commity (patche) sú tými jedinými objektami v repozitári.
---


O systéme na správu verzií [darcs](http://darcs.net) bolo na internete popísané mnoho. Podľa môjho názoru ide o jeden z najkrajších a najjednoduchších systémov na správu verzií.
Je napísaný v Haskelli (funkcnionálny jazyk). Jeho fungovanie je založené na veľkej [matematickej teórii patchov](https://en.wikibooks.org/wiki/Understanding_Darcs/Patch_theory).
Tento článok sa zaoberá problematikou konfliktov v darcse.

Konflikty zvyčajne vznikajú, keď rovnaký súbor na rovnakom mieste modifikujú súčasne viacero ľudí (v rôznych repozitároch), nezávisle na sebe.


## Príklad

Vytvoríme si centralizovaný systém 3-och repozitárov, pričom jeden bude predstavovať server, na ktorý budú zvyšní 2-ja (akože používatelia) posielať a zisťovať zmeny.
Tieto repozitáre budú v skutočnosti iba obyčajné adresáre (kvôli jednoduchosti).

```bash
[repos]$ mkdir server vbmacher maeglin
[repos]$ ls
maeglin    server    vbmacher
[repos]$ cd maeglin
[repos/maeglin]$ darcs init
[repos/maeglin]$ cd ../server
[repos/server]$ darcs init
[repos/server]$ cd ../vbmacher
[repos/vbmacher]$ darcs init
```

Teraz používateľ **vbmacher** vytvorí prvý súbor, ktorý vloží do svojho repozitára. Všimnite si komunikáciu pri centralizovanom spôsobe - má vždy smer *klient - server - klient*.

```bash
[repos/vbmacher]$ > hello.c
    ... pridáme nejaký obsah do súboru hello,c ...
[repos/vbmacher]$ darcs add hello.c
[repos/vbmacher]$ darcs record -am Initial
   ... darcs sa opýta na email ...
Finished recording patch 'Initial'
[repos/vbmacher]$ darcs changes -v
diffing dir...
Fri Sep 19 09:48:22 CEST 2008  vbmacher
  * Initial
    {
    addfile ./hello.c
    hunk ./hello.c 1
    -
    +Ahoj!!!
    }
```

Teraz pošleme náš patch *Initial* na server.

```bash
[repos/vbmacher]$ darcs push ../server
Fri Sep 19 09:48:22 CEST 2008  vbmacher
  * Initial
Shall I push this patch? (1/1)  [ynWsfvpxdaqjk], or ? for help: y
Finished applying...
Push successful.
```

A klient **maeglin** si ho zo serveru stiahne:

```bash
[repos/maeglin]$ > darcs pull ../server
Fri Sep 19 09:48:22 CEST 2008  vbmacher
  * Initial
Shall I pull this patch? (1/1)  [ynWsfvpxdaqjk], or ? for help: y
Finished pulling and applying.
[repos/maeglin]$ ls
_darcs    hello.c
```

A je čas na to, aby sme vytvorili konflikt. Predtým však dodám, že konflikt nevznikne, aj keď sa modifikuje ten istý súbor, ale na rôznych miestach
(napr. jeden používateľ modifikuje riadky 3 až 15, a druhý 27 až 50). Takže aby sa vytvoril konflikt, musíme modifikovať rovnaké riadky v súbore. Poďme na to.

**vbmacher** zmení súbor:

```bash
[repos/vbmacher]$ vi hello.c
    ... zmena súboru hello.c ...
[repos/vbmacher]$ darcs record -am P1
Finished recording patch 'P1'
[host repos/vbmacher]$ darcs changes -v --last 1
diffing dir...
Fri Sep 19 10:11:13 CEST 2008  vbmacher
  * P1
    hunk ./hello.c 1
    -Ahoj!!!
    +#include <stdio.h>
    +
[repos/vbmacher]$ darcs push -a ../server
Pushing to "../server"...
Finished applying...
Push successful.
```

A tiež **maeglin** zmení súbor bez toho, aby si pred tým stiahol vbmachrov patch zo servera.

```bash
[repos/maeglin]$ vi hello.c
    ... zmena súboru hello.c ...
[repos/maeglin]$ darcs record -am P2
    ... darcs sa opýta na email ...
Finished recording patch 'P2'
[repos/maeglin]$ darcs changes -v --last 1
diffing dir...
Fri Sep 19 10:18:14 CEST 2008  maeglin
  * P2
    hunk ./hello.c 1
    -Ahoj!!!
    +main()
    +{
    +}
    +
```

A nastala chvíľa, na ktorú sme dlho čakali. Používateľ **maeglin** ide uploadovať svoj patch *P2* na server. Na serveri by teda vznikol konflikt s patchom *P1* od vbmachra.

```bash
[repos/maeglin]$ darcs push -a ../server
Pushing to "../server"...

darcs failed:  Refusing to apply patches leading to conflicts.
If you would rather apply the patch and mark the conflicts,
Backing up ./hello.c(-darcs-backup0)
There are conflicts in the following files:
./hello.c
use the --mark-conflicts or --allow-conflicts options to apply
These can set as defaults by adding
 apply mark-conflicts
to _darcs/prefs/defaults in the target repo. 
Apply failed!
```

Z výpisu je zrejmé, že konfliktný patch sa na server nepodarilo poslať. Štandardne je darcs nastavený tak, že konfliktné patche neumožní posielať (príkazy *push*, *apply*),
ale prijímať ich môžete (s tým, že sa konflikt v súbore vyznačí).

V prípade, že chcete umožniť aj posielanie konfliktných patchov, treba v cieľovom repozitári vytvoriť (alebo editovať) súbor `_darcs/prefs/defaults` a pridať do neho riadok
`apply allow-conflicts` (dovolenie posielania konfliktných patchov), alebo riadok `apply mark-conflicts` (umožní posielať konflikty a vyznačí konflikty v súboroch).
Odporúčam však nechať veci tak ako sú.

## Riešenie konfliktu

Vráťme sa k naším repozitárom. Používateľ **maeglin** vytvoril patch, ktorý je konfliktný. Čo s tým? Riešením je, že používateľ **maeglin** vytvorí ďalší patch, ktorý konflikt
rieši a následne pošle oba patche na server. Ostatní používatelia teda vôbec nemusia vedieť, že nejaký konflikt nastal.

Existuje overený postup, ako by mal používateľ **maeglin** vytvoriť patch, ktorý konflikt rieši. Najprv je nutné poznať, v ktorých miestach by vznikol konflikt (v ktorých
súboroch a kde presne v nich). To zistíme jednoducho tak, že zo servera si stiahneme všetky patche. To určite v našom lokálnom repozitári spôsobí konflikt, pretože keď sme
chceli poslať patch z nášho repozitára (používateľ **maeglin**), darcs hroziaci konflikt zahlásil. Toto je jediná možnosť, ako korektne získať informácie o konflikte - pokaziť
si vlastný repozitár.

```bash
[repos/maeglin$] darcs pull
Pulling from "../server"...
Fri Sep 19 10:11:13 CEST 2008  vbmacher
  * P1
Shall I pull this patch? (1/1)  [ynWsfvpxdaqjk], or ? for help: y
Backing up ./hello.c(-darcs-backup0)
We have conflicts in the following files:
./hello.c
Finished pulling and applying.
[repos/maeglin$] darcs whatsnew
hunk ./hello.c 1
-Ahoj!!!
+v v v v v v v
+#include <stdio.h>
+
+*************
+main()
+{
+}
+
+^ ^ ^ ^ ^ ^ ^
```

Po prijatí všetkých patchov zo servera darcs automaticky vyznačí konflikty v súboroch, ktorých sa to týka. Teraz má používateľ **maeglin** dve možnosti.

Môže si vrátiť lokálny repozitár do konzistentného stavu bez chýb. To sa urobí príkazom `darcs revert`. Tento príkaz sa používa na vrátenie zmien zdrojových kódov,
ktoré ešte neboli nahrané (s príkazom `darcs record`). Posledný príkaz `darcs revert` sa dá vrátiť späť cez príkaz `darcs unrevert`, ak zdrojové kódy neboli medzitým
zmenené (teda je ho možné použiť len raz). Konflikt však aj tak nebude vyriešený, len nebude vyznačený. Ak chce používateľ ponechať takúto zmenu, je potrebné ju nahrať
(cez `darcs record`) a následne poslať na server. Konflikt sa takto vyrieši.

Druhou možnosťou je manuálne riešenie konfliktu - jednoducho konfliktný súbor editovať a vyznačený konflikt vyriešiť ručne, nahrať patch a poslať ho na server.

Takže používateľ **maeglin** sa rozhodol pre kombináciu oboch možností (vždy je stredná cesta?) - najprv vráti repozitár do konzistentného stavu, a potom vyznačí konflikty, ktoré ručne vyrieši.

```bash
[repos/maeglin$] darcs revert
hunk ./hello.c 1
-Ahoj!!!
+v v v v v v v
+#include <stdio.h>
+
+*************
+main()
+{
+}
+
+^ ^ ^ ^ ^ ^ ^
Shall I revert this change? (1/1)  [ynWsfvpxdaqjk], or ? for help: y
Do you really want to revert this change? y
Finished reverting.
[repos/maeglin$] darcs mark-conflicts
Finished marking conflicts.
```

Teraz nasleduje ručné vyriešenie konfliktu. Konflikt je vyznačený veľmi prehľadne, začína reťazcom `vvv...v`, ktorý predstavuje šípky smerom dole, potom na riadkoch reťazce `***...*` sú oddeľovače
konfliktných častí zdrojového kódu, a nakoniec reťazec `^^^...^` reprezentuje koniec konfliktu (akože šípky hore).

Používateľ **maeglin** konflikt vyriešil takto (ručne):

```c
#include <stdio.h>
main()
{
}
```

Teraz nahrať patch, poslať a je to.

```bash
[repos/maeglin$] darcs record -am P_resolve
Finished recording patch 'P_resolve'
[repos/maeglin$] darcs push -a
Pushing to "../server"...
Finished applying...
Push successful.
```

Tak a konflikt je vyriešený. Článok je síce dlhý, ale samotné riešenie konfliktu nie :-).

Na záver dobré rady:

- Neskúšajte riešiť konflikty bez **všetkých** patchov, ktoré sa majú nachádzať vo vašom repozitári (teda najprv si všetky patche stiahnite), inak to povedie k "bitke konfliktov" a
  iných problémov (v darcse verzie 1.x to povedie k povestnému bugu, kde sa darcs v podstate zacyklí)
- Neskúšajte odstrániť niektoré konfliktné zmeny novými lokálnymi patchami predtým, ako si stiahnete konfliktné patche. V darcse 1.x to tiež povedie k bugu.
- príkaz `darcs rollback` je spôsob na riešenie konfliktov v darcse 1.x. Tento príkaz má však mnoho chýb a jeho používanie je nebezpečné

