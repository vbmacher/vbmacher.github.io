---
layout: post
title: Logo v MetaPost-e
comments: true
---

Môj prvý blogpost sa bude týkať tvorbe loga, ktoré programátor chce použiť či už pre svoju webovú stránku alebo program.
Cieľom bude vytvoriť logo pre môj dlhodobý projekt [emuStudio](https://vbmacher.github.io/emuStudio/) (emulačná platforma a
framework).

Kde si dnes človek môže nakresliť relatívne rýchlo logo, aké chce? Áno, predstavte si, že nápad už máte. V mojom prípade nápad
na logo by sa mal týkať počítača, už len preto, čo znamená pojem emulátor. Ide o program, ktorý napodobňuje prácu nejakého
iného počítača. Táto vlastnosť potom väčšinou umožňuje spustiť programy pre napodobovaný počítač, ktoré na reálnom počítači nemôžu
bežať, a to hlavne z dôvodu nekompatibility. Keď som si to predstavil "graficky", vytvoril sa mi obraz *počítača v počítači*.
A to sa stalo ústrednou myšlienkou loga.

Počítač sa v dnešnej dobe kreslí väčšinou ako monitor, pod ktorým je klávesnica, ako napríklad v Gnomme:

![Gnome Computer](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Gnome-computer.svg/200px-Gnome-computer.svg.png)

Predtým sa počítač zas kreslil ako monitor, vedľa ktorého stál minitower:

![Desktop computer](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Desktop_computer_clipart_-_Yellow_theme.svg/200px-Desktop_computer_clipart_-_Yellow_theme.svg.png)

A ešte predtým počítač zas vyzeral tak, že monitor stál na podlhovastej "bedni":

