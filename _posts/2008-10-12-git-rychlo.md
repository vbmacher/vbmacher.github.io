---
layout: post
title: Git rýchlo
date: 2008-10-12 15:00:00
categories: [Utility]
tags: [git, vcs]
author: peterj
description: Krátky zoznam užitočných príkazov git-u pre tých, ktorí už vedia ako git funguje. 
---

Tento článok som napísal pre používateľov, ktorí sa chcú naučiť používať **git** - systém na správu
verzií zdrojových kódov, ktorý vytvoril [Linus Torvalds](http://en.wikipedia.org/wiki/Linus_Torvalds).

Článok je napísaný vo forme otázka: odpoveď a je teda akýmsi prehľadom základných potrieb používateľa
pri každodennom používaní git-u. Nezahŕňa väčšinu príkazov a pokrýva iba najnutnejšiu oblasť,
ktorú každý nutne potrebuje. Množstvo vecí bolo prebratých z git [tutoriálu](http://www.kernel.org/pub/software/scm/git/docs/gittutorial.html).
Tak, pusťme sa do toho.

1. *Pridal som nové súbory/adresáre, ktoré chcem dať do repozitára*
    - **najpoužívanejšie:** `git add adresar`  -> pridá všetko rekurzívne v adresári *adresar* do gitového indexu, ale necommitne to ešte do samotného repozitára
    - všeobecne: `git add subor1 subor2 ...` 
    - `git add .`  -> pridá všetky súbory/adresáre rekurzívne z aktuálneho adresára do indexu (tiež zmeny necommitne)
2. *Chcem vytvoriť commit*
    - **najpoužívanejšie:** `git commit -a` -> commitne všetko, v čom nastane zmena, nové súbory a adresáre do repozitára nepridáva
    - `git add zmenene_subory ; git commit` -> najprv pridá do indexu súbory, ktoré čakajú na commit (zmenené súbory) a potom to commitne
3. *Chcem si pozrieť, aké commity už mám*
    - `git log` -> vypíše zoznam commitov (konkrétne zmeny neuvádza)
    - `git log --since=”kedy”` -> vypíše zoznam commitov od “kedy” do súčastnosti, kde “kedy” môže byť napr.: “3.11.2006”, “3 minutes ago”, “4 days ago”, ....
    - `git log -p` -> vypíše okrem zoznamu commitov **aj konkrétne zmeny**, ktoré boli vykonané (diff-y)
    - `git log --graph` -> vypíše textovo-grafický zoznam commitov (pekné)
4. *Chcem zistiť, aké zmeny som urobil v repo (ktoré ešte nemám commitované)*
    - `git diff` -> vypíše diff pre každý zmenený súbor
    - `git diff --cached` -> to isté, treba ale použiť vtedy, ak pred tým bol príkaz `git add` (teda keď sa zmenil index)
    - **najpoužívanejšie:** `git status` -> zistí stav repozitára a vypíše zoznam súborov, ktoré sa zmenili, a tiež tie, ktoré ešte nikdy neboli pridané do repozitára (untracked files)
5. *Chcem poslať zmeny na server*
    - `git push server master` -> z lokálneho adresára pošle všetky commity na server *server*, do vetvy *master* (druhýkrát sa už názov vetvy nemusí uvádzať). URL servera môže byť typu *ssh*, *http* alebo aj *git* protokol v rôznych tvaroch
6. *Chcem si stiahnuť zmeny, ktoré urobil niekto iný (zo servera)*
    - **najpoužívanejšie:** `git pull server master` -> zo servera server stiahne tie commity, ktoré nemám, do môjho lokálneho adresára (z vetvy *master*, ale to sa po prvom raze nemusí uvádzať)
    - `git fetch server; git merge` -> to isté, len po častiach: najprv stiahne informácie o nových commitoch a potom ich mergne = zlúči s lokálnym repozitárom
7. *Nechce mi odoslať moje commity na server, lebo by vznikol konflikt (push mi nefunguje)*
    1. `git fetch server` -> najprv si stiahnem informácie o commitoch zo servera, tak zistím aj informácie o budúcej kolízii
    2. `git show FETCH_HEAD` -> potom si pozriem, aké nové commity si môžem stiahnuť a tak môžem zistiť, čo bude spôsobovať kolíziu (tento krok je možné vynechať)
    3. `git pull server` -> ďalej si stiahnem všetky konfliktné commity. GIT sa najprv pokúsi konflikt vyriešiť sám a ak sa mu to nepodarí, automaticky vyznačí miesta v súboroch, v ktorých nastal konflikt
    4. `git diff` -> zistím, kde sú vyznačené konflikty
    5. vyznačené konflikty v súboroch treba opraviť ručne.
    6. `git commit -a` -> opravené konflikty commitnem do repa
    7. `git push server` -> a nakoniec pošlem commity na server (moje komity aj s vyriešeným konfliktom)
8. *Chcem si pozrieť obsah súboru readme.txt, aký bol pred 10-timi commitmi, ktorý sa nachádzal vo vetve “master”*
    - `git show master~10:readme.txt`
