---
title:  Limity počítačov a myslenia (1/2)
date:   2018-12-24 11:27:00
categories: [Teoretická informatika, Filozofia]
tags: [gödel, hilbert, teorém nekompletnosti, paradox]
math: true
d3: true
author: peterj
description: Súvis matematiky a reality, alebo systematickým skúmaním všetkých možností aj tak nedôjdeme do všetkých kútov.
---

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

Počítač je mechanický stroj, podobne ako auto či lietadlo, avšak jeho funkcia nie je tak jednoznačne daná. Oproti iným
strojom sa počítače líšia tým, že sa dajú programovať a ich funkcia sa mení podľa toho, aký program počítač
"vykonáva". Z tohto pohľadu tak vznikajú zaujímavé otázky, napríklad - "čo sa nikdy nebude dať naprogramovať?"

Naprogramovať nejaký algoritmus na počítači znamená prepísať riešenie, ktoré máme v hlave vymyslené do formálneho
zápisu daného programovacieho jazyka. Inak povedané, programovací jazyk reprezentuje formálny systém, ktorý
má definované "symboly" (kľúčové slová, literály, riadiace prvky, atď.) a syntaktické pravidlá, ktoré definujú,
v akom poradí alebo v akých miestach je dovolené použiť aké-ktoré symboly.

Naprogramovať algoritmus teda znamená prepísať intuitívne chápanie tohto riešenia, ktoré máme v hlave, do
formálneho - syntakticky obmedzeného - zápisu. 

Keď sa nad tým zamyslíme, počítač intuitívne nechápe sémantiku (význam) toho,
čo robí. Každý program je pomocou kompilátora preložený do elementárnych krokov, ktoré počítač dokáže vykonať.
Tieto kroky sa nazývajú inštrukcie, a sú veľmi univerzálne. Sami o sebe teda ani neumožňujú pochopiť sémantiku celého
algoritmu, iba ak sa pozrieme na inštrukcie ako celok "zvonku". To však počítač nedokáže - pri vykonávaní programu počítač
vidí (zjednodušene) len jednu inštrukciu v čase. Postupne prechádza od prvej až k poslednej, a každú z nich *mechanicky*
(bez ďalšieho "rozmyslu") vykonáva.

Počítač je teda systém, ktorý je "uzavretý" - nevie mať "nadhľad". Nerozhoduje sa podľa metafyzického významu, intuitívneho chápania,
ktoré by prichádzalo [apriórne][59]. Je obmedzený len na to, čo je definované v počítači samotnom.

# Synax a sémantika

Vo všeobecnosti vo svete existujú dve druhy právd - syntaktická a sémantická pravda. Syntax jazyka obmedzuje
možnosti toho, čo v jazyku vieme vôbec vyjadriť. Podľa toho, ako "voľná" je syntax, tak "zložité" výroky vieme
povedať v tomto jazyku. Ak porušíme syntaktické pravidlá, výroky prestávajú dávať zmysel. *Syntaktická pravda*
je teda vyjadrenie, či výrok dáva alebo nedáva zmysel. Napríklad výrok "bude" sám o sebe zmysel nedáva, pretože syntakticky
chýbajú podmet a prísudok. 

*Sémantická pravda* hodnotí pravdivosť výroku už využitím jeho významu. Avšak na to, aby sa dal pochopiť význam výroku, musí byť tento výrok už syntakticky validný (syntakticky pravdivý). Napríklad, výrok "dnes je pekne" už umožňuje zamýšľať sa o
jeho pravdivosti, pretože syntakticky dáva zmysel. Teda každý sémanticky pravdivý výrok musí byť pravdivý aj syntakticky, ale naopak
to platiť nemusí.

Ak by sme chceli napísať všetko sémanticky pravdivé, čo vo svete platí, môžme sa o to pokúsiť systematickým spôsobom. Ako by však mal vyzerať takýto systematický spôsob? Na to, aby sme nejaký našli, alebo prehlásili, že to nejde, sa potrebujeme zamyslieť nad sémantickou "pravdou" samotnou - čo to je "pravda"?

