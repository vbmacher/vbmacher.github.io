---
title:  Entropia v BigData
date:   2019-10-18 18:45:00
categories: [Big Data, Algoritmy]
tags: [scala, entropia, bigdata]
math: true
author: peterj
description: Skúmanie neznámych dát využitím informačnej entropie.
---

Informačná entropia má využitie pri spracovaní dát, ale aj strojovom učení (pri vytváraní [rozhodovacích
stromov pre úlohy klasifikácie][5]). V dátovom spracovaní sa dá využiť ako indikátor kvality dát. I keď sa téma
týka viac-menej odboru Data Science, tak som sa ako programátor s entropiou stretol a zaujala ma.

## Informácia

Informácia ako taká nie je "fyzická" vec. Dá sa povedať, že informácia znižuje "nevedomosť", "neznalosť"
či "neurčitosť". Informácie reprezentujeme symbolmi, ktoré sú ako keby práve tým "fyzickým nosičom" informácie.

Avšak - nie je pravda, že každý symbol samostatne nosí odpovedajúce množstvo informácie. Na množstvo informácie
sa dá nazerať zo _syntaktického_ a _sémantického_ pohľadu. Napríklad nasledujúce vety:

> Bude pršať. Bude pekne.

prinášajú síce významovo dve informácie (že bude pršať a bude pekne), ale syntakticky obsahujú štyri slová, z toho jedno
sa opakuje. V telekomunikačných systémoch a teórii informácie sa informácia chápe skôr zo _syntaktického_ hľadiska
a podľa toho vieme merať jej "množstvo".

Ak by sme teda chceli zistiť množstvo informácie v predchádzajúcich vetách, musíme mať kvantitatívnu jednotku informácie,
ktorá bude tým chýbajúcim fyzickým "mostíkom" medzi abstrakciou a realitou (kvantitou). Mohli by sme si vymyslieť ľubovoľnú
jednotku, avšak už to za nás urobil [Claude Shannon][1] v roku 1948.

Jednotkou informácie je jeden *bit* s hodnotou 0 alebo 1. Ak sa budeme pýtať na množstvo, budeme tým myslieť *počet bitov*.

Tu sa však už musíme zamyslieť nad tým, koľkými spôsobmi môžeme danú správu napísať. Ak by sme nemali meniť samotné slová, ale
len reprezentáciu, aj tak každý symbol môžeme zapísať rôznym spôsobom - t. j. môžeme si vymýšľať rôzne abecedy. Jeden symbol v
rôznych abecedách tak môže mať rôzny počet bitov. To znamená, že správa zapísaná v dvoch rôznych abecedách môže mať
rôznu dĺžku. Takže - ktorú abecedu si zvoliť?

## Entropia

Zrejme najväčší zmysel dáva zvoliť si také kódovanie, ktoré produkuje *minimálny počet bitov*. Entropia vyjadruje
*priemerné množstvo informácie na symbol*. Pri nezávislých symboloch s rovnakým rozdelením je dolnou hranicou
priemernej dĺžky bezstratového kódovania v bitoch na symbol; dostatočne dlhým blokovým kódovaním sa k nej vieme priblížiť.

Kvantitatívne môžeme začať takto:

1. Pre každý symbol spočítame jeho frekvenciu výskytu: $$f_i = \frac{n_i}{N}$$, kde $$n_i$$ je počet výskytov
   $$i$$-tého symbolu v dátach a $$N$$ celkový počet symbolov v dátach.
2. Pre jednotlivé symboly v dátach nájdeme minimálne kódovanie s využitím nájdených frekvencií symbolov, napr.
   [Huffmanovo kódovanie][9]. Každý symbol bude mať optimálny kód veľkosti $c_i$ bitov.
3. Priemernú dĺžku kódu na symbol vypočítame vlastne ako sumu "váh" symbolov, kde váha symbolu je jeho optimálna veľkosť
   krát frekvencia výskytu: $$L = \sum_{i=1}^{K} c_i f_i$$, kde $$K$$ je počet rôznych symbolov v dátach.

Napríklad majme [100 symbolov][10]:

|*Symbol:*                | `a`  | `b`  | `c`  | `d`  | `e`  | Suma    |
|*Frekvencia ($$f_i$$):*  | 0.10 | 0.15 | 0.30 | 0.16 | 0.29 |	= 1    |
|*Optimálny kód:*         | `010`| `011`| `11` | `00` | `10` |         |
|*Veľkosť kódu ($$c_i$$):*| 3    | 3    | 2    | 2    | 2    |         |
|*Váha symbolu $$f_i * c_i$$:*| 0.30 | 0.45 | 0.60 | 0.32 | 0.58 |  = 2.25 |