![Windows computer icon](https://ih1.redbubble.net/image.229705255.5949/flat,200x200,075,f.u1.jpg)

Taký vtípek s Windowsom. Ale reálny príklad by sme mohli vidieť v prípade IBM Personal System/2 Model 55X, ako je napríklad tu:

![IBM PS/2 55SX](http://www.pc-collection.com/images/i/ibm/IBM_8555.jpg)

A práve tento posledný typ sa mi páči. Takže potrebujeme bedňu, a monitor. Na logo "počítač v počítači" teda stačia štyri obdĺžniky.

# Kde si dnes človek môže nakresliť logo?

Bohužiaľ nie som ani grafik, ani frontend developer, takže s grafikou mám pramálo skúseností. Napriek tomu, ak by som mal niečo
reálne nakresliť, ako prvé ma napadlo použiť program na vektorovú grafiku. Napríklad open-source program [Inkscape][4] alebo [GIMP][3].

Avšak po prezretí si niekoľkých "grafických" projektov na GitHub-e (väčšinou ikony alebo logá - [numix-icon-theme][8],
[logos][9], [gnome-icon-theme][10], [paper-icon-theme][11], [oranchelo-icon-theme][12]) som zistil, že vo všetkých
z nich sa ako zdrojový formát používa [SVG][6]. SVG, keďže ide o vektorový formát, je potom použitý ako zdroj buď pre
generovanie výsledných formátov, alebo rôznych veľkostí obrázkov pre rôzne použitie.

Grafici teda neukladajú svoj "projekt" grafického programu do git-u. Všetky vrstvy, pomocné čiary a podobne ostanú v
"projekte" grafického programu u nich na počítači, a tento nie je verejný. Zamýšľam sa - prečo? Možno že si autor chce
ponechať výhradné právo na akékoľvek pomocné prvky, ktorými dospeli k výslednému obrázku? Alebo je to tým, že projektový
súbor predpisuje použitie grafického programu a sám o sebe licenčne nedovoľuje jeho uvolnenie ako open-source? Neviem.

Každopádne - SVG sa mi preto nezdá ako dobrý zdroj. Je síce textový, ale rozhodne nie je human readable a v prípade, že
si ho chce človek upraviť, nie je to tak jednoduché. Často sú to všetko len krivky a body, ktoré sú väčšinou optimalizované
na veľkosť. Viac abstraktné vektorové prvky ako napr. obdĺžniky a kruhy, atď. chýbajú.

Existuje alternatíva?

# Alternatíva

Existuje. Druhou možnosťou je logo skutočne "naprogramovať", napríklad pomocou programov ako je [MetaPost][1] či [Dot (GraphViz)][2].
Výhodou tohto prístupu je, že obrázok vo forme zdrojového kódu je ľahko modifikovateľný, hocikto môže pridávať a odoberať prvky
a nemusí byť žiadny umelec, a nakoniec vieme si ho pekne držať v git-e.

Všetko však záleží od požiadaviek a od vlastných schopností. Ja som sa rozhodol pre MetaPost, jednak zrejme preto že sa viac
spolieham na presnosť napísaných inštrukcií ako obrázok vygenerovať, než reálnym ťahaním myši. A chcem aby moje logo bolo úhľadné,
geometricky presné.

# MetaPost

Je to kombinácia programovacieho jazyka a jeho interpretra, ktorý generuje výstup buď do PostScriptu (EPS), ale výstupom môže byť
aj [SVG][6] alebo PNG formát. Vychádza z programu s názvom [Metafont][7] od Donalda Knutha. Metafont však vznikol za účelom vytvárania
rastrových fontov. Jazyky sú však podobné - pomocou algebraických definícií a zápisov vieme vytvárať a manipulovať s geometrickými
objektami a aplikovať transformácie.

Takže v mojom prípade logo napíšem ako postupnosť takýchto definícií - obdĺžnikov, čiar a bodov, niektoré plochy vyfarbím a budem mať
počítač nakreslený. Potom vezmem tento počítač, nakreslím ho znova ale zmenšený do monitora toho väčšieho počítača. A hotovo.

Jazyk MetaPost-u som sa nijak zvlášť nepotreboval učiť, aj keď je podľa mňa trochu divný. Vychádzal som hlavne z
[manuálu](https://www.tug.org/docs/metapost/mpman.pdf) a z nejakých
[príkladov](http://tex.loria.fr/prod-graph/zoonekynd/metapost/metapost.html). 

Kód loga umiestnime do súboru s príponou `.mp`, teda napr. `logo.mp`. Základná štruktúra programu je nasledovná:


```
prologues:=3;
outputtemplate:="%j-%c.svg";
outputformat:="svg";

beginfig(1);
  // ...
endfig;
```

Takže vidíme, že príkazy musia byť zakončené bodkočiarkou. Prvé tri riadky som skopíroval z manuálu. Lepšie vysvetlenie
premennej `prologues` však nájdeme v tejto [diplomovej práci][5]. Kladná hodnota okrem iného spôsobí orezanie obrázku
na minimálny obdĺžnik, ktorý obrázok obkolesuje, čo chceme - žiadne A4 formáty a podobne.

`outputtemplate` definuje šablónu názvu výstupného súboru, pričom `%j` zastupuje tzv. "job name", ktorý odpovedá menu vstupného
súbora bez prípony (teda v našom prípade `logo`), a `%c` je číslo obrázka. A `outputformat` je snáď jasný. Okrem `svg` môžme
použiť `png` alebo `eps` (na veľkosti písmen záleží).

Ako ste si už iste všimli, súbor môže obsahovať popis aj niekoľkých obrázkov, každý z nich je označený číslom za `beginfig`. Takže
to `%c` v šablóne `outputtemplate` je toto číslo.

# Logo v MetaPost-e

Kreslenie v MetaPoste je vlastne zábava. Predstavte si, že logo sa skladá z určitých komponentov, ktoré majú svoje parametre, napr.
bedňa počítača je obdĺžnik, ktorého parametre sú šírka a výška, prípadne farba. Môžme si vytvoriť makro, ktoré vezme tieto parametre
a nakreslí bedňu. V makre môžme definovať aj iné komponenty ktoré bedňu prikrášli, ako napríklad nakreslí vodorovnú čiaru, ktorá
bude reprezentovať floppy disk, apod. Makro na nakreslenie bedne môže vyzerať nasledovne:

{% gist a40856f68918986ec30f621928af3274 %}

A výsledok:

![Bedňa]({{ "/images/logo-v-metaposte/case.svg" | absolute_url }})

Ako vidno, v kóde sa vieme pekne vyhrať. Nie je to nič zložité, len musíme trochu porozumieť ako to celé funguje. Napríklad,
do premennej `p` som si uložil cestu (typ `path`), čo je vlastne akoby cesta v grafe, ktorým je fiktívna mriežka dvojrozmerného
priestoru. S touto cestou si môžme robiť čo chceme - môžme ju vykresliť, alebo vyplniť (ak je uzavretá), atď.

Moju "cestu" - teda hlavný obdĺžnik bedne - som vytvoril pomocou pomocnej konštanty (podľa manuálu) `unitsquare`, ktorý reprezentuje
cestu `(0,0)--(1,0)--(1,1)--(0,1)--cycle`. Názov "unit square" hovorí, že ide o "jednotkový štvorec". Ak chceme z neho spraviť
obdĺžnik, musíme ho dobre "ponaťahovať". To dosiahneme pridaním `xscaled` a `yscaled` parametrov, ktoré zo štvorca spravia
obdĺžnik.

Túto cestu potom použijeme jednak na vykreslenie obrysu bedne (`draw`), a jednak na podfarbenie bieleho pozadia (`fill`).
Jednoduché, nie? Ak pozadie nechceme, jednoducho vymažeme príkaz `fill`.

Týmto spôsobom vieme vytvoriť celé logo, môžme sa s tým vyhrať do lubovôle a snažiť sa kód napísať pekne. Kód výsledného
loga je tu:

{% gist 590232184e295f211597de0feef376db %}

A vyzerá nasledovne:

![Hotové logo]({{ "/images/logo-v-metaposte/logo.svg" | absolute_url }})

# Čo ďalej

No tak zdroj SVG máme - teraz môžme pokračovať tak, ako to robia ostatní. Napríklad, keďže MetaPost umožňuje písanie parametrických
makier, môžme si vygenerovať rôzne verzie loga pre webovú stránku. Napríklad - hlavné logo pre banner na úvodnej stránke, alebo
malé logo na hornú lištu, atď. Ak je viac rôznych verzií loga, alebo ak sme vytvorili celú sadu ikon či obrázkov takýmto spôsobom,
výsledné SVG súbory môžme zabaliť do web-fontu, napríklad pomocou [WebFont Generátora][13].

Nemyslím si, že MetaPost je tou správnou voľbou pre všetky typy log, alebo ikon. Výhodu, ktorú prináša je geometrická presnosť
a jednoduchosť zápisu vo forme zdrojového kódu. Nevýhodou je však ťažkopádnejšie vyjadrovanie "umeleckého ducha". Logá sú však
väčšinou jednoduché tvary, ktoré majú určitú geometrickú formu, takže tam MetaPost podľa mňa je veľmi vhodný. Dokážu však umelci
zapisovať svoje grafiky algebraicky? :) Možno tam je pes zakopaný. 


[1]: https://en.wikipedia.org/wiki/MetaPost
[2]: https://graphviz.gitlab.io/
[3]: https://www.gimp.org/
[4]: https://inkscape.org/en/
[5]: http://tex.loria.fr/prod-graph/kratka-diplomka2001.pdf
[6]: https://sk.wikipedia.org/wiki/Scalable_Vector_Graphics
[7]: https://en.wikipedia.org/wiki/Metafont
[8]: https://github.com/numixproject/numix-icon-theme
[9]: https://github.com/gilbarbara/logos
[10]: https://github.com/GNOME/gnome-icon-theme
[11]: https://github.com/snwh/paper-icon-theme
[12]: https://github.com/OrancheloTeam/oranchelo-icon-theme
[13]: https://www.npmjs.com/package/webfonts-generator