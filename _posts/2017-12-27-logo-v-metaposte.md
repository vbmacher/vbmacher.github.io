---
title: Logo v MetaPost-e
categories: [Grafika]
tags: [emustudio, metapost]
date: 2017-12-28 14:30:00
author: peterj
description: Krátky príbeh o tom, ako vzniklo logo pre emuStudio.
---

Môj prvý blogpost sa bude týkať tvorbe loga, ktoré programátor chce použiť či už pre svoju webovú stránku alebo program.
Cieľom bude vytvoriť logo pre môj dlhodobý projekt [emuStudio][19] (emulačná platforma a framework).

Kde si dnes človek môže nakresliť relatívne rýchlo logo, aké chce? Áno, predstavte si, že nápad už máte. V mojom prípade nápad
na logo by sa mal týkať počítača, už len preto, čo znamená pojem emulátor. Ide o program, ktorý napodobňuje prácu nejakého
iného počítača. Táto vlastnosť potom väčšinou umožňuje spustiť programy pre napodobovaný počítač, ktoré na reálnom počítači nemôžu
bežať, a to hlavne z dôvodu nekompatibility. Keď som si to predstavil "graficky", vytvoril sa mi obraz *počítača v počítači*.
A to sa stalo ústrednou myšlienkou loga.

Počítač sa v dnešnej dobe kreslí väčšinou ako monitor, pod ktorým je klávesnica:

![Computer Display](/assets/img/logo-v-metaposte/computer-display.png)

Predtým sa počítač zas kreslil ako monitor, vedľa ktorého stál minitower:

![Desktop Computer](/assets/img/logo-v-metaposte/computer-desktop.png)

A ešte predtým počítač zas vyzeral tak, že monitor stál na podlhovastej "bedni":

![Computer with desk under display](/assets/img/logo-v-metaposte/computer-under.png)

A práve tento posledný typ sa mi páči. Takže potrebujeme bedňu, a monitor. Na logo "počítač v počítači" teda stačia štyri obdĺžniky.

Moje prvé kroky viedli na internet. Hľadal som niečo jednoduché, proste pekný "computer clipart". A podarilo sa mi nájsť veľmi
pekný a hlavne free clipart, ktorý sa mi zapáčil ako základ pre moje nové logo (zo stránky [4vector.com][14]):

![Computer Clipart](/assets/img/logo-v-metaposte/computer-clipart.png)


# Kde si dnes človek môže nakresliť logo?

Bohužiaľ nie som ani grafik, ani umelec, ani frontend developer, takže s grafikou mám pramálo skúseností. Napriek tomu, ak by som
mal niečo reálne nakresliť, ako prvé ma napadlo použiť program na vektorovú grafiku. Napríklad open-source program [Inkscape][4] alebo [GIMP][3].

Po prezretí si niekoľkých "grafických" projektov na GitHub-e (väčšinou ikony alebo logá - [numix-icon-theme][8],
[logos][9], [gnome-icon-theme][10], [paper-icon-theme][11], [oranchelo-icon-theme][12]) som zistil, že vo všetkých
z nich sa ako zdrojový formát používa [SVG][6]. SVG, keďže ide o vektorový formát, je potom použitý ako zdroj buď pre
generovanie výsledných formátov, alebo rôznych veľkostí obrázkov pre rôzne použitie.

Grafici na GitHub teda neukladajú svoj "projekt" grafického programu. Všetky vrstvy, pomocné čiary a podobne ostanú v
"projekte" grafického programu u nich na počítači, a tento nie je verejný. Zamýšľam sa - prečo? Možno že si autor chce
ponechať výhradné právo na akékoľvek pomocné prvky, ktorými dospeli k výslednému obrázku? Alebo je to tým, že projektový
súbor predpisuje použitie grafického programu a sám o sebe licenčne nedovoľuje jeho uvolnenie ako open-source? Neviem.

Keby som si mal nakresliť logo, samozrejme ja projektový súbor mať budem. A zdieľať ho asi tiež môžem, snáď. 
Avšak, keďže som viac programátor ako grafik, existuje "programátorská" alternatíva?

# Alternatíva

Existuje. Skutočne "naprogramovať" logo môžme napríklad pomocou programov ako je [MetaPost][1], [Dot (GraphViz)][2]
alebo [TikZ][15] pre [LaTeX][16].
Výhodou tohto prístupu je, že obrázok vo forme zdrojového kódu je ľahko modifikovateľný, hocikto môže pridávať a odoberať prvky
a nemusí byť žiadny umelec, a nakoniec vieme si ho pekne držať v git-e.

Nevýhodou - snáď - je to, že zložitejšie tvary, krivky alebo objekty s dynamickými efektami kreslíme využitím jednak
jazyka samotného a pomocou afinných transformácii = matematiky.

Všetko však záleží od požiadaviek a od vlastných schopností. Ja som sa rozhodol pre MetaPost, jednak zrejme preto že
logo ktoré chcem nakresliť je jednoduché, chcel som si to skúsiť a viac sa spolieham na napísaný text inštrukcií ako
obrázok nakresliť, než na WYSIWYG ťahaním myši. Rád by som, aby moje logo bolo geometricky presné.

