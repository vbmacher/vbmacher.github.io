---
title: Git rýchlo
date: 2008-10-12 15:00:00
categories: [Utility]
tags: [git, vcs]
author: peterj
description: Krátky zoznam užitočných príkazov git-u pre tých, ktorí už vedia, ako git funguje.
---

Tento článok som napísal pre používateľov, ktorí sa chcú naučiť používať **git** - systém na správu
verzií zdrojových kódov, ktorý vytvoril [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds).

Článok je napísaný vo forme otázka: odpoveď a je teda akýmsi prehľadom základných potrieb používateľa
pri každodennom používaní git-u. Nezahŕňa väčšinu príkazov a pokrýva iba najnutnejšiu oblasť,
ktorú každý nutne potrebuje. Množstvo vecí bolo prebratých z git [tutoriálu](https://mirrors.edge.kernel.org/pub/software/scm/git/docs/gittutorial.html).
Tak, pusťme sa do toho.

1. *Pridal som nové súbory/adresáre, ktoré chcem dať do repozitára*
    - **najpoužívanejšie:** `git add adresar`  -> pripraví zmeny súborov rekurzívne v adresári *adresar* do gitového indexu; nové ignorované súbory vynechá a commit ešte nevytvorí
    - všeobecne: `git add subor1 subor2 ...` 
    - `git add .`  -> pripraví zmeny súborov rekurzívne z aktuálneho adresára do indexu; nové ignorované súbory vynechá (tiež zmeny necommitne)
2. *Chcem vytvoriť commit*
    - **najpoužívanejšie:** `git commit -a` -> automaticky pripraví zmeny a odstránenia sledovaných súborov a commitne ich spolu s obsahom indexu; nové nesledované súbory sám nepridá
    - `git add zmenene_subory ; git commit` -> najprv pripraví zmeny uvedených súborov do indexu a potom commitne celý obsah indexu
3. *Chcem si pozrieť, aké commity už mám*
    - `git log` -> vypíše zoznam commitov (konkrétne zmeny neuvádza)
    - `git log --since="kedy"` -> vypíše zoznam commitov od “kedy” do súčasnosti, kde “kedy” môže byť napr.: “3.11.2006”, “3 minutes ago”, “4 days ago”, ....
    - `git log -p` -> vypíše okrem zoznamu commitov **aj konkrétne zmeny**, ktoré boli vykonané (diff-y)
    - `git log --graph` -> vypíše textovo-grafický zoznam commitov (pekné)
4. *Chcem zistiť, aké zmeny som urobil v repo (ktoré ešte nemám commitované)*
    - `git diff` -> zobrazí zmeny v pracovných súboroch oproti indexu (zmeny ešte nepripravené na commit)
    - `git diff --cached` -> zobrazí zmeny v indexe oproti poslednému commitu (HEAD), teda zmeny pripravené na commit
    - **najpoužívanejšie:** `git status` -> vypíše zmeny pripravené aj nepripravené na commit a tiež nesledované súbory (untracked files), ktoré nie sú ignorované
5. *Chcem poslať zmeny na server*
    - `git push server master` -> aktualizuje vetvu *master* na serveri *server* podľa lokálnej vetvy *master* a odošle chýbajúce dáta jej histórie. Vynechanie názvu vetvy závisí od konfigurácie; prvé spustenie si ho automaticky nezapamätá. Adresu servera možno zadať napríklad cez SSH alebo HTTPS; podporované sú aj ďalšie protokoly, ak server umožňuje zápis
6. *Chcem si stiahnuť zmeny, ktoré urobil niekto iný (zo servera)*
    - **najpoužívanejšie:** `git pull server master` -> stiahne vetvu *master* zo servera *server* a začlení ju do aktuálnej lokálnej vetvy podľa zvoleného spôsobu integrácie (fast-forward, merge alebo rebase). Vynechanie názvu vetvy závisí od konfigurácie, nie od predchádzajúceho spustenia
    - `git fetch server; git merge` -> najprv stiahne dáta zo servera a aktualizuje príslušné vzdialené sledovacie vetvy; potom zlúči nakonfigurovanú upstream vetvu do aktuálnej vetvy. Zodpovedá predchádzajúcemu príkladu len pri správne nastavenej upstream vetve a použití merge
7. *Push bol odmietnutý, pretože vzdialená vetva obsahuje commity, ktoré moja lokálna vetva nemá (non-fast-forward)*

    To ešte neznamená konflikt v súboroch. Nasledujúci postup predpokladá nastavenú upstream vetvu, správny cieľ pre push a pull nakonfigurovaný na merge.

    1. `git fetch server` -> stiahnem dáta zo servera a aktualizujem vzdialené sledovacie vetvy; pracovné súbory sa tým nezlúčia ani sa ešte nezisťujú konflikty pri zlučovaní
    2. `git show FETCH_HEAD` -> pozriem si commit označený FETCH_HEAD a jeho zmeny; tento príkaz nevypisuje zoznam všetkých prichádzajúcich commitov (krok je možné vynechať)
    3. `git pull server` -> stiahnem aktuálne zmeny a zlúčim ich s aktuálnou vetvou. Ak Git nedokáže zmeny zlúčiť automaticky, ohlási konflikty; textové konflikty vyznačí v dotknutých súboroch
    4. `git diff` -> pri konflikte si pozriem zmeny v dotknutých súboroch
    5. prípadné konflikty v súboroch vyriešim ručne.
    6. `git commit -a` -> po vyriešení konfliktov dokončím merge commit; ak zlúčenie prebehlo automaticky, tento krok netreba. Príkaz zahrnie aj ostatné zmeny sledovaných súborov a obsah indexu
    7. `git push server` -> odošlem výslednú históriu do nakonfigurovanej cieľovej vetvy
8. *Chcem si pozrieť obsah súboru readme.txt v predkovi vetvy “master”, ku ktorému sa dostanem desiatimi krokmi vždy cez prvého rodiča commitu*
    - `git show master~10:readme.txt`
