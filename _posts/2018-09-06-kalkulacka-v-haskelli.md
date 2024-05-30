---
title:  Kalkulačka v Haskell-i
date:   2018-09-06 09:43:00
categories: [Funkcionálne programovanie, Kompilátory]
tags: [haskell, parsery]
author: peterj
description: Rekurzívny parser a interpret reťazcového zápisu infixových výrazov v Haskelli.
---

Pamätáte sa na svoje prvé programy? Myslím tie úplne, úplne prvé.. Moje prvé kroky na magickej ceste programátora rozhodne sprevádzali textové
kalkulačky. Mojim cieľom bolo bez použitia neštandardných knižníc v jazyku [QBasic][2] (neskôr Pascal, a potom C - zdrojový kód je [tu][16]) napísať 
parser a interpret jednoduchých aritmetických výrazov - jednoduchú kalkulačku. 

V tom čase (možno okolo roku 1997-1998) to však bolo nad moje sily. Nevedel som sa spoľahlivo vysporiadať ani s medzerami medzi symbolmi, ani s prioritami operátorov, zátvorkami, reprezentáciou výrazu (dátovou štruktúrou) a potencionálnymi chybami vstupu. Nemal som vtedy k dispozícii internet ani literatúru, a môj "um" ma neobdaril ani nápadom o gramatikách a parseroch; nenapadlo ma ani použiť strom na reprezentáciu výrazu.

Tak som si musel počkať ďalších X rokov (asi do roku 2006), keď sme na škole preberali [Formálne jazyky a prekladače][3] a zadanie bolo vytvoriť interpret a kompilátor vymysleného jazyka do vymyslenej počítačovej architektúry.

Nie je to však koniec môjho príbehu, totiž - keď som sa začal učiť [Haskell][1], napadlo ma vrátiť sa do vtedajšej doby, a len zo zaujímavosti si skúsiť napísať kalkulačku ["from the first principles"][4] - bez použitia knižníc. Usmial som sa, keď som si uvedomil, že neviem ani začať. Je možné, že to bolo tým samotným funkcionálnym programovaním, a tak sa nostalgia prejavila v celej svojej kráse - mal som pocit, že znovu začínam programovať. Odvtedy som urazil nejakú tú cestu a túto cestu som sa rozhodol zdokumentovať v tomto príspevku.

Samozrejme nie som prvý kto píše parser/interpret aritmetických výrazov v Haskell-i. Vybral som dva, o ktorých si môžete prečítať
[tu][26] alebo [tu][25].

# Náš cieľ

Interpret výrazov [reverznej poľskej notácie (RPN)][5] by bol trochu podvod, pretože by sme sa vyhli zátvorkám a prioritám operátorov.
Treba trocha "prikúriť", ale samozrejme s určitou dávkou pokory. Budem dúfať, že sa mi podarí hneď interpret aritmetických výrazov v bežnej
[infixnej forme][6]. Stručne povedané, budem chcieť, aby kalkulačka vedela sparsovať a interpretovať textový zápis aritmetických výrazov, kde:

1. Rozpoznávať sa budú len štyri binárne operácie: násobenie (`*`), delenie (`/`), sčítanie (`+`) a odčítanie (`-`)
2. Bude sa počítať s prioritou operátorov tak ako v normálnej matematike, ale prioritu budeme vedieť zvýšiť ozátvorkovaním
3. Pre jednoduchosť sa bude pracovať len s celými číslami
4. Negatívne čísla budeme vedieť vyjadriť len ako `(0-N)`, pričom `N` je kladné číslo, teda nebude existovať unárny mínus

Platné znaky budú:

- číslice od `0`-`9`,
- operátory `+`, `-`, `/`, `*`
- zátvorky (`(` a `)`).

Medzery sa budú ignorovať, a ostatné znaky by mali byť vyhodnotené ako chyba vstupu.

## Gramatika

Prvým krokom je mať gramatiku "jazyka" kalkulačky, ktorú môžme zapísať v tvare [EBNF][7]:

```
    expr   -> factor { ("+" | "-") factor }
    factor -> term   { ("*" | "/") term   }
    term   -> "(" expr ")" | number
    number -> digit { digit }
    digit  -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

Gramatika obsahuje:

- Terminálne symboly (v úvodzovkách). Ide o časti doslovného textu, ktorý na vstupe v danej chvíli očakávame
- Neterminálne symboly. V našom prípade sú označené malými písmenami ako `expr`, `factor`, atď.
- Pravidlá, v tvare `neterminál -> substitúcia`
- Štartovací neterminál. V našom prípade je to `expr`

Gramatika môže byť použitá buď na generovanie alebo rozpoznávanie slov jazyka. Každé nové generovanie aritmetického výrazu začína štartovacím
neterminálom, ktorý nahradíme jeho pravou stranou. Pokračujeme ďalším odvodzovaním zľava doprava. Ak narazíme na symbol `|` v gramatike,
máme možnosť voľby. Ak narazíme na ohraničenie `{ }`, znamená to, že obsah v týchto zátvorkách môžme opakovať 0 a viac krát. Bez komentára
preletím odvodenie výrazu `2 * 3`:

```
expr
factor                         { ("+" | "-") factor }
term                           { ("*" | "/") term   } { ("+" | "-") factor }
("(" expr ")" | number)        { ("*" | "/") term   } { ("+" | "-") factor }
number                         { ("*" | "/") term   } { ("+" | "-") factor }
(digit number | digit)         { ("*" | "/") term   } { ("+" | "-") factor }
digit                          { ("*" | "/") term   } { ("+" | "-") factor }
2                              { ("*" | "/") term   } { ("+" | "-") factor }
2 * term                       { ("*" | "/") term   } { ("+" | "-") factor }
2 * ("(" expr ")" | number)    { ("*" | "/") term   } { ("+" | "-") factor }
2 * number                     { ("*" | "/") term   } { ("+" | "-") factor }
2 * (digit number | digit)     { ("*" | "/") term   } { ("+" | "-") factor }
2 * digit                      { ("*" | "/") term   } { ("+" | "-") factor }
2 * 3                          { ("*" | "/") term   } { ("+" | "-") factor }
2 * 3                          { ("+" | "-") factor }
2 * 3
```

Rozpoznávanie, alebo parsing, je opačný proces, v ktorom sa snažíme systematickým spôsobom identifikovať časti vstupného reťazca tak, aby odpovedali jednotlivým pravým stranám pravidiel gramatiky. Ak sa to podarí, rozpoznaná pravá strana sa môže nahradiť ľavou stranou. Týmto spôsobom sa postupuje dovtedy, kým sa nedostaneme naspäť k štartovaciemu neterminálu.

# Ako fungujú parsery

Parser je akýsi "rozpoznávač". Jeho úlohou je rozhodnúť, či sa daný výraz (text) dá z gramatiky odvodiť, alebo nie a prípadne poskytnúť aj dané odvodenie. V našom prípade zistí, či výraz patrí alebo nepatrí do jazyka "aritmetických výrazov" a vedľajším produktom vznikne strom odvodenia, ktorý viac menej odpovedá jednotlivým gramatickým pravidlám. Takýto strom sa nazýva [Abstract Syntax Tree (AST)][8].

Existujú parsery, ktoré pracujú zhora-nadol, alebo zdola-nahor. [Parsery zhora-nadol][9] hľadajú tzv. "najľavejšie" odvodenia - tj. postupne zľava doprava hľadajú k danej časti vstupného textu pravidlo gramatiky, ktoré začína touto časťou textu. Napríklad:

```
2 * 3
digit * 3
number * 3
term * 3
term * digit
term * number
term * term
factor
expr
```

[Parsery zdola-nahor][10] hľadajú najprv elementárne známe prvky naprieč celým vstupným textom, ktoré sa dajú previesť na pravidlá. Rekurzívne pokračujú spájaním týchto prvkov do abstraktnejších pravidiel gramatiky, až sa dostanú k štartovaciemu symbolu:

```
2 * 3
digit * digit
number * number
term * term
factor
expr
```

## Imperatívne jazyky

V "normálnych" imperatívnych jazykoch ako je napríklad C, Java, atď. je v dnešnej dobe postup celkom priamočiary. Zdrojový kód parsera sa dá vygenerovať pomocou špeciálneho nástroja: [generátora parsera][11]. Výstupom generátora, zdrojový kód parsera, je integrovateľný do vášho projektu, so známym interfejsom. Parser sa tak dá normálne zavolať ako funkcia, ktorého vstupom je väčšinou plain-text, a výstupom [AST][8].

## Funkcionálne jazyky

Vo funkcionálnych jazykoch sú v obľube tzv. ["parser combinators"][13], kde je parser jazyka zostavený jednoduchou kompozíciou jednoduchších
parserov. Z formálneho hľadiska pracujú parser kombinátory zhora-nadol, v štýle tzv. [recursive-descent parserov][15]. Tieto typy parserov sú veľmi jednoduché - prevádzajú pravidlá gramatiky priamo na kód (funkcie) v danom programovacom jazyku. V imperatívnych jazykoch je naivný prevod gramatiky do kódu zhruba takýto:

1. Neterminál na ľavej strane pravidla sa implementuje ako definícia novej funkcie
2. Alternatíva `|` sa implementuje ako `if-then`
3. Opakovanie `{ }` sa implementuje ako cyklus `while`
4. Neterminál na pravej strane pravidla sa implementuje ako volanie funkcie
5. Terminál na pravej strane pravidla sa implementuje ako čítanie očakávaného tokenu zo vstupu

Funkcionálne jazyky v naivnom spôsobe využívajú rovnakú myšlienku, avšak sa často využívajú high-order funkcie a funkcionálne abstrakcie, ako
napríklad [Applicative a Monády][22]. [`Applicative`][25] umožňuje kombinovať parsery "čistým spôsobom" - tj. bez možnosti určovania nasledujúceho kombinátora na základe výstupu predošlého. [Monadické parsery][14] sú silnejšie v tom, že je práve možné meniť kombinátory na základe predošlého výstupu. V komunite sú preto viac preferované `Applicative` parsery.

## Problémy naivných recursive-descent parserov

Recursive-descent parsery majú v naivnej forme uvedenej v predošlej podkapitolke exponencionálnu zložitosť, pretože sú implementované klasickým [backtrackingom][19]. Vo funkcionálnych jazykoch je však hlavne pomocou techniky známej ako [memoization][20] možné
[znížiť zložitosť na polynomiálnu][18].

V týchto naivných implementáciách si musíme dať explicitne pozor na nejednoznačnosti v gramatike. V prípade ľavej rekurzie v gramatike
parser nikdy neskončí; v prípade konfliktu parser vracia vždy prvé odvodenie, ktoré "sedí", a tým pádom neprídeme na to v compile-time,
že je tam problém. Takže ak chceme použiť naivný recursive-descent parser, je najlepšie mať gramatiku typu [LL(k)][23] bez ľavej rekurzie a nejednoznačností.

Ak nepoužijeme naivný prístup, je možné [obísť aj tieto obmedzenia][21]. Viac informácií nájdete v uvedenom článku. V tomto príspevku si kvôli
jednoduchosti napíšeme naivný parser. [Horeuvedená gramatika](#gramatika) aritmetických výrazov je notoricky známa ako dobrá LL(1) gramatika. 

# Začíname programovať

Takže - ako by sme intuitívne popísali parser z pohľadu funkcionálneho programovania?

- Vstupom je text, a výstupom AST. Takže parser je vlastne funkcia.
- V prípade parser kombinátorov, kombinátor nemusí sparsovať celý vstupný text, ale len jeho časť (zľava doprava). Preto samotný AST bude
  doprevádzaný zvyšným ešte nesparsovaným textom.
- Spracovanie chybného/nesparsovateľného vstupu sa dá riešiť niekoľkými spôsobmi (napr. použitím `Either`, alebo `Maybe`). Keďže pre jednoduchosť
  nepotrebujeme dobré chybové hlášky, ako trik nám parsovacia funkcia môže vrátiť *zoznam*, o 0 alebo 1 prvkoch:

```haskell
newtype Parser a = Parser { parse :: String -> [(a, String)]  }
```

`Parser` budeme reprezentovať ako nový typ s jedným typovým parametrom. Ide o niečo ako alias pre parsovaciu funkciu. V Haskell-i by sa dal
použiť aj konštrukt `data` miesto `newtype`, avšak [rozdiel je v tom][24], že `newtype` nevyhodnocuje svoj typový parameter lenivo, ale striktne a tiež umožňuje použiť len jeden typový konštruktor. Toto obmedzenie nám nevadí a naviac Haskell pracuje efektívnejšie s `newtype` než s `data`.

Parsing budeme môcť volať napr. nasledujúcim spôsobom (trochu predbieham):

```
*Main> parse expr "(2+5)/4"
[(Ops (Ops (Num 2) (Add (Num 5))) (Div (Num 4)),"")]
```

Budeme chcieť, aby v prípade nesparsovateľného vstupu sa tam parser zastavil:

```
*Main> parse expr "2+uups"
[(Num 2,"+uups")]
```

## Prvé kombinátory

Začneme sa približovať ku lexikálnemu analyzátoru. Prvým kombinátorom lexikálneho analyzátora je čítanie jedného znaku, ktorý spĺňa
nejaké kritérium:

```haskell
psym :: (Char -> Bool) -> Parser Char
psym f = Parser $ \ds -> case ds of
  (x:xs) -> if f x then [(x,xs)] else []
  _      -> []