Priemerná dĺžka kódu na symbol $$L$$ má v tomto príklade blízko k informačnej entropii, ale ide o odlišné veličiny:

$$L = \sum_{i=1}^{K} \frac{n_i}{N} c_i$$

kde $$K$$ je počet rôznych symbolov v dátach a $$N$$ je celkový počet ich výskytov.
V príklade je $$L = 2.25$$ bitu na symbol a dĺžka zakódovanej správy je $$N L = 100 \cdot 2.25 = 225$$ bitov.

Prečo je len "blízko", si vysvetlíme neskôr. Nateraz - Shannon entropiu definoval viac matematicky, bez zaťaženia na spôsob
"enkódovania".

### Matematicky

Entropia je známa z termodynamiky ako "miera neusporiadanosti" termodynamického systému. Pri vratnom prenose tepla
pri konštantnej absolútnej teplote $$T$$ je jej zmena:

$$\Delta S = \frac{Q_{\mathrm{rev}}}{T}$$.

Ak sa teplota mení, použijeme $$\Delta S = \int_{\mathrm{rev}} \frac{\delta Q}{T}$$, kde integrujeme po vratnej ceste medzi danými stavmi ([zdroj][12]).
Entropie nezávislých podsystémov sa sčítavajú: $$S_{A+B} = S_A + S_B$$ ([zdroj][13]).
Ak je "podsystémov" (napr. častíc) príliš veľa, nebude to možné realizovať. A tak prišiel [Boltzmann][6] so svojou štatistickou entropiou.
Systém videl ako ucelenú sústavu mikrostavov, do ktorých sa sústava ako celok vie dostať. My pracujeme len s makroskopickými veličinami
(ako napr. tlakom, teplotou, objemom a počtom častíc). Entropia je potom vyjadrená ako množstvo "voľnosti", ktoré systému ostane po zadaní
týchto makroskopických parametrov. Matematicky ju vyjadril ako:

$$S = k \ln \Omega$$

kde $$k$$ je Boltzmannova konštanta a $$\Omega$$ je počet rovnako pravdepodobných mikrostavov. Ak stavy majú rôzne pravdepodobnosti
$$p_i$$, dostaneme vzťah:

$$S = -k \sum_i p_i \ln p_i$$

Ako to súvisí s informačnou entropiou? *Informačnú entropiu* definoval tiež [Claude Shannon][1]. A tá je veľmi podobná tej od štatistickej
entropie ([zdroj][4]):

$$H_{\mathrm{nat}} = -\sum_{i=1}^{K} p(x_i) \ln p(x_i)$$

kde $$p(x_i)$$ je pravdepodobnosť výskytu hodnoty $$x_i$$ v dátovom korpuse. Základ logaritmu určuje jednotku:
prirodzený logaritmus dáva naty na symbol, dvojkový logaritmus bity na symbol. Nulový člen sa chápe limitne ako $$0 \log 0 = 0$$.

Pre $$a > 0$$ platí $$-\ln a = \ln \frac{1}{a}$$. Pri prechode na dvojkový logaritmus vyjadríme entropiu v bitoch na symbol,
teda $$H = H_{\mathrm{nat}} / \ln 2$$:

$$H = \sum_{i=1}^{K} p(x_i) \log_2 \frac{1}{p(x_i)}$$

v ktorom člen $$I_i = \log_2 \frac{1}{p(x_i)}$$ je tým dátovým "prekvapením", alebo _novou informáciou_, ktorú $$i$$-tý symbol prináša.
$$I_i$$ môže byť neceločíselné; konkrétna dĺžka binárneho kódového slova $$c_i$$ musí byť celé číslo. Vo všeobecnosti sa nerovnajú.
Ako to? Ak pravdepodobnosť $$p_i$$ nahradíme frekvenciou výskytu:

$$p_i = f_i = \frac{n_i}{N}$$ 

potom dostaneme:

$$H = \sum_{i=1}^{K} \frac{n_i}{N} \log_2 \frac{N}{n_i}$$

a teda $$I_i = \log_2 \frac{N}{n_i}$$ pre pozorované symboly, kde $$n_i > 0$$.
Na zakódovanie $$m \geq 1$$ rôznych hodnôt kódom pevnej dĺžky potrebujeme $$\lceil \log_2 m \rceil$$ bitov na hodnotu.
Výraz $$N/n_i = 1/p_i$$ je prevrátená pravdepodobnosť symbolu; nemusí byť celým počtom hodnôt.