Intuitívne chápeme pravdu ako výrok, ktorý "platí". Ale výrok môže platiť len **relatívne** - tj. len vo svete, ktorý poznáme. Existujú ale výroky, ktoré platia aj **absolútne** (objektívne)? Na túto otázku existujú rôzne odpovede a názory, ktoré vyústili do filozofických smerov, ako napríklad pozitivizmus, formalizmus a realizmus.

# Naša realita - formálny systém

Keď sme rozoberali možnosť existencie relatívnej pravdy, logicky by mohli existovať niekoľko rôznych "svetov", a v každom z nich budeme vedieť odvodiť jemu vlastné výroky a zamýšľať sa nad ich pravdivosťou v danom svete. Takýto "svet" sa medzi formalistami začal nazývať [formálny systém][38].

Formálny systém definuje "svet", v ktorom môžme tvoriť výroky a odvodzovať jednoduchšie výroky do zložitejších. Na tvorbu a odvodzovanie výrokov systém definuje presné pravidlá. Vo všeobecnosti má definované:

- symboly,
- povolené spôsoby dedukcie (pravidlá odvodzovania),
- axiómy (zapísané len pomocou symbolov a pravidiel odvodzovania).

Axiómy tvoria základné pravdy, ktoré už nie je možné rozložiť na ešte "základnejšie" pravdy. Je to "základ sveta", jeho "definícia".
Tým, že sa jednotlivé formálne systémy líšia - majú rôzne axiómy, symboly a pravidlá odvodzovania, tak každý systém svojim spôsobom definuje svoju relatívnu sémantickú pravdu.

Sémantickú pravdu vo formálnom systéme vieme mechanicky odvodiť - teda dokázať, či daný výrok je pravdivý, alebo nepravdivý. Majme teda výrok X, ktorý je v danom formálnom systéme syntakticky validný. Jeho pravdivosť vieme dokázať tak, že sa pokúsime "znovuobjaviť" tento výrok:

1. aplikáciou povolenéných pravidiel odvodenia na axiómy, čím vzniknú prvé zložené výroky
2. Porovnáme nový výrok s výrokom X. Ak sú výroky zhodné, prehlásime X za pravdivý.
3. Pokračujeme aplikáciou pravidiel odvodenia na zložené výroky, čím vytvárame ďalšie výroky
4. Opakujeme body 2 až 3 dovtedy, kým sme neodvodili všetky možné výroky, alebo nenašli zhodu s výrokom X.
   Ak po vygenerovaní všetkých výrokov sme stále nedospeli k výroku X, tak je výrok X nepravdivý.

Pri troche šťastia sa nám podarí odvodiť výrok, ktorého pravdivosť chceme zistiť. Ak sa to podarí, tak výrok môžme prehlásiť
za "sémanticky pravdivý" v danom formálnom systéme. Samozrejme, je dôležité odvodzovať výroky systematicky, aby v tom nebol
chaos.

Formálny systém je zaujímavá abstrakcia aj preto, lebo podľa toho, akú "voľnosť" dávajú pravidlá odvodzovania, takú "vyjadrovaciu silu"
daný formálny systém má. Ak je formálny systém dostatočne silný (napríklad umožňuje odvodiť aritmetiku - pravidlá počítania), paradoxne
prestane ponúkať možnosť odvodiť všetky sémantické pravdy. Inými slovami, existujú výroky syntakticky validné v tomto formálnom systéme,
ktoré z formálneho systému nebudeme vedieť odvodiť - teda ich nebudeme vedieť dokázať.

Ak zhrniem najdôležitejšie doterajšie poznatky:

- Syntaktická správnosť (pravda): je vždy mechanicky overiteľná
- Sémantická správnosť (pravda): nie je vždy mechanicky overiteľná v rámci formálneho systému, ale mimo neho (a intuitívne) áno

# Čo teda počítač vedieť nebude

Intuitívne - počítačom budeme vedieť naprogramovať len problémy, ktoré nebudú vyžadovať intuitívne chápanie. Teda všetko
to, čo sa dá vypočítať "mechanicky", len slepým nasledovaním pravidiel "formálneho systému".

Toto tvrdenie je dôležité preto, lebo sa ukazuje, že to, čoho je sémantika schopná pochopiť intuitívne, tvorí "väčšiu množinu"
než to, čoho je možné dosiahnuť mechanickým odvodzovaním (vykonávaním). Inými slovami, vieme vytvoriť výroky, ktoré sa mechanickým
odvodzovaním nedajú odvodiť, ale predsa sú syntakticky validné a sémanticky pravdivé.

Jednými z prvých prelomovýmých aktérov v dokazovaní týchto tvrdení boli [Kurt Gödel][6] a [Alan Turing][7]:

1. Gödel ako logik a [metamatematik][60] ukázal, že v určitých formálnych systémoch existujú výroky, ktoré sú pravdivé, ale nedajú
   sa dokázať (vytvoril taký výrok a poskytol dôkaz jeho "nedokázateľnosti") ([Teorém nekompletnosti][39])
2. Turing zas dokázal, že sa nedá nájsť ani žiadny mechanický proces (algoritmus), ktorý by vo všeobecnosti vedel buď dokázať
   daný výrok, alebo skončiť s tým, že je výrok "nedokázateľný" ([Entscheidungsproblem][3])

# Začiatky - Matematická kríza a Hilbertov program

Pred rokom 1900 vedci postupne začali dôverovať sile "metódy" a racionalite. Devätnáste storočie prinieslo mnoho prelomových
teórií a objavov, ale mnohé ostali stále neobjasnené. Detaily a zložitosť, ktoré nové objavy začali prinášať, sa niektorým vedcom začali
javiť ako predzvesť akéhosi limitu možností ľudského chápania (namiesto optimizmu k ďalším objavom).

Jedným z nich bol nemecký fyziológ Emil du Bois-Reymond, ktorý napísal knihu [Über die Grenzen des Naturerkennens][31], v ktorej popularizoval
sedem "svetových hádaniek". Tri z nich (prvú, druhú a piatu) označil za vedecky aj filozoficky neriešiteľné:

1. ultimátna podstata hmoty a sily
2. pôvod pohybu
3. pôvod jednoduchých ľudských zmyslov

Argumentom však bol iba obyčajný agnosticizmus. Emil tvrdil, že ide o "[transcendentné otázky][32]" (mimo možností chápania človeka).
Na konci každej "otázkovej" kapitoly oznámkoval kurzívou napísané latinské slovo *Ignorabimus* (nebudeme vedieť). Toto slovo nakoniec Emil použil aj vo svojej slávnej reči pred Pruskou akadémiou vied vo výroku [ignoramus et ignorabimus][19]:

> Nevieme a nebudeme vedieť.

Tomuto prístupu sa postavil na odpor (svojej doby asi najslávnejší) nemecký matematik [David Hilbert][20], ktorý bol zhodou okolností jedným z prvých propagátorov používania formálnych systémov. Hilbert bol veľmi citlivý na tento *Ignorabimus* aj preto, lebo matematika začiatkom 20. storočia prežívala vážnu [krízu][37], z ktorej bol Hilbert frustrovaný. Hilbert však veril, že je možné nájsť riešenie a preto nechcel slepo prijať ignoranciu.

Kríza spočívala hlavne v tom, že samotné základy vtedajšej matematiky - naivná teória množín, umožňovala tvorbu paradoxov - teda výrokov, ktoré platia a neplatia zároveň. Nebezpečie spočíva v tom, že ak tvrdenie `P` platí aj neplatí, pravidlo [modus ponens][41] (z `P` vyplýva `Q`) nám umožní odvodiť prakticky čokoľvek, aj nepravdivé výroky a celá matematika sa tak zrúti ako domček z karát.