```

Teda:

```
*Main> parse (psym (=='a')) "ahoj"
[('a',"hoj")]
```

Podobným spôsobom definujeme zvyšné "pomocné" kombinátory na čítanie očakávaného symbolu, na čítanie reťazca a celého čísla:

```haskell
sym :: Char -> Parser Char
sym a = psym (== a)

string :: String -> Parser String
string = traverse sym

number :: Parser Int
number = read <$> some (psym isDigit)
```

## Funkcionálne Abstrakcie

Najzaujímavejší je snáď kombinátor `string`, ktorý je definovaný pomocou štandardnej funkcie `traverse`. Signatúra tejto funkcie je

```haskell
traverse :: (Applicative f, Traversable t) => (a -> f b) -> t a -> f (t b)
```

Aj keď signatúra vyzerá "hrozivo", je to veľmi užitočná funkcia a vlastne aj ľahká na pochopenie. Je len príliš všeobecne
definovaná. Keby sme si ju definovali trochu konkrétnejšie:

```haskell
traverse :: (a -> Maybe b) -> [a] -> Maybe [b]
```

Z takejto definície je už lepšie vidieť čo funkcia robí - prejde pole `[a]` a na každý prvok aplikuje funkciu `a -> Maybe b`. Z toho
vznikne pole `[Maybe b]`, z ktorého sa "vyjme" vnútorný typ `Maybe` aby sme jednotlivé prvky `b` dali k sebe: `Maybe [b]`. Funkcia by
mohla byť implementovaná vlastne len pomocou `map` a `fold`.

V našom prípade však miesto `Maybe` máme `Parser`. To znamená, že "naša" `traverse` vyzerá nejak takto:

```haskell
traverse :: (Char -> Parser b) -> [Char] -> Parser [b]
```

Keď ju aplikujeme na funkciu `sym :: Char -> Parser Char` a vieme, že `String` je vlastne `[Char]`, tak `traverse sym` je typu `String -> Parser String`.
Na to, aby to takto krásne fungovalo však potrebujeme, aby náš `Parser` implementoval typovú triedu `Applicative`.

Typová trieda `Applicative` je "aplikatívny funktor", takže musíme implementovať aj `Functor`. Funktor je nejaká abstrakcia nad kontextom (štruktúra, 
"container"), nad ktorou môžme volať `map` (volá sa `fmap`). Napríklad funktorom je `[]` (zoznam) alebo aj `Maybe`. Veľmi dobrý úvod do funktorov som
čítal v [tejto online knihe][27].

### Funktor

V našom prípade by mal byť funktorom aj `Parser`. Keď sa pozrieme na definíciu typu, tak typ `Parser` je vlastne funkcia `String -> [(a, String)]`. Čo v tomto prípade bude znamenať "mapovanie" nad touto funkciou? Veľmi užitočná vec - totiž transformácia výstupného AST na iný AST. Nemusí ísť samozrejme o nejakú skutočne fancy transformáciu, ale o zmenu typu `a -> b` (podobne ako to robí klasická `map` funkcia), takto:

```haskell
fmap :: (a -> b) -> Parser a -> Parser b
```

A implementujeme ju nasledovne:

```haskell
instance Functor Parser where
  fmap f p = Parser $ \s -> [(f x,xs) | (x,xs) <- parse p s]