# MetaPost

Je to kombinácia programovacieho jazyka a jeho interpretra, ktorý generuje výstup buď do PostScriptu (EPS), ale výstupom môže byť
aj [SVG][6] alebo PNG formát. Vychádza z programu s názvom [Metafont][7] od Donalda Knutha. Metafont však vznikol za účelom vytvárania
rastrových fontov. Jazyky sú však podobné - pomocou algebraických definícií a zápisov vieme vytvárať a manipulovať s geometrickými
objektami a aplikovať transformácie.

Takže v mojom prípade logo napíšem ako postupnosť takýchto definícií - obdĺžnikov, čiar a bodov, niektoré plochy vyfarbím a budem mať
počítač nakreslený. Potom vezmem tento počítač, nakreslím ho znova ale zmenšený do monitora toho väčšieho počítača. A hotovo.

Jazyk MetaPost-u som sa nijak zvlášť nepotreboval učiť - na moje požiadavky, až na pár základných vecí. Jazyk je podľa mňa
dosť divný. Myslím si, že väčšina populárnych programovacích jazykov vychádza zo syntaxe C, ale jazyk MetaPost-u sa tomu veľmi
nedá prirovnať. Vychádzal som hlavne z [manuálu][5] a z nejakých [príkladov][18] a [ďalších príkladov][20]. 

Kód loga umiestnime do súboru s príponou `.mp`, teda napr. `logo.mp`. Základná štruktúra programu je nasledovná:


```metapost
prologues:=3;
outputtemplate:="%j-%c.svg";
outputformat:="svg";

beginfig(1);
  // ...
endfig;

end.
```

Takže vidíme, že príkazy musia byť zakončené bodkočiarkou. Prvé tri riadky som skopíroval z manuálu. Lepšie vysvetlenie
premennej `prologues` však nájdeme v [manuáli MetaPost-u][5]. Kladná hodnota okrem iného spôsobí orezanie obrázku
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

![Bedňa](/assets/img/logo-v-metaposte/case.svg)

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

![Hotové logo](/assets/img/logo-v-metaposte/logo.svg)

# Čo ďalej

No tak zdroj SVG máme - teraz môžme pokračovať tak, ako to robia ostatní. Napríklad, keďže MetaPost umožňuje písanie parametrických
makier, môžme si vygenerovať rôzne verzie loga pre webovú stránku. Napríklad - hlavné logo pre banner na úvodnej stránke, alebo
malé logo na hornú lištu, atď. Ak je viac rôznych verzií loga, alebo ak sme vytvorili celú sadu ikon či obrázkov takýmto spôsobom,
výsledné SVG súbory môžme zabaliť do web-fontu, napríklad pomocou [WebFont Generátora][13].

Taktiež, výsledné SVG treba pred použitím optimalizovať, čím sa redukuje veľkosť súboru. Môžme na to použiť napríklad program
[svgo][17].

Na záver - nemyslím si, že MetaPost je tou správnou voľbou pre všetky typy log, alebo ikon. Výhodu, ktorú prináša je
hlavne matematická presnosť, a možnosť využiť reálne dáta pri tvorbe obrázka. K dispozícii máme napríklad generátory
pseudonáhodných čísel (uniformné alebo normálne rozdelenie), riadenie presných uhlov natočenia kriviek, čím sa dajú vytvárať
veľmi zaujímavé tvary, cykly, podmienené vykonávanie, a makrá. MetaPost toho dokáže oveľa viac, avšak na to treba vedieť lepšie
jazyk MetaPost-u, ale často už aj algebraické vyjadrenie grafiky.

[1]: https://en.wikipedia.org/wiki/MetaPost
[2]: https://graphviz.gitlab.io/
[3]: https://www.gimp.org/
[4]: https://inkscape.org/en/
[5]: https://www.tug.org/docs/metapost/mpman.pdf
[6]: https://sk.wikipedia.org/wiki/Scalable_Vector_Graphics
[7]: https://en.wikipedia.org/wiki/Metafont
[8]: https://github.com/numixproject/numix-icon-theme
[9]: https://github.com/gilbarbara/logos
[10]: https://github.com/GNOME/gnome-icon-theme
[11]: https://github.com/snwh/paper-icon-theme
[12]: https://github.com/OrancheloTeam/oranchelo-icon-theme
[13]: https://www.npmjs.com/package/webfonts-generator
[14]: https://4vector.com/free-vector/b-w-cartoon-computer-base-monitor-clip-art-116384
[15]: https://texample.net/tikz/
[16]: https://www.latex-project.org/
[17]: https://github.com/svg/svgo
[18]: https://github.com/thruston/metapost-examples
[19]: https://vbmacher.github.io/emuStudio/
[20]: https://staff.fnwi.uva.nl/a.j.p.heck/Courses/mptut.pdf