Hodnotu si môžeme overiť z príkladu v predchádzajúcej časti. Poznáme frekvencie výskytov každého symbolu, takže:

|*Symbol:*                                                      | `a`   | `b`    | `c`   | `d`    | `e`    | Suma      |
|*Frekvencia ($$f_i$$):*                                        | 0.10  | 0.15   | 0.30  | 0.16   | 0.29   |	= 1      |
|*Veľkosť optimálneho kódu ($$c_i$$):*                          | 3     | 3      | 2     | 2      | 2      |           |
|*Informačný prírastok ($$I_i = \log_2 \frac{N}{n_i}$$):*       | 3.3219 | 2.7370 | 1.7370 | 2.6439 | 1.7859 |           |
|*Váha symbolu $$f_i * c_i$$:*                                  | 0.30  | 0.45   | 0.60  | 0.32   | 0.58   |  = 2.25   |
|*Váha informačného prírastku $$f_i I_i$$:*                      | 0.3322 | 0.4105 | 0.5211 | 0.4230 | 0.5179 | ≈ 2.2047 |

Suma posledného riadku je informačná entropia $$H \approx 2.2047$$ bitu na symbol; čísla v tabuľke sú zaokrúhlené až po výpočte.
Je trochu menšia než priemerná dĺžka kódu na symbol $$L = 2.25$$.

Ak existuje $$K$$ rôznych hodnôt a každá z nich je v korpuse rovnako pravdepodobná, potom $$p_i = \frac{1}{K}$$. Vzorec sa potom dá napísať ako:

$$H = \sum_{i=1}^{K} \frac{1}{K} \log_2 K = K \cdot \frac{1}{K} \log_2 K = \log_2 K$$

čo zas pripomína pôvodný Boltzmannov vzorec.

### Ako súvisí dĺžka kódu s entropiou

Pre optimálny binárny prefixový kód nad aspoň dvoma symbolmi platí $$H \leq L < H + 1$$.
Rovnosť $$L = H$$ je možná, napríklad pri pravdepodobnostiach $$p_i = 2^{-c_i}$$.
Ak nezávislé symboly s rovnakým rozdelením kódujeme po blokoch dĺžky $$b$$, optimálna priemerná dĺžka kódu bloku $$L_b$$ spĺňa
$$H \leq L_b/b < H + 1/b$$. Takto sa vieme k entropii priblížiť bez straty informácie.
Všetky tieto hranice sa týkajú priemeru na symbol. Pre detailnejšie info [kliknite tu][11] alebo pozrite [odvodenie][14].

 
## Využitie entropie v dátach

Informačná entropia sa v dátach väčšinou používa na akési ohodnotenie "kvality dát", v zmysle merania "rozmanitosti" dát. Veľká entropia hovorí, že dáta sú rozmanité, a malá, že sa hodnoty mnohokrát opakujú. Napríklad naše dáta nech hovoria o cenách rôznych produktov:

|Produkt     | Cena  |
|------------+-------|
| Chladnička | 10000 |
| Jogurt     | 10    |
| Topánky    | 300   |
| Skriňa     | 6000  |
| Auto       | 500000|

V tomto prípade môžeme očakávať, že ceny budú "kvalitné" vtedy, ak budú naozaj rozmanité. Nie je totiž možné, že každý produkt bude mať rovnakú cenu.
Toto principiálne rozrieši entropia, ktorú môžeme očakávať relatívne vysokú - v ideálnom prípade bude mať každý unikátny produkt jednu unikátnu cenu, teda
pravdepodobnosť výskytu každej ceny bude rovnaká. A potom budeme vedieť, že dáta sú kvalitné, ak entropia bude nie oveľa menšia než $$\log_2 K$$, v našom prípade $$H = \log_2 5 \approx 2.32$$.

Ak dostaneme takéto dáta:

|Produkt     | Cena  |
|------------+-------|
| Chladnička | 1     |
| Jogurt     | 1     |
| Topánky    | 1     |
| Skriňa     | 1     |
| Auto       | 1     |

vidíme, že jediná hodnota ceny má pravdepodobnosť $$p = 1$$, a teda entropia je $$H = -1 \cdot \log_2 1 = 0$$

V tomto prípade nám entropia hovorí, že dáta nie sú kvalitné, pretože ideálne sme očakávali entropiu $$2.32$$.