```

Výstupom je nový parser - ktorý definujeme ako funkciu, ktorej vstup sa odovzdá vstupnému parseru `p`. Ten vráti sparsovaný výsledok a zvyšok textu. Tento výsledok sa pomocou funkcie `f` pretransformuje na požadovaný výstupný typ. 

### Applicative

`Applicative` je tiež funktor (abstrakcia nad kontextom, štruktúra, kontajner). Avšak má navyše tieto dve funkcie:

- `<*>` je obdobou `fmap`, ktorá však funkciu má uloženú vo vnútri štruktúry. Jej typ je: `(<*>) :: Parser (a->b) -> Parser a -> Parser b`
- `pure`, ktorá vytvorí z obyčajnej funkcie `Parser (a -> b)`. Ide o podpornú funkciu, aby sme mohli "simulovať" fmap ako: `fmap f x = pure f <*> x`


```haskell
instance Applicative Parser where
  pure f = Parser $ \s -> [(f, s)]

  (<*>) p q = Parser $ \s -> [(f x, xs) | (f, ys) <- parse p s, (x, xs) <- parse q ys]
```

Implementácia funkcie `pure` je viac-menej triviálna - vytvoríme nový "parser" ktorý nič neparsuje, len vráti funkciu aj so vstupom. Operácia
sekvencovania robí "sekvencovanie" dvoch parserov:

- Sparsujeme vstup prvým parserom, z ktorého dostaneme mapovaciu funkciu `a -> b` a zvyšok vstupu
- Sparsujeme tento zvyšok druhým parserom, z ktorého dostaneme nejaký výsledok typu `a` a druhý zvyšok vstupu
- Výsledok bude transformovaný mapovacou funkciou (na typ `b`) a vráti sa spolu s druhým zvyškom vstupu

Dobré materiály na Applicative sú napríklad [tu][29], alebo [tu][28]. Aké majú výhody a prečo ich vôbec používať je napísané [tu][30]. V skratke:

- `Applicative` umožňuje kombinovanie (sekvencovanie) operácií (podobne ako monády, a na rozdiel od obyčajných funktorov)
- `Applicative` nedokáže meniť "skladbu" už sekvencovaných operácií (kombinátorov) podľa výsledku predošlej operácie (na rozdiel od monády)

Vďaka týmto funkciám sa čiastkové parsery stávajú plnohodnotné "parser combinators", pretože ich je teraz konečne možné kombinovať, napr. takto:

```
*Main> parse ((pure (*2)) <*> number) "2"
[(4,"")]
```

Typová trieda Applicative nám však ponúka aj ďalšie pomocné funkcie, ktoré už implementuje len pomocou `pure` a `<*>`:

- `(*>) :: Applicative f => f a -> f b -> f b`: tiež sekvencovanie, ale výsledok zľava sa "zabudne".
- `(<*) :: Applicative f => f a -> f b -> f a`: tiež sekvencovanie, ale výsledok sprava sa "zabudne".

Príklady:

```
*Main> parse (sym 'a' *> number) "a2"
[(2,"")]