Táto kríza doviedla Hilberta ku spísaniu 23 dovtedy známych [matematických problémov][21], ktoré odprezentoval na Parížskom kongrese
v roku 1900. Tam vyzval matematikov, ako svoju armádu, k ich riešeniu. V roku 1932, keď odchádzal do dôchodku, zhrnul svoju záverečnú reč aj [v rádiu][33], kde okrem iného povedal:

> Nesmieme veriť tým, ktorí dnes s oporou filozofie a nadradeným tónom predpovedajú úpadok kultúry a akceptujú Ignorabimus.
> Pre nás nie je žiadny Ignorabimus, a podľa mňa ani v žiadnej prírodnej vede. Namiesto hlúpeho Ignorabima nech náš slogan znie:
>     Musíme vedieť.
>     Budeme vedieť.


{% include embed/audio.html src='https://www.maa.org/sites/default/files/images/upload_library/46/Hilbert-radio/HilbertRadio.mp3' %}

Niektoré príklady [Hilbertovho programu][61]:

- Dokázať hypotézu kontinua: že neexistuje množina, ktorej kardinalita by bola presne medzi množinou prirodzených a reálnych čísel
- Dokázať konzistenciu axiómov aritmetiky len v rámci formálneho systému aritmetiky
- Nájsť algoritmus, ktorý pre každú Diofantickú rovnicu odpovie, či táto rovnica má alebo nemá riešenie, keď sa za neznáme dosadia len celé čísla

# "De-paradoxizácia"

Už [Aristoteles][51] (4. stor. pred n.l.) si všimol, že vo vetách sú dôležité len určité slová, a zvyšok nemá vplyv na
"logickosť" výroku, ktorý sa tak dá nahradiť premennými. Avšak prvé pravidlá odvodzovania výrokovej logiky, o ktorej v podstate hovoríme,
objavili nezávisle na sebe v úplne rôznych historických obdobiach [Chrisippus][50] (3. storočie pred n.l.), Peter Abelard (12. storočie),
Gottfried Leibniz (17-18. storočie), s ďalšími rozšíreniami od Georgea Boola a Augusta De Morgana.

Až [Gottlob Frege][22] prišiel s jeho [logikou prvého rádu][9] (predikátovou logikou), ktorú definoval pomocou [naivnej teórie množín][23]
([Cantor][24]). Predikátová logika pridáva možnosť použitia všeobecných kvantifikátorov a ukázal, že pomocou nej je možné formálnym spôsobom
zapísať axiómy aritmetiky, čo bol veľký krok k ďalšej formalizácii.

Frege očakával [tri predpoklady dobrej matematickej teórie][40]:

1. je konzistentná: nemožnosť dokázať protichodné tvrdenia
2. je úplná: každý výrok je buď dokázateľný alebo zamietnuteľný (tj. jeho negácia je dokázateľná)
3. je rozhodnuteľná (existuje "rozhodovacia procedúra", ktorá dokáže overiť pravdivosť každého výroku)

Avšak Fregeho logika s rozšírením o pravidlá aritmetiky bola nekonzistentná. Prišiel na to aj [Bertrand Russel][12], ktorý
vytvoril "paradoxnú" množinu, známu aj pod názvom [Russelov paradox][2]:

> Zostrojme množinu, ktorá obsahuje všetky množiny neobsahujúce samých seba.

Patrí práve definovaná množina do samej seba? Ak nie, tak by tam patriť mala - podľa definície. Ak ju tam však pridáme,
tak by obsahovala samu seba a teda - podľa definície - by sme ju mali odobrať. Takáto množina sa nedá zostrojiť,
ide o logický paradox.