# Programovanie pre BigData

Ak máme tak málo dát ako v predchádzajúcej kapitolke, nepotrebujeme počítať entropiu. Ak však máme dát veľmi veľa (teda BigData) - napríklad 100
terabajtov, pomocou entropie vieme urýchliť utvorenie si predstavy o ich kvalite.

V našom prípade budeme testovať kvalitu datasetu zo servera [Last.fm][7], teda citujem:

> Thierry Bertin-Mahieux and Daniel P.W. Ellis and Brian Whitman and Paul Lamere: The Million Song Dataset
> uverejnené v Proceedings of the 12th International Conference on Music Information Retrieval (ISMIR 2011), 2011.

Dataset obsahuje skladby ("tracks") a k nim priradzuje umelca a podobné skladby. Našou úlohou bude zistiť entropiu umelcov a skladieb. Predpokladáme, že umelci by mali byť unikátni, avšak skladby nemusia byť unikátne.

Na prácu použijeme framework Apache Spark vo verzii 2.4.3 a jazyk Scala vo verzii 2.12.

## Dotyk dát

Začneme tým, že si dáta načítame do sparkového "[DataFram-u][8]":

```scala
  implicit val spark = SparkSession.builder()
    .master("local")
    .getOrCreate()

  import spark.implicits._

  val path = getClass.getResource("/lastfm_subset").getPath
  val data = spark.read.json(path)

  data.show()
```

A vidíme, že to robíme dobre:


```
+--------------------+--------------------+--------------------+--------------------+--------------------+------------------+
|              artist|            similars|                tags|           timestamp|               title|          track_id|
+--------------------+--------------------+--------------------+--------------------+--------------------+------------------+
|       The Shirelles|[[TRCCSCE128F92EF...|[[oldies, 100], [...|2011-09-07 13:30:...|Dedicated To the ...|TRAHBWE128F9349247|
|          Little Eva|[[TRFYRVZ128F92EF...|[[oldies, 100], [...|2011-08-09 04:18:...|     The Loco-Motion|TRADZQV128F14A5760|
|        The Chiffons|[[TRFYRVZ128F92EF...|[[60s, 100], [old...|2011-09-07 02:09:...|        One Fine Day|TRAKKTE128F934B0D9|
|       The Shirelles|[[TRYZQVK128F92FE...|[[oldies, 100], [...|2011-08-09 23:06:...|Will You Love Me ...|TRAAYGH128F92ECD16|
|          Ned Miller|[[TRRENDE128F4279...|[[country, 100], ...|2011-08-02 06:36:...|From A Jack To A ...|TRAZDQQ128F93590E2|
|          Ned Miller|[[TRRENDE128F4279...|[[country, 100], ...|2011-08-12 02:07:...|From A Jack To A ...|TRBGKZD12903D13D23|
...
```

## Entropia 

Entropia sa v Apache Spark dá vypočítať jednoducho. Budeme potrebovať len stĺpce `artist` (umelec) a `title` (názov piesne).
Najprv potrebujeme vypočítať pravdepodobnosti jednotlivých hodnôt, ktoré následne zapracujeme do vzorca. Pomocou DataFrame API
vieme celý tento algoritmus napísať veľmi jednoducho:

```scala
  def entropy(df: DataFrame, what: String, totalCount: Long) = {
    df
      .groupBy(col(what)).count()
      .withColumn("value", 'count / totalCount) // pravdepodobnosť hodnoty
      .withColumn("value", when('value === 0, 0.0).otherwise(-'value * log('value))) // člen entropie
      .select('value).as[Double]
      .reduce((v1, v2) => v1 + v2) // výsledok ako suma všetkých členov
  }
```

1. Najprv spočítame početnosť jednotlivých hodnôt.
2. V druhom kroku vypočítame pravdepodobnosť každej hodnoty
3. Ďalej vypočítame vnútorný člen vzorca entropie, teda $$-p(x_i) \ln p(x_i)$$
4. Posledným krokom je sčítať všetky tieto členy do jedinej hodnoty - entropie

Pri počítaní kroku 3 tam mám ošetrenie situácie, ak bude pravdepodobnosť nejakej hodnoty nulová. Ak by bola pravdepodobnosť
nula, tak by kód spadol, pretože nejde vypočítať logaritmus z nuly. Je to len technické ošetrenie, ale v praxi by to nemalo
aj tak nikdy nastať. Dôvodom je, že v kroku 1 je už jasné, že vylučujeme hodnoty, ktoré by v korpuse "mohli byť", ale nie sú.
Počítame teda len s tými, čo tam sú - inými slovami, všetky hodnoty v tomto korpuse tvoria úplnú množinu.