*Main> parse (pure (+) <*> number <* sym '+' <*> number) "4+6"
[(10,"")]
```

### Alternative

Čo sa nám ešte hodí, je implementovať niečo ako logický "OR", ktorý by fungoval tak, že keď máme dva parsery a ten prvý nebude vedieť
sparsovať vstup, skúsi sa druhý. Presne túto možnosť dostaneme, keď implementujeme funkcie typovej triedy `Alternative`:

```haskell
instance Alternative Parser where
  empty = Parser $ \s -> []

  (<|>) p q = Parser $ \s -> case parse p s of
    [] -> parse q s
    xs -> xs
```

Príklady použitia:

```
*Main> parse (sym 'a' <|> sym 'b') "ahoj"
[('a',"hoj")]

*Main> parse (sym 'a' <|> sym 'b') "bye"
[('b',"ye")]

*Main> parse ((( (*1) <$ sym '+') <|> ( (*(-1)) <$ sym '-')) <*> number) "-33"
[(-33,"")]
```


# Lexikálny Analyzátor

Dospeli sme do bodu, kedy je už konečne možné v kľude a pekne napísať lexikálny analyzátor - parser tokenov.

```haskell
data Token = TDig Int | TPlus | TMinus | TMul | TDiv | TLPar | TRPar deriving Show

