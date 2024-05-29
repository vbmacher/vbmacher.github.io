---
layout: post
title: Krátka história 8-bitových procesorov
date: 2007-12-25 19:00:00
categories: [Emulácia]
tags: [8bit, cpu]
---


Tento článok sa jemne dotýka histórie 8-bitových mikroprocesorov, ktoré umožnili mikropočítačovú revolúciu.


Úplne prvým komerčným samostatným CPU čipom sa stal _Intel 4004_, ktorý sa na trhu objavil v novembri
roku 1971. Tento 4-bitový procesor bol vytvorený pre kalkulačky. Aj keď dokáže spracovať dáta vo
veľkosti 4 bitov, jeho inštrukcie sú 8 bitov dlhé. Program a dáta sú separované.

V roku 1972, firma Texax Instruments trocha predbehla _Intel 4004/4040_ so svojim 4-bitovým _TMS 1000_,
ktorý ako prvý obsahoval dostatok RAM (Random Access Memory) pamäte, a priestor pre programovú ROM
(Read Only Memory), a dovoľoval tak prácu bez použitia viacerých externých podporných čipov.
Takisto podporoval novú vlastnosť -  možnosť pridania vlastných inštrukcií do CPU.

Procesor _8080_, nasledovník procesora _8008_, bol na trh vypustený v apríli roku 1974. Kým _8008_ mal
14-bitové programové počítadlo aj adresovanie, _8080_ má 16-bitovú adresovú a 8-bitovú dátovú zbernicu.
Vnútorná štruktúra obsahuje sedem 8-bitových registrov na všeobecné použitie, 16-bitový smerník
(SP - stack pointer) do operačnej pamäte, ktorý nahradil 8-úrovňový vnútorný zásobník procesora _8008_,
a 16-bitové programové počítadlo. _8080_ disponuje s 256 I/O portami (Input/Output - vstupno/výstupné
porty), čiže zariadenia môžu byť pripojené súčasne bez nutnosti ich prepájania alebo rušenia adresného
priestoru.

Procesor _8080_ bol použitý napr. v počítači _Altair 8800_, v prvom široko známom osobnom počítači
(skôr domácom počítači, keďže definícia "prvého PC" je nie celkom jasná).

Zlepšený návrh firmy Intel vyústil do procesora s označením _8085_ (rok 1976), ktorý podporoval ďalšie
dve inštrukcie na povolenie/zakázanie troch pridaných pinov prerušení a takisto sériových I/O pinov.
Hardvér je zjednodušený tak, aby mu stačilo napätie +5V. Do čipu je pridaný hodinový generátor a
obvody radiča zbernice.

Úmyslom vytvorenia procesora _Zilog Z-80_ v roku 1976, bolo vylepšiť procesor _8080_, čo sa aj naozaj
podarilo. Tiež používa 8-bitové dáta a 16-bitové adresovanie, a mohol vykonať všetky inštrukcie
procesora _8080_ (ale nie _8085_), no obsahuje o 80 viac inštrukcií. Sada registrov bola zdvojená -
dve banky dátových registrov, ktoré mohli byť medzi sebou prepínané. Jednou z výhod bolo rýchle
prepínanie medzi operačným systémom a prerušeniami.

Do _Z-80_ boli tiež pridané dva indexové registre a dva typy relokovateľných vektorových prerušení.
To, čo naozaj spôsobilo, že sa tento procesor stal tak populárnym v dizajne, bolo jeho pamäťové
rozhranie - CPU generoval vlastné signály pre obnovu obsahu RAM. Znamenalo to jednoduchší návrh a
nižšiu cenu systému, čo bol rozhodujúci faktor pri výbere procesora pre počítač _TRS-80 Model 1_.
Táto výhoda spolu s jeho kompatibilitou s _8080_, plus použitie _CP/M_, prvého štandardného operačného
systému pre mikropočítače, ho spravili prvou voľbou pre mnoho systémov.

Len krátko po uvedení procesora _Intel 8080_, v roku 1975, firma Motorola predstavila svoj
procesor _6800_. Niekoľko návrhárov z tejto firmy odišlo, aby vytvorili spoločnosť MOS Technologies.
Táto spoločnosť predstavila sériu procesorov s označením _650x_, ktorá zahŕňala procesor _6501_
(pinovo kompatibilný s _6800_, stiahnutý z trhu skoro okamžite po jeho uvedení kvôli právnym nezhodám)
a _6502_. Podobné sérii _6800_, boli vytvorené varianty, ktoré pridávali do procesorov nové vlastnosti,
ako I/O porty, alebo boli lacnejšie s menšími adresovými zbernicami (_6507_ mal 13-bitovú 8K adresovú
zbernicu, použitý v počítači _Atari 2600_). Procesory _650x_ používali malý byte-ový endián (najmenej
významný byte je uložený na najnižšej adrese, výhodu to malo takú, že nižší byte adresy mohol byť
pridaný ku indexovému registru, zatiaľ čo bol vyberaný vyšší byte) a mal úplne odlišnú inštrukčnú sadu
ako procesor _6800_ s veľkým endiánom (najvýznamnejší byte je uložený na najnižšej adrese).

Návrhár Steve Wozniak z firmy Apple procesory _650x_ popísal ako prvé čipy, ktoré môžte zohnať za menej
ako sto dolárov (čo bolo vtedy asi štvrtina ceny procesora _6800_) - čipy sa stali CPU pre mnohé
skoršie domáce počítače (8-bitové produkty _Commodore_ a _Atari_).

Podobne ako _6502_, aj procesor _6809_ je založený na procesore _Motorola 6800_, ale tento významne
rozšíril jeho dizajn. Procesor _6809_ mal dva 8-bitové akumulátory a mohol ich skombinovať do jedného
16-bitového registra. Disponoval dvomi indexovými registrami a dvomi smerníkmi na zásobník (stack
pointers), čo umožnilo použitie veľmi pokročilých adresných módov. _6809_ bol na úrovni zdrojového
kódu kompatibilný s procesorom _6800_, aj keď mal _6800_ 78 inštrukcií a _6809_ iba okolo 59.
Niektoré inštrukcie boli nahradené viac všeobecnými, ktoré assembler mohol preložiť, a niektoré boli
dokonca nahradené adresnými módmi. Kým aj _6800_, aj _6502_ mali rýchly 8-bitový mód na adresovanie
prvých 256 bytov RAM pamäte (jedna "stránka"), procesor _6809_ používal 8-bitový _Direct Page_ register
na nájdenie tejto "rýchlo-adresnej" stránky nachádzajúcej sa kdekoľvek v 64K veľkom adresnom priestore.

Vývoj procesorov samozrejme pokračoval, tu som uviedol vývoj asi tých najznámejších 8 bitových
procesorov, ktoré umožnili mikropočítačovú revolúciu.