## Celok

Tak a máme už všetko pripravené na to, aby sme mohli vypočítať entropiu očakávanú (t. j. takú, v ktorej predstierame rovnakú
pravdepodobnosť každej hodnoty), a potom skutočné entropie umelcov a skladieb:

```scala
  val totalCount = data.count()

  val expectedEntropy = math.log(totalCount)
  val artistsEntropy = entropy(data, "artist", totalCount)
  val songsEntropy = entropy(data, "title", totalCount)

  println(s"Expected entropy: $expectedEntropy")
  println(s"Artists entropy: $artistsEntropy")
  println(s"Songs entropy: $songsEntropy")
```

A výsledok po spustení celého programu je takýto (hodnoty sú v natoch na symbol, pretože kód používa prirodzený logaritmus):

```
Expected entropy: 9.140990293841389
Artists entropy: 8.043398745598488
Songs entropy: 9.09405998020258
```

# Záver

Čísla, ktoré vidíme, nás možno prekvapia. Umelci vyzerajú byť menej unikátni než skladby, čo mi príde ako divný výsledok. Ale dáva zmysel,
pretože si treba uvedomiť, že korpus obsahoval zoznam _skladieb_. Umelci sú len priradení ku skladbe, takže to, že sa budú opakovať, je
očakávané. Môžeme si to overiť:

```scala
  data
    .groupBy('artist)
    .agg(count('title) as "count", collect_list('title) as "tracks")
    .sort('count.desc)
    .show(false)
```

A výsledok je:

```

+--------------------+-----+--------------------+
|              artist|count|              tracks|
+--------------------+-----+--------------------+
|    Mario Rosenstock|   13|[De Tree Little P...|
|         Snow Patrol|   12|[We Wish You A Me...|
|        Phil Collins|   12|[Welcome, You Can...|
|           Aerosmith|   12|[Lord of the Thig...|
|             Shakira|   11|[Hips Don't Lie, ...|
|Nick Cave and the...|   11|[Still in Love, T...|
...
```

No a čo sa týka samotných piesní, tam tiež očakávame určité množstvo opakujúcich sa názvov. Podobnou technikou vieme zistiť aj to:

```
+--------------+-----+
|         title|count|
+--------------+-----+
|         Intro|   14|
|       Forever|    6|
|         Smile|    5|
|       Hey Joe|    5|
|       Hold On|    4|
|          Life|    4|
|           Why|    4|
|          Wave|    4|
```

Takže "Intro" je zrejme jeden z najviac používaných názvov. Ale entropia skladieb bola relatívne vysoká (9.09 z 9.14), z čoho
vyplýva, že korpus asi obsahuje pomerne veľký počet riadkov, takže sa opakovania "stratia". Konkrétne 9330 riadkov.

Tak - teraz som ukázal, ako sa dá entropia "v praxi" využiť. Robí sa to hlavne pri analýze neznámych, nových dát a toto je jednou
z možností, ako si dáta "oťukať". Dúfam, že sa vám článok páčil :)

**PS:** Celý kód je možné stiahnuť na mojom [GitHub-e](https://github.com/vbmacher/learning-kit/tree/master/toy-projects/spark-entropy)



[1]: https://sk.wikipedia.org/wiki/Claude_Elwood_Shannon
[2]: https://planetcalc.com/2476/
[3]: https://jaceklaskowski.gitbooks.io/mastering-spark-sql/spark-sql-udfs.html
[4]: https://www.tucekweb.info/Teo_inf/Teo_inf.html
[5]: https://towardsdatascience.com/entropy-how-decision-trees-make-decisions-2946b9c18c8
[6]: https://en.wikipedia.org/wiki/Entropy_(statistical_thermodynamics)
[7]: https://www.kaggle.com/datasets/harshal19t/lastfm-dataset
[8]: https://spark.apache.org/docs/latest/sql-programming-guide.html
[9]: https://en.wikipedia.org/wiki/Huffman_coding
[10]: https://en.wikipedia.org/wiki/Huffman_coding#Example
[11]: https://en.wikipedia.org/wiki/Shannon%27s_source_coding_theorem#Proof:_Source_coding_theorem_for_symbol_codes
[12]: https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/node41.html
[13]: https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/node56.html
[14]: https://web.stanford.edu/class/ee376a/files/2017-18/lecture_5.pdf