ignore = sym ' '

tsym :: Char -> Token -> Parser Token
tsym a t = (many ignore) *> sym a *> pure t <* many ignore

tplus = tsym '+' TPlus
tminus = tsym '-' TMinus
tmul = tsym '*' TMul
tdiv = tsym '/' TDiv
tlpar = tsym '(' TLPar
trpar = tsym ')' TRPar
tnumber = TDig <$> number
```

Kombinátor `tsym` je parser, ktorý zľava aj sprava odignoruje medzery, a vo zvyšku očakáva nejaký symbol, ktorý prevedie na daný `Token`.
Využíva už len známe funkcie. Typ `Token` je symbolickou reprezentáciu textu. V podstate to nepotrebujeme, ale v prípade implementácie
parserov zložitejších jazykov sa hodí.

# Syntaktický analyzátor

V tomto bode už pôjde všetko ako po masle. Stačí napísať parser podľa gramatiky. Operátory typových tried `Applicative` a `Alternative`
nám poslúžia ako určitá forma DSL jazyka. Keď si na to človek zvykne, píše sa to naozaj samo. Operátory sa aplikujú normálne zľava doprava.
Ich stručné pripomenutie: 

- `<$` - skratka pre `pure (...) <* (...)`. Ako výsledok sa použije ľavá strana. Pravá strana sa síce aplikuje, ale výsledok zahodí.
- `$>` - skratka pre `pure (...) *> (...)`. Ako výsledok sa použije pravá strana, a výsledok z ľavej strany sa zahodí.
- `<$>` - skratka pre `pure (...) <*> (...)`. Na výsledok z ľavej strany sa aplikuje pravá strana a tento výsledok sa vráti.
- `<*` - sekvencia, podobne ako `<*>` s tým, že sa výsledok z pravej strany zahodí. 
- `*>` - sekvencia, podovne ako `<*>` s tým, že sa výsledok z ľavej strany zahodí.
- `<*>` - sekvencia. Na výsledok ľavej strany sa aplikuje pravá strana a tento výsledok sa vráti.
- `many` - opakovanie 0 a viac krát. Jej typ: `many :: Alternative f => f a -> f [a]`.
- `some` - opakovanie 1 a viac krát. Jej typ: `some :: Alternative f => f a -> f [a]`.
- `<|>` - alternatíva, jej typ: `(<|>) :: Alternative f => f a -> f a -> f a`. Najprv sa aplikuje prvý parser a keď je neúspešný,
          tak sa aplikuje druhý.

Aritmetické výrazy potrebujú svoju skutočnú reprezentáciu, teda svoj AST. Aritmetický výraz, aby bolo možné spracovať vnorenia do ľubovoľnej
hĺbky, musí byť reprezentovaný rekurzívnou dátovou štruktúrou. Navrhujem niečo takéto:

```haskell
data Arith =
  Ops Arith Arith
  | Add Arith
  | Sub Arith
  | Mul Arith
  | Div Arith
  | Num Int deriving Show
