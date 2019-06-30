---
layout: post
title: Elm vs. Haskell
categories: [Funkcionálne programovanie]
tags: [elm, haskell, web]
date: 2018-08-29 00:48:00
---


Minulého roku cez Vianoce som sa trochu pohrával s programovacím jazykom Elm. Ide o funkcionálny jazyk na písanie webových frontendov alebo aj backendov, ktorý kompiluje do Javascriptu. Je zaujímavý hlavne v tom, že jeho syntax a aj spôsob práce je veľmi podobný tomu v Haskelli (o ktorom poviem o chvíľu), a sám je v ňom aj napísaný.




* content
{:toc}

Napríklad, tu sú dve hry v elm-e: [flatris](https://github.com/w0rm/elm-flatris), alebo [mario](https://github.com/avh4/elm-mario).

Prečo by to človeka malo vôbec zaujímať? Tí, ktorí poznajú funkcionálne programovanie a Haskell, budú určite nadchnutí, a prekvapení. Haskell je totiž statický a silne typový jazyk, ktorého hlavné vlastnosti sú nemodifikovateľnosť dát (immutability), [referenčná transparentnosť](https://en.wikipedia.org/wiki/Referential_transparency), ďalej že funkcie sú sami hodnotami, ktoré si môžme uložiť do premennej, kde je rekurzia veľmi obľúbená technika a že vďaka lenivému vyhodnocovaniu (lazy evaluation) môžme pohodlne pracovať aj s nekonečnými štruktúrami. Väčšinu týchto vlastností má aj Elm, čím sa možno snaží nájsť to ultimátne riešenie na [krízu v Javascripte a jeho problémov](http://www.breck-mckye.com/blog/2014/12/the-state-of-javascript-in-2015/).

Mám dojem, akoby tie zložitejšie veci v Haskelli sa Elm vypúšťa, alebo skôr sa pokúša nájsť iný, jednoduchší spôsob ako ich riešiť. Napríklad nemáme funktory, alebo monády ako explicitné abstrakcie, a ani typové triedy. To na jednej strane vyvoláva pocit sklamania, že Elm nie je až tak ďaleko čo sa týka typových možností aké má Haskell. Na druhej strane, Haskell vie nielen začínajúcim programátorom pekne zamotať hlavu. 

Keďže Elm je určený hlavne na programovanie front-endu, pravdepodobne by mal vedieť osloviť Javascriptárov. A keďže Javascript nie je zložitý jazyk, asi by nemal byť ani Elm. Aj z tohto uhlu pohľadu je zaujímavé sledovať, ktoré rysy jazyka Haskell autori Elm-u považujú za dostatočne jednoduché, prípadne akú inú stratégiu volia, keď sa rozhodujú o preberaných vlastnostiach či rysoch.

Elm si myslím zatiaľ nezaslúži konečný verdikt, pretože jeho čas na produkciu ešte nenastal. V tomto čase je ešte len vo verzii 0.19 a dosť rapídne sa mení. Určite aj to je dôvod, prečo samotný jazyk a jeho hlavná - štandardná knižnica ešte nemá tak veľké portfólio featur. V súčasnosti už existuje množstvo uživateľských komponentov a knižníc, ktoré sa dajú pohodlne nájsť [tu](https://package.elm-lang.org/). Avšak, keďže na medziverzovú kompatibilitu sa zatiaľ nedá spoľahnúť, veľa používateľských balíčkov v najnovšej verzii Elm-u zatiaľ nefunguje. Najpopulárnejšia a najviac fungujúca verzia je v tomto čase 0.16 a postupne sa prechádza na 0.17.

Podpora v jednotlivých IDE je ziatiaľ len základná, ale postačuje. Zvýrazňovanie syntaxe je podporované v IntelliJ IDEA, aj v Eclipse. Netbeans zatiaľ Elm nepodporuje. Ja som používal editor Atom, ktorý má zatiaľ snáď najväčšiu podporu pre Elm. Ak by niekto chcel použiť ViM, tiež má možnosť.

O váš projekt sa stará príkaz `elm-package`, cez ktorý si vieme nainštalovať aj odinštalovať ľubovoľný dostupný balíček. Balíčky sa inštalujú do zvláštne pomenovaného podadresára `elm-stuff` a do projektového súboru. Tento má formát JSON, ktorý okrem zoznamu všetkých závislostí a rozsahu povolených verzií, obsahuje metadáta ako názov projektu, verziu, popis, atď.

Okrem programu na správu projektu má Elm aj vlastný [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) - `elm-repl`, kde si Elm môžeme vyskúšať v interaktívnom režime. Program `elm-reactor` zas vie vytvoriť lokálny server s voliteľnou IP adresou a portom, pomocou ktorého vieme náš program debugovať.

Samozrejmou súčasťou je Elm kompilátor, ktorý vie vytvoriť či už HTML súbor s výsledným Javascriptom, alebo len čistý Javascript. A tiež Elm že vraj dobre interoperuje s Javascriptom ako takým, je možné ho začleniť do ľubovoľného webového projektu.

# Letmé oťukanie

Nemôžem povedať, že som sa Elm kompletne naučil, ani že viem bez problémov programovať v Haskell-i. S Haskellom mám skúsenosti len v rámci voľného času a to tak zhruba rok. S Elm-om som prišiel do styku len tieto Vianoce. Preto moje prvé dojmy určite nepovažujte za kompletnú sadu rozdielov a podobností, skôr tu chcem vypichnúť veci, na ktoré som narazil.

V Elm-e som robil len jeden maličký projektík, a tým je trochu modifikovaná hra Game of Life. Jej zdrojový kód nájdete [tu](https://github.com/vbmacher/learning-kit/tree/master/toy-projects/game-of-life). Modifikácia spočívala v tom, že mriežku mám hexagonovú, a pravidlá hry sú B2/S3,4,5. To znamená, že bunka sa narodí ak má presne dvoch susedov, a prežije ak má od troch do piatich susedov. V iných prípadoch bunka zomrie, alebo ostane mŕtva. Hru si môžte vyskúšať aj priamo tu:


<iframe src="{{ 'js/elm-vs-haskell/gol.html' | absolute_url }}" width="700" height="450" style="border:none;overflow:hidden;"></iframe>


Na mojej niekoľkodňovej ceste, okrem zaujímavej zábavy a vlastne aj úspechu, sa chcem podeliť hlavne s určitými vlastnosťami a rozdielmi, aby som upozornil Haskellákov a trochu uviedol na pravú mieru ich očakávania. Tak sa do toho pusťme.

# Rekurzívne dátové typy

V Haskell-i sa často používajú tzv. rekurzívne dátové typy. Napríklad, ak chceme vytvoriť dátovú štruktúru double linked-list. To je taký linked-list, v ktorom každá položka má okrem nasledovníka aj odkaz na svojho predka.

V Haskell-i sa double linked-list dá vytvoriť napr. takto:

```haskell
  data List a = Cons a (List a) (List a) | Nil

  makelist [] _ = Nil
  makelist (x:xs) prev = let
      cur = Cons x prev (makelist xs cur)
```

Premenná `cur` je rekurzívna premenná, ktorá je výsledkom funkcie `makelist`. Jej hodnotou je zoznam, ktorý je tvorený prvým prvkom vstupného zoznamu,
predchádzajúcim prvkom a zoznamom vytvoreným rekurzívnym spôsobom zo zvyšku vstupného zoznamu a ďalšieho "prev" prvku, čo je vlastne zoznam, ktorý
práve teraz tvoríme (`cur`). Toto ide v Haskell-i, bohužiaľ to nejde v Elm-e.

Narazil som na to, keď som rozmýšľal o reprezentácii herného plánu. Keď chceme reprezentovať herný plán vo funkcionálnom jazyku, môžme to urobiť niekoľkými spôsobmi. Jeden z obľúbených spôsobov je aplikovať lenivé vyhodnocovanie (lazy evaluation) aj v samotnej dátovej štruktúre. To znamená, že je možné vytvoriť dátovú štruktúru tak, aby dynamicky zväčšovala svoju kapacitu či "dosah" podľa potreby. Napríklad v prípade hry Game of Life, môžme túto dátovú štruktúru zostaviť ako graf vzájomne susediacich políčok:

```haskell

  data Board = Node
             { w :: Board, nw :: Board
             , n :: Board, ne :: Board
             , e :: Board, se :: Board
             , s :: Board, sw :: Board
             } | Nil

  newBoard = Node
           { w=Nil, nw=Nil, n=Nil, ne=Nil
           , e=Nil, se=Nil, s=Nil, sw=Nil }

  makeWest board =
    let new = newBoard { e = board }
    in board { w = new }

  ...
```

Takto môžme herný plán rozširovať dokedy chceme, a to ľubovoľným smerom. Využitím techniky [zipperov](http://learnyouahaskell.com/zippers) sa vieme po pláne pohybovať efektívne. Ale toto sa dá len v Haskell-i. Bohužiaľ, v Elm-e to zatiaľ nenapíšeme.

# Škaredé nekonzistencie

Ja viem, že ide o nový jazyk, ale niektoré operátory, ktoré existujú v Haskell-i, ako napríklad `:` a `::`, existujú v Elm-e tiež, ale majú vymenený význam. Teda v Haskell-i operátor `::` oddeľuje názov funkcie od definície jej typu, a operátor `:` je konštruktor zoznamu. V Elm-e je to naopak. Príklad:

Haskell:

```haskell
  prepend :: Char -> String
  prepend x xs = x:xs
```

Elm:

```haskell
  prepend : Char -> String
  prepend x xs = x::xs
```

Hovorím si, že syntax v tomto prípade možno prevzal od Scaly, kde je to tiež takto. Ale je to divné, výhodu v tom nevidím.

# Typové triedy

V Haskell-i som často zvyknutý vytvárať dátové typy a ich podporu typovými triedami, ktorých implementáciu vie Haskell sám odvodiť.
Napríklad:

```haskell
  data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Ord)
```

hodnoty typu `Day` dokážeme porovnávať, pretože je automaticky odvodený od typovej triedy `Ord`. V tomto prípade platí
`Mon < Tue < Wed < ... < Sun`. Podobne, existujú typové triedy `Show`, `Eq`, `Bounded`, a iné. Avšak z tejto featury sa môžme tešiť zatiaľ
len v Haskell-i; Elm bohužiaľ [vôbec nemá typové triedy](https://github.com/elm/compiler/issues/1039). Tie sa však dajú simulovať pomocou
[record syntaxe](http://elm-lang.org/docs/records), ako sa to popisuje napríklad v
[tomto článku](http://www.haskellforall.com/2012/05/scrap-your-type-classes.html).

# Higher-kinded typy

Elm ich [bohužiaľ nepodporuje](https://github.com/elm/compiler/issues/396). To napríklad implikuje, že nie je možné napísať:

```haskell
type Functor f = { map : (a -> b) -> f a -> f b }
```

Typ `f` má kind `* -> *`, teda napr. v Scale je to generický typ `T[_]`. 
 
# List comprehension

Mnohí list comprehension zrejme poznajú z Pythonu, ktorý funguje aj v Haskell-i (trochu krajšie):

```haskell
[ (x,y) | x <- 0..10, y <- 0..10 ]
```

Jedná sa o peknú syntax, ktorú rád využívam, a sklamalo ma, keď som zistil, že [Elm ju nepodporuje](https://github.com/elm/compiler/issues/147).
Odkazujú sa na [Haskell style guide](https://wiki.haskell.org/Programming_guidelines#List_Comprehensions), v ktorom odrádzajú od používania List comprehension a miesto toho navrhujú použiť `map` či `fold`. Ale nerozumiem prečo.

# Divný List range 

Keď chceme v Haskell-i vygenerovať zoznam v nejakom rozsahu, jazyk nám poskytuje príjemnú syntax, napríklad zoznam prvkov od 1 do 10 vieme
zapísať ako:

```haskell
  [1..10]
```

prípadne pre len párne čísla ako

```haskell
  [2,4..10]
```

Elm na to syntax nemá a tak sme nútení použiť funkciu:

```haskell
  List.range 1 10
```

ktorá nemá variant pre krok, takže zoznam párnych čísel sme nútení napísať takto škaredo:

```haskell
  List.range 1 10 |> filter (\n -> n % 2 == 0)
```

# Nekonečné polia

Tiež neexistuje možnosť definovať nekonečné polia. Našiel som [nejaký balíček](https://package.elm-lang.org/packages/TheSeamau5/elm-lazy-list/latest/Lazy-List),
ktorý obsahuje "nekonečnú variantu" funkcie `repeat`, ale nie s krokom. Bolo to trochu sklamanie,
ale je možné to samozrejme doprogramovať ručne.

# Použitie apostrofov v názvoch premenných

Z Haskell-u som zvyknutý používať apostrofy ako ďaľšie "verzie" premenných rovnakého mena, napr.:

```haskell
  (w , h)  = (1,2)
  (w', h') = (w+1, h+1)
```

Všimol som si, že apostrofy sa používajú aj vo väčšine učebníc či kníh o Haskell-i. A čo je najhoršie, Elm to do verzie 0.17 umožňoval použiť tiež. Avšak z mne nepochopiteľného dôvodu [zrušili podporu](https://github.com/elm-lang/elm-plans/issues/4) vo verzii 0.18.

# Kľúčové slovo `where`

Mám v Haskell-i vo veľkej obľube písať pomocné funkcie, ktoré používam len v kontexte jedinej funkcie. Väčšinou sa tieto pomocné
definície píšu až za telo hlavnej funkcie. Dôvodom je, že kód by podľa mňa mal pomocné "postavy" vyobraziť v poradí, v akom sa v našom
kódovom "románe" vyskytnú, teda v prvom rade ma zaujíma čo funkcia robí ako taká, a až potom jej pomocné funkcie. A sme zvyknutí čítať zhora
nadol, a nie naopak. Preto napríklad:

```haskell
  pack [] = []
  pack xs = ys:pack zs 
    where (ys,zs) = span (==head xs) xs
```

je funkcia, ktorá vytvorí zoznam zoznamov rovnakých položiek. Napríklad pre reťazec `"aaabb"` vráti funkcia zoznam `["aaa", "bb"]`. V Haskell-i je `String` samozrejme zoznam `Char`-ov, preto to vyzerá tak dobre. V Elm-e bohužiaľ nie. 

Ale k veci - Elm [nemá kľúčové slovo where](https://github.com/elm-lang/elm-compiler/issues/621) :( Elm obsahuje jedine syntax `let`, takže funkcia `pack` v Elm-e musí vyzerať takto (a musíme použiť [extra balíček](https://package.elm-lang.org/packages/circuithub/elm-list-extra/3.10.0/List-Extra), pretože `span` nie je štandardná funkcia):

```haskell
  import List exposing (head)
  import List.Extra exposing (span)

  pack xs = let
     (ys, zs) = span (== head xs) xs
    in ys::(pack zs)
```

ktorú však nemôžme použiť na `String`, pretože ako som už povedal, v Elm-e `String` nie je pole `Char`-ov:


```haskell
  pack (String.toList "aaabb")  
                  ==  [['a','a','a'], ['b','b']]
```

Dôsledkom je napríklad, že v Elm-e nemôžme napísať niečo ako

```haskell
  "ahoj " ++ "svet"
```

ale len

```haskell
  String.append "ahoj " "svet" 
```

Škoda.

# Viacnásobné definície

Elm neumožňuje niekoľkonásobné definície funkcie. Takže nie je možné definovať funkciu pre argument prázdneho poľa, a potom
definíciu pre neprázdne pole:

```haskell
empty [] = true
empty _ = false
```

Toto bohužiaľ Elm neskúsne.

# Infixová syntax binárnych funkcií

Tí, ktorí poznajú Haskell, iste poznajú aj tzv. infixový tvar binárnych funkcií, akou je napr. `div` či `mod`. Tieto príklady patria bohužiaľ
k nie celkom pekným, napr. operátor `/` je už rezervovaný na delenie desatinných čísel, a Haskell nepodporuje automatickú konverziu z celých čísel na desatinné. Avšak, keďže sme normálne zvyknutí používať operátor delenia (`/`) v infixovom tvare, Haskell nám to umožňuje, a to dokonca pre každú binárnu funkciu tak, že ju uzavrieme do spätných apostrofov, napr.:

```haskell
  4 `div` 2     == 2 
```

Elm túto syntax nepodporuje, avšak aspoň zavádza operátor celočíselného delenia `//`, takže v Elm-e bude príklad vyzerať takto:

```haskell
  4 // 2        == 2 
```

Aj keď Elm nemá v štandardnej knižnici často používanú funkciu `mod` (zvyšok po delení), má miesto toho operátor `%`,to je napríklad pekné.

# Prevádzanie dát do Stringu

Haskell má typovú triedu `Show`, ktorá umožňuje pre ľubovoľný typ definovať funkciu `show`, zodpovednú za prevod hodnoty tohto typu na `String`.
Funkcia `show` je podľa mňa notoricky známa a veľmi používaná funkcia. Avšak v Elm-e neexistuje. Miesto toho existuje mega-všeobecná implementácia `toString` v balíčku `Core.Basics`, implementovaná v [natívnom Javascripte](https://github.com/elm-lang/core/blob/5.0.0/src/Native/Utils.js) (nájdite si ju pomocou CTRL+F, pod názvom `function toString()`). Dôvodom je, že Elm nepodporuje higher-kinded typy.

# Funkcie zip, map

Neviem prečo, ale v Elm-e neexistuje funkcia `zip`. Miesto toho má Elm definované rôzne verzie funkcie `map`. Našťastie `zip` sa dá v Elm-e napísať ako

```haskell
  zip = List.map2 (,)
```

pričom `map2` je funkcia:

```haskell
  map2 : (a->b->c) -> List a -> List b -> List c
```

Okrem nej existujú funkcie `map3`, `map4`, ... až do `map8`. Tieto typy funkcií (vrátane napr. `fold`-ov) existujú aj pre iné dátové štruktúry,
napríklad pre asociatívne pole (mapu) `Dict`.

# Záver

Informácie v tomto článku prezentujú hlavne to, čo mi udrelo do očí v rámci implementácie mojej hry [Game of Life](https://github.com/vbmacher/learning-kit/tree/master/toy-projects/game-of-life); tiež len z hľadiska samotného porovnania programovania v Haskell-i a Elm-e. Neriešil som ani performance, ani všetky možné iné vlastnosti. Je možno škoda, že som neuviedol ako pekne je Elm pripravený na prácu s obrázkami, animáciami, a dokonca aj komunikáciou medzi serverom a klientom cez rôzne bežne používané protokoly.

Veľmi tiež vyzdvihujem tzv. ["Elm architecture"](https://guide.elm-lang.org/architecture/), ktorá od verzie 0.18 "núti" programátora písať programy v patterne podobnom MVC, ktorý však má časti Model, Update a View (a Subscriptions), takže je to skôr MUV(S) :)

Sám som veľmi zvedavý na ďalší progres Elm-u, a som zvedavý aký "tábor" programátorov si Elm vlastne "ochočí". Mám dojem, že snahou je, aby šlo hlavne o Javascriptárov, u ktorých je známe, s akou obľubou používajú a hlavne píšu stále [nové a nové frameworky](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f), aby to už konečne prestali robiť...

Elm teoreticky môže mať na to (ale asi až za nejaký čas) unifikovať a spojiť tie najsilnejšie featury web developmentu takým spôsobom, že pritiahne veľa ľudí a svojimi názormi a striktnosťou poučí zblúdilých. Môže byť smerodatný.

Počul som niečo aj o TypeScripte, ktorý prináša typy do Javascriptu (okrem iného), a tiež je veľmi populárny. Nikdy som však v TypeScripte nerobil, keďže vlastne ani nie som front-end vývojár, a možno by som takéto články vlastne ani nemal písať. Elm ma zaujal hlavne kvôli jeho spojitosti s Haskellom - "najfunkcionálnejším jazykom na svete" - a zaujímalo ma, ako môže vyzerať taký Haskell na front-ende. A mám z toho veľmi dobrý dojem.

Výhodou je tiež parádna interoperabilita s Javascriptom, ktorý môžme do Elm-u rovno includovať, aj keď vlastne neviem, či sa jedná o hack alebo nie. A možnosť v Elm-e písať komponenty do Reactu, a tiež jeho už existujúce komponenty na animáciu a interakciu, ktoré sú vďaka funkcionálnemu prístupu veľmi jednoducho použiteľné.

Je otázne, či je vhodný na použitie v produkcii. Je možné nájsť niekoľko projektov, ktoré Elm [v produkcii používajú](https://discourse.elm-lang.org/t/elm-0-19-from-a-production-perspective/815/7). Od poslednej verzie 0.18 k verzii 0.19 ubehlo neuveriteľných 18 mesiacov (rok a pol), čo viedlo k [týmto zmenám](https://github.com/elm/compiler/blob/master/upgrade-docs/0.19.md). Pred časom, zmenou z 0.17 na 0.18 prebehlo obrovské množstvo spätne nekompatibilných zmien. Teraz je ich zdá sa menej, akoby sa autori orientovali už skôr na "vnútro" samotného jazyka - optimalizáciu. Avšak stále sa verzia ani zďaleka nepribližuje 1.0.