A práve kvôli paradoxom sa veľa diskutovalo o vzťahu matematiky a reálneho sveta:

- Je matematika len výplodom ľudskej predstavivosti? (čo by mohlo znamenať, že paradoxy sú tiež len výplody ľudskej predstavivosti a nemá zmysel
  sa nimi zaoberať), 
- Alebo popisuje matematika reálny svet? (čo by znamenalo, že paradoxy sú dôležitými ukazateľmi toho, že niečo nechápeme správne)

Na základe týchto a podobných otázok vznikali rôzne názorové smery, hlavne formalizmus, intuicionizmus a logicizmus:

<div id="crisis"></div>

<script src="{{ site.baseurl }}{% link assets/js/limity-pocitacov/chart.js %}"></script>
<script>
var data = {
  "name": "Kríza",
  "children": [
    {
      "name": "Formalizmus",
      "children": [
        {
          "name": "David Hilbert",
          "children": []
        },
        {
          "name": "Rudolf Carnap",
          "children": []
        }
      ]
    },
    {
      "name": "Intuicionizmus",
      "children": [
        {
          "name": "L.E.J. Brouwer",
          "children": []
        },
        {
          "name": "Arend Heyting",
          "children": []
        },
        {
          "name": "Andrey Kolmogorov",
          "children": []
        }
      ]
    },
    {
      "name": "Logicizmus",
      "children": [
        {
          "name": "Richard Dedekind",
          "children": []
        },            
        {
          "name": "Bertrand Russel",
          "children": []
        },
        {
          "name": "Ludwig Wittgestein",
          "children": []
        },
        {
          "name": "Gottlob Frege",
          "children": []
        },
        {
          "name": "Pozitivizmus",
          "children": [
            {
              "name": "Moritz Schlick",
              "children": []
            },
            {
              "name": "Hans Hahn",
              "children": []
            },
            {
              "name": "Rudolf Carnap",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "Realizmus",
      "children": [
        {
          "name": "Kurt Gödel",
          "children": []
        },
        {
          "name": "Albert Einstein",
          "children": []
        }
      ]
    }
  ]
};
document.getElementById('crisis').appendChild(chart(data, [
  "David Hilbert", "Gottlob Frege", "Kurt Gödel", "Bertrand Russel"
]));
</script>

K vyššie uvedenému "stromu" treba povedať, že sa niektorí matematici ťažko radia do jedného vyhradeného smeru, pretože
svojou prácou prispeli k viacerým smerom. Taktiež, matematický realizmus ako taký nevznikol ako priama odpoveď na
otázku krízy, existoval už dávno predtým ako presvedčenie, že matematika sa nedá oddeliť od intuitívneho (reálneho) sveta.

# Principia Mathematica

Jedným z cieľov formalistov, hlavne Hilberta, bolo "sformalizovať" celú dovtedy známu matematiku, pretože formalisti zastávali názor,
že dôvod možnosti vzniku paradoxov je dovolenie definovania axiómov intuitívne. Formalisti verili, že pravdy v matematike sú
konzistentné a úplné, ak ich vieme odvodiť len z formálneho systému, ktorý obsahuje, ako som už uviedol - premenné, axiómy (zapísané v jazyku
tohto systému a nie intuitívne) a pravidlá na manipuláciu s axiómami.

Tento cieľ vyžadoval vytvorenie jednotného formálneho jazyka ([notácie][27] a [deduktívneho systému][26]), v ktorom by bolo
možné nielen matematiku zapísať, ale aj odvodiť všetky dôkazy tvrdení. Jazyk by mal spĺňať vlastnosti dobrej matematickej
teórie, ako ich definoval Frege (konzistencia, úplnosť a rozhodnuteľnosť).

Matematici [Betrand Russel][12] a [Alfred Whitehead][13] sa chopili tohto problému, pretože verili, že [Fregeho][22] [logika prvého rádu][9]
by mohla byť použitá ako základ, s "drobnými úpravami". Tieto "drobné úpravy" spočívali v nahradení
naivnej [Cantorovej][24] [teórie množín][23] z Fregeho logiky niečim iným - dobrým [axiomatickým systémom][25]; ako vhodné sa
javili [Peanove axiómy][28] aritmetiky.

Russel s Whiteheadom si mysleli, že majú všetko potrebné už pripravené, stačí to len "dať do kopy".

Začali písať trojzväzkovú knihu s názvom [Principia Mathematica][11] (roky 1910, 1912, 1913). Napísať prvý zväzok trvalo
však [príliš dlho][14], Russelovi sa stále nedarilo odvodiť všetky dôkazy len z týchto axiómov a logickej dedukcie. Nakoniec ho
Whitehead prinútil knihu vydať tak ako je. Zaujímavosťou tejto knihy je napríklad dôkaz (so všetkým potrebným na zhruba 300
strán), že $$1 + 1 = 2$$:

![Proof](/assets/img/limity-pocitacov/proof.png){: w="550" }

O chýbajúcom dôkaze konzistencie axiómov aritmetiky sa už vedelo, dôkaz požaduje Hilbert v jeho [druhom probléme][35], ale
každý to považoval len za "formalitu", ktorú treba spraviť. 

# Teorém nekompletnosti

[Kurt Gödel][6] prišiel v roku 1929 s tzv. [teorémom úplnosti predikátovej logiky][17], v ktorom dokázal, že Fregeho klasická predikátová
logika (bez rozšírenia o aritmetiku) je úplná. To znamená, že mechanickou procedúrou (algoritmom) vieme odvodiť všetky pravdivé výroky
tejto logiky.

A tak Gödel pokračoval v práci na druhom Hilbertovom probléme - konzistencii aritmetiky. Počas tejto práce objavil jeho najslávnejší
teorém: [teorém nekompletnosti][39] (publikoval ho roku 1931). Boli to v podstate dva teorémy, no z prvého vyplýva druhý:

> Žiadny konzistentný systém axiómov, dostatočne silný na odvodenie aritmetiky a ktorého výroky vieme systematicky odvodiť, nie je
> schopný dokázať všetky pravdivé výroky

A druhý teorém:  

> Takýto systém nemôže dokázať vlastnú konzistenciu. 

Gödel odvodil tento teorém zo snahy formálne zapísať variantu [paradoxu klamára][44] (jeden z najstarších paradoxov vôbec):

- *Jeden Kréťan povedal, že všetci Kréťania sú klamári.*  ... Klame či neklame tento Kréťan?
- Iný variant: *Holič holí len mužov, ktorí neholia samých seba.*    ... Má sa teda holič sám oholiť, či nie?
- Gödel použil tento variant: *Tento výrok je nedokázateľný v rámci tohto formálneho systému*

Tento výrok sa mu podarilo zapísať len v symboloch formálneho systému. Vytvoril teda autoreferenčný výrok, ktorý je syntakticky validný.
V druhom kroku dokázal, že systematickým spôsobom nie je možné odvodiť z axiómov formálneho systému tento výrok, ale ani jeho negáciu.
Z toho vyplýva, že ide o pravdivý výrok - ale vieme to len podľa našej intuície, pretože hovorí pravdu - nedokázali sme odvodiť ani výrok,
ani jeho negáciu, teda *nie je ho možné dokázať v rámci tohto formálneho systému*.

Konzistenciu formálneho systému, ktorý má silu na odvodenie aritmetiky sa nakoniec podarilo dokázať, ale pomocou iného formálneho systému.
Dokázal ju [Gentzen][63] v roku 1936. 

Dôsledky tohto teorému sú veľmi závažné, pretože z neho vyplýva, že v čisto formálnej matematike môžu existovať výroky, ktoré budú pravdivé,
ale nebudú sa dať dokázať (ako si napr. myslel aj [strýko Petros o Goldbachovej domnienke][42] :). Gödel tento výsledok prezentoval na matematickej
konferencii v [Kráľovci][46], na ktorej bol aj [John von Neumann][45]! A bol to jediný z prítomných, ktorý si tento výsledok dal do súvislostí a
prehlásil: ["it's all over"][29].

Von Neumann bol jedným z hlavných propagátorov Gödela a jeho výsledkov a vďaka nemu sa Gödel mohol dostať na [IAS][47], kde pôsobil aj
Albert Einstein a iní významní matematici a fyzici.

# Entscheidungsproblem

David Hilbert sa nikdy nevyjadril ku Gödelovemu výsledku. Podľa [niektorých indícií][43] prežíval Hilbert hnev a frustráciu.
Avšak - podľa Fregeho "dobrej matematickej teórie" ešte stále chýbal dôkaz rozhodnuteľnosti, známy pod názvom ["Entscheidungsproblem"][3].
Tento problém Hilbert formuloval ešte pred objavom teorému nekompletnosti, roku 1928, takto:

> Nájsť všeobecný algoritmus, ktorý by na vstupe dostal formálny výrok a výstupom by bola
> odpoveď typu "Áno"/"Nie" (rozhodnutie), či je výrok univerzálne (vo všeobecnosti) pravdivý.

Programátorom môže Entscheidungsproblem pripomínať problém známy ako ["SAT" (Boolean satisfiability problem)][4],
ktorý sa dá formulovať nasledovne:

> Je možné nájsť také hodnoty premenných daného formálneho výroku, aby výrok platil?

Rozdiel teda spočíva v tomto:

- V Hilbertovom probléme hľadáme všeobecnú odpoveď pre všetky možné hodnoty premenných. Inak povedané,
  snažíme sa redukovať výrok na hodnotu "True" alebo "False" bez dosadzovania konkrétnych hodnôt
  za premenné,

- V SAT probléme hľadáme také hodnoty premenných, aby výrok v tejto jednej inštancii platil,
  ale nemusí platiť pri iných hodnotách premenných. Hľadáme teda odpoveď "v jednej inštancii".

# Záver

V tejto prvej časti môjho príspevku som sa snažil priblížiť pozadie filozofického a matematického sveta
na začiatku 20. storočia, ktoré viedlo k veľkému matematicko-filozofickému objavu. Tento objav, teorém nekompletnosti,
dáva do súvislosti dedukciu, logiku a filozofiu. Popiera matematický relativizmus, prúd, ktorý je aj dnes ešte dosť
populárny pod pojmom - "všetko je relatívne".

Matematici 20. storočia ako napr. Hilbert a potom hlavne pozitivisti, verili v myšlienku "relativizmu" - matematika je
len dielom, výtvorom, človeka, a ako myšlienkový nástroj má málo spoločné s reálnym svetom. Gödel naopak veril, že
matematika s reálnym svetom súvisí a nie je ju možné od neho oddeliť. Práve teorém nekompletnosti vyjadruje tento vzťah.
Existencia diskrétnych a počitateľných objektov v tomto svete, ak existujú izolovane len v tomto svete, sú podľa Gödela
paralelou ku axiomatickému systému aritmetiky. Tým pádom, nadnesene povedané, je možné, že reálny svet skrýva pravdy,
ktoré nikdy nebudeme vedieť pochopiť.

V druhej časti článku sa budem zaoberať problémom rozhodnutia, známym pod názvom Entscheidungsproblem. Popíšem hlavne
prácu Alana Turinga, ktorý "konečne dobre definoval algoritmus".









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
[59]: https://cs.wikipedia.org/wiki/Immanuel_Kant#Metafyzika
[60]: https://sk.wikipedia.org/wiki/Metamatematika
[61]: https://en.wikipedia.org/wiki/Hilbert%27s_program