```

Z tejto štruktúry je zrejmé, že operácie máme len binárne. Samostatne môže vystupovať len číslo.
Teraz už môžme napísať samostatný parser gramatiky:

```haskell
mkOps :: Arith -> [Arith] -> Arith
mkOps = foldl Ops

-- štartovací symbol
expr = mkOps <$> factor <*> many (addOrSub <*> factor)
  where addOrSub = (tplus *> pure Add) <|> (tminus *> pure Sub)

factor = mkOps <$> term <*> many (mulOrDiv <*> term)
  where mulOrDiv = (tmul *> pure Mul) <|> (tdiv *> pure Div)

term = (tlpar *> expr <* trpar) <|> (numFromDig <$> tnumber)

numFromDig (TDig n) = Num n
```

Čo asi stojí za povšimnutie je operácia `mkOps`. Táto operácia v podstate "naskladá" jednu a viac hodnôt typu Arith do jedného Ops, rekurzívnym
spôsobom. `Ops` je definovaný ako `Ops Arith Arith`, takže samostatný `Ops` je funkcia typu `Ops :: Arith -> Arith -> Arith`. Ako vyzerá `foldl`
pre náš prípad?

```haskell
-- všeobecne
foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b

-- náš prípad
foldl :: (Arith -> Arith -> Arith) -> Arith -> [Arith] -> Arith
```

Prvým argumentom `foldl` je binárna funkcia, ktorá sa opakovane volá pre "akumulátor" a nasledujúci prvok z poľa. Prvá hodnota akumulátora je tzv.
"zero" prvok, ktorý `foldl` dostane ako druhý argument. Ďalšie volania funkcie už budú nad týmto akumulátorom a prvkami poľa (tretí argument `foldl`).

Zavolajme `parse factor "5 * 20 / 10"`. Operácia `mkOps` na vstup dostane dva argumenty: `(Num 5)` a `[Mul (Num 20), Div (Num 10)]`. Čo s nimi teda
spraví? Jej práca sa dá vizualizovať takto:

```
       Ops___________
      /              \
     Ops______  Div (Num 10)
    /         \
  Num 5  Mul (Num 20)
```

"Zero" prvok `Num 5` sa aplikuje spolu s prvým prvkom poľa `Mul (Num 20)` na funkciu `Ops`. Tento výsledok sa použije ako akumulátor - teda znova
ako prvý argument `Ops` v ďalšom volaní, kde druhým argumentom bude nasledujúci prvok poľa - `Div (Num 10)`. Operácia `mkOps` teda efektívne
vytvorí skutočný AST.

Príklad:

```
*Main> parse expr "5 * 20 / 10"
[(Ops (Ops (Num 5) (Mul (Num 20))) (Div (Num 10)),"")]
```

Týmto sme dokončili samotný parsing aritmetických výrazov. Posledná práca bude ich vyhodnotenie.

# Interpret AST - Kalkulačka

Vyhodnocovač je super-jednoduchý:

```haskell
eval :: Arith -> Int
eval (Ops a (Add b)) = (eval a) + (eval b)
eval (Ops a (Sub b)) = (eval a) - (eval b)
eval (Ops a (Mul b)) = (eval a) * (eval b)
eval (Ops a (Div b)) = (eval a) `div` (eval b)
eval (Num a) = a
```

Keďže všetky binárne operácie kalkulačky asociujú doľava (dané už gramatikou a tiež implementáciou `mkOps`), vieme, že hodnota `Ops` sa
môže nachádzať vždy len v _ľavom_ podstrome. To nám veľmi zjednoduší život, pretože ak by sa `Ops` nachádzala vpravo, teda by sme mali
prípad:

```haskell
eval (Ops a (Ops b c)) = ???
```

Tak čo s tým? No neviem, asi by sme s takou štruktúrou nepochodili.

Zostáva nám už len úplne posledná časť - poskladanie vecí do kopy:

```haskell
runParser :: String -> IO Arith
runParser input = case (parse expr input) of 
  [(ast, [])] -> return ast
  []          -> do fail $ "Invalid input '" ++ input ++ "'"
  [(ast, xs)] -> do fail $ "Invalid input '" ++ xs ++ "'"
 
cmdline :: IO ()
cmdline = do
  putStr "> "
  hFlush stdout
  input <- getLine
  ast <- runParser input

  let e = eval ast
  putStrLn $ "\n" ++ (show e)
  cmdline


main :: IO ()
main = do cmdline
```

Monády majú zaujímavú funkciu `fail :: (Monad m) => String -> m a`, ktorá vlastne "vyhodí výnimku" a zastaví monadickú líniu.

# Záver

V tomto relatívne dlhom blogposte som napísal interpret jednoduchej kalkulačky vo funkcionálnom jazyku Haskell. Jej celý zdrojový
kód je možné vidieť [tu][32].

Kým som došiel k tejto poslednej verzii, napísal som si niekoľko rôznych kalkulačiek, a trvalo to naozaj dlho, kým som pochopil
ako to celé funguje. Okrem [Haskell-a][35] som vyskúšal jazyk [C][33] a tiež [Scalu][34].

Väčšina Haskell-ovských kalkulačiek boli monadické. Avšak na internete som často narážal na to, že použitie `Applicative` je v prípade
parserov naozaj lepšie než použitie monád. Tak som začal skúmať možnosti a nejaké príklady. Našiel som toho veľmi málo, a tak som sa
rozhodol, že si to ešte skúsim sám. Vyšlo to, čo ma veľmi teší.







[1]: https://www.haskell.org/
[2]: https://en.wikipedia.org/wiki/QBasic
[3]: https://maisportal.tuke.sk/portal/report.htm;jsessionid=E1BD6889DE2085D9D9BE3E7B4CF8E80D
[4]: https://en.wikipedia.org/wiki/First_principle
[5]: https://en.wikipedia.org/wiki/Reverse_Polish_notation
[6]: https://en.wikipedia.org/wiki/Infix_notation
[7]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form
[8]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[9]: https://en.wikipedia.org/wiki/Top-down_parsing
[10]: https://en.wikipedia.org/wiki/Bottom-up_parsing
[11]: https://en.wikipedia.org/wiki/Comparison_of_parser_generators
[12]: https://wiki.haskell.org/Combinator_pattern
[13]: https://en.wikipedia.org/wiki/Parser_combinator
[14]: https://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf
[15]: https://en.wikipedia.org/wiki/Recursive_descent_parser
[16]: https://github.com/vbmacher/learning-kit/tree/master/toy-projects/calculators/c
[18]: https://richard.myweb.cs.uwindsor.ca/PUBLICATIONS/AI_03.pdf
[19]: https://en.wikipedia.org/wiki/Backtracking
[20]: https://en.wikipedia.org/wiki/Memoization
[21]: https://richard.myweb.cs.uwindsor.ca/PUBLICATIONS/PREPRINT_PADL_NOV_07.pdf
[22]: https://www.researchgate.net/publication/215446169_Applicative_Programming_with_Effects
[23]: https://en.wikipedia.org/wiki/LL_parser
[24]: https://stackoverflow.com/questions/2649305/why-is-there-data-and-newtype-in-haskell
[25]: https://www.joachim-breitner.de/blog/710-Showcasing_Applicative
[26]: https://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf
[27]: https://learnyouahaskell.com/making-our-own-types-and-typeclasses#the-functor-typeclass
[28]: https://medium.com/lazy-eval/applicative-functors-in-haskell-f509e1c764d3
[29]: https://learnyouahaskell.com/functors-applicative-functors-and-monoids#applicative-functors
[30]: https://stackoverflow.com/questions/6570779/why-should-i-use-applicative-functors-in-functional-programming
[31]: https://en.wikipedia.org/wiki/Applicative_functor
[32]: https://github.com/vbmacher/learning-kit/blob/master/toy-projects/calculators/haskell/applicative/calc.hs
[33]: https://github.com/vbmacher/learning-kit/tree/master/toy-projects/calculators/c
[34]: https://github.com/vbmacher/learning-kit/tree/master/toy-projects/calculators/scala
[35]: https://github.com/vbmacher/learning-kit/tree/master/toy-projects/calculators/haskell
