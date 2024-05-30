---
title:  Preč s implicitnými konverziami
date:   2021-01-29 08:45:00
categories: [Design kódu]
tags: [scala, implicity, typové triedy]
math: true
author: peterj
description: Od implicitných konverzií k typovým triedam v Scale.
---

Scala dokáže určité funkcie zavolať automaticky (implicitne) ako konverzie z typu `A` do `B`. V niektorých prípadoch sa bez implicitnej konverzie ani nedá zaobísť (napríklad pri [Magnet patterne][magnet-pattern]), dnes sa však implicitné konverzie považujú za anti-pattern (rovnako aj Magnet pattern). Implicity sami o sebe sú naopak veľmi užitočné, no treba sa ich naučiť používať dobre. Bohužiaľ, implicitné konverzie už ako anti-pattern padajú vhod odporcom Scaly, ktorí toto "zlo" zovšeobecňujú na implicity globálne a nakoniec aj na Scalu ako takú. Pozrieme sa na to, prečo sa na implicitné konverzie nazerá cez prsty a čo s tým robiť. 

## Čo je to vlastne konverzia

Konverzia je obyčajná funkcia `A => B` s jedným argumentom typu `A`, a vracia výsledok typu `B`. Existujú implicitné a explicitné konverzie. Implicitné robí prekladač automaticky, keď treba a má na to podmienky. Explicitné robí programátor sám.

Napríklad väčšina populárnych jazykov dokáže implicitne skonvertovať "menšie" numerické typy na "väčšie", napr. `Integer` na `Long`; alebo `Float` na `Double`. Takáto konverzia nikde nie je definovaná, prekladač ju má v sebe väčšinou "zabudovanú". Konverzia sa realizuje často bez informovania programátora, pretože ide o "bezpečnú" operáciu. Totiž - nestráca sa tým žiadna informácia.

Explicitná konverzia sa však väčšinou vyžaduje v opačnom prípade - teda ak nie je "bezpečné" alebo jasné ako typ `A` previesť na typ `B`. Niektoré jazyky majú na to špeciálnu syntax, ako napr. v jazyku C sa explicitná konverzia robí ako `(int)3.14`; v Scale by to bolo `3.14.toInt`. 

Jazyk Scala, na rozdiel od väčšiny populárnych jazykov, umožňuje programátorovi napísať vlastné implicitné konverzie. Príklad:

```scala
import scala.language.implicitConversions

def sumUp(values: Int*): Int = values.sum

implicit def doubleToInt(d: Double): Int = d.toInt

// Scala automaticky zavolá doubleToInt pre každú hodnotu  
sumUp(1.6, 2.4, 4.0, 35)
sumUp(1, 2, 3) // alebo ju nezavolá ak netreba
```

Konverziou `doubleToInt` sme "naučili" Scalu prevádzať `Double => Int` implicitne. Všade tam, kde sa očakáva `Int` a my máme k dispozícii len `Double`, prekladač ho automaticky prevedie na `Int`, aj keď ide o "nebezpečnú" operáciu. 

## Subtyping ako konverzia

V predchádzajúcom príklade sme videli príklad "nebezpečnej" implicitnej konverzie, je preto namieste opýtať sa - aké sú "dobré" implicitné konverzie? Pri numerických typoch je to jasné - nemali by sme strácať presnosť pri prevode. Ale vo všeobecnosti si to žiada hlbšie vysvetlenie.

Poďme sa pozrieť ďalej, na mechanizmus s názvom **subtyping**. Subtyping totiž - na naše prekvapenie - dosť pripomína implicitné konverzie. 

Napríklad v OOP: dedičnosť umožňuje vytvárať podtypy - teda odvodené typy od svojich rodičov. Podtypy sa však dajú vytvoriť aj inak: implementáciou interface, alebo použitím tzv. [Mixin][mixin]-u, ktorý do triedy "vkladá" funkcionalitu bez dedenia. Subtyping je teda mechanizmom nielen v OOP.

Medzi hlavným typom (rodičom) a odvodeným typom (dieťaťom) je akási súvislosť. Túto súvislosť môžme využiť pri substitúcii jedného za druhého. Dostávame sa tak ku substitučnému princípu, ktorý dobre popísala Barbara Liskov v roku 1994. Jedná sa preto o [Liskovej substitučný princíp][liskov], a má aj svoje významné písmeno **L** aj v akronyme [SOLID][solid] (princípy dobrého designu v OOP). Hovorí:

> Subtype Requirement: Let $\phi(x)$ be a property provable about objects $x$ of type $B$. Then $\phi(y)$ should be true for objects $y$ of type $A$ where $A$ is a subtype of $B$.

Znamená to, že ak `A <: B` (`A` je podtypom `B`), tak od `A` môžme očakávať *rovnaké vlastnosti* ako má typ `B` (vlastnosti $\phi$). Teda všetko to, čo vie "rodič", by malo vedieť aj "dieťa". A preto v programovacích jazykoch vieme implementovať **substitúciu**, čiže nahradenie `A` za `B`, bez _explicitnej_ drámy. Napríklad:

```scala
class B 
class A extends B

val a: A = new A()
val b: B = a  // substitúcia
```

Čo nám to pripomína? Implicitnú konverziu! Áno, je to tak - *na "subtyping" dá nazerať aj ako na konverziu*, pretože ak `A <: B`, tak vždy vieme *skonvertovať* `A` na typ `B`.

Keď si ešte spomínate na príklad implicitnej konverzie `doubleToInt` vyššie, dá sa implementovať aj pomocou subtypingu: 

```scala
case class SInt(int: Int)
case class SDouble(dbl: Double) extends SInt(dbl.toInt)

def sumUp(values: SInt*): Int = values.map(_.int).sum

sumUp(SDouble(1.6), SDouble(2.4), SDouble(4.0), SDouble(35))
sumUp(SInt(1), SInt(2), SInt(3))
```

## Dobrá konverzia

Teraz sme už pripravení zamyslieť sa nad tým, čo znamená "dobrá" konverzia.  

Tak ako je to v prípade `Double` a `Int`? Je skutočne `Double` podtypom `Int`? Nie, je to skôr naopak. Každý `Int` môže byť aj `Double` (pretože `Double` má väčší rozsah a naviac vie poňať aj desatinné čísla), môžme bezpečne predpokladať vzťah `Int <: Double`. Liskovej substitučný princíp však nevyžaduje skutočný technický subtyping, princíp hovorí len o *vlastnostiach* - teda platí vtedy, ak vlastnosti typu `Double` má aj typ `Int`.

Z tohto príkladu intuitívne vieme vycítiť, aká je to "dobrá" - bezpečná - implicitná konverzia:

- nesmie byť porušený Liskovej substitučný princíp (nevyžadujeme "technický" subtyping).
- funkcia musí byť úplná (*total*) - pre všetky hodnoty argumentu musí existovať výsledok
- funkcia by mala byť referenčne transparentná (nemá "side effect")

Ak máme dobrú konverziu, tak jej implicitnosť veci naozaj uľahčuje a nie sťažuje. Avšak, nie je jednoduché toto zabezpečiť v jazyku samotnom. Programátor na to všetko musí myslieť sám. Aj preto jazyková podpora implicitnej konverzie sa zdá byť výsledkom prehnanej optimistickej dôvery v programátora ;)

## Problémy implicitnej konverzie

A je to tu. Konečne si ukážeme príklady, na ktorých snáď bude jasne vidno, prečo sa od implicitnej konverzie
upúšťa.

## Za čo môže programátor 

Programátor môže za to, keď je konverzia "zlá" - teda nesprávne napísaná. Väčšinou sa jedná o "technické" problémy:

### Porušenie Liskovej substitučného princípu

Patrí tu spomínaný príklad konverzie `Double => Int`, alebo `String => Int`, či `String => URL`
(pretože platí skôr `URL <: String` než naopak) apod.

### Neúplná funkcia ("non-total" alebo "partial" function)

Keď nevieme previesť úplne každú hodnotu typu `A` na typ `B`, jedná sa o "partial" (neúplnú) funkciu. Aj keď technicky vieme vždy zabezpečiť, aby sa "neplatné hodnoty" prevádzali na nejakú predvolenú hodnotu, nie je to vždy správne riešenie. A nie vždy sa to aj dá.

```scala
implicit def stringToBoolean(s: String): Boolean = {
  s.toUpperCase match {
    case "TRUE" => true
    case "FALSE" => false
  }
}
```

K neúplnosti funkcie prispievajú aj výnimky, ktoré konverzia môže potenciálne vyhodiť (v predchádzajúcom prípade hrozí
výnimka `scala.MatchError`). Človeka môže napadnúť, že by sa konverzie dali napísať aj tak, aby nevyhadzovali výnimky a návratový typ `B` by obaľovali napr. do `Try`:

```scala
import scala.util.Try

implicit def stringToBoolean(s: String): Try[Boolean] = Try {
  s.toUpperCase match {
    case "TRUE" => true
    case "FALSE" => false
  }
}
```

Avšak týmto krokom už meníme očakávaný typ `B` na nejaký `Try[B]` a ak by sme chceli použiť výsledok, museli by sme
meniť aj vstupný argument metódy, kde očakávame použitie implicitnej konverzie:

```scala
//def print(s: String, indent: Boolean): Unit = ...
def print(s: String, indent: Try[Boolean]): Unit = ...
```

To kladie nezmyselné nároky na definíciu metódy `print`, pretože z jej pohľadu je `Try` úplne nepotrebný.

### Referenčne netransparentná funkcia (funkcia so "side-effect"-ami)

"Side effect" je každá akcia, ktorá spôsobí zmenu stavu, ktorý nie je vytvorený aj "zničený" v danej funkcii - teda stav, ktorý nie je "lokálny". Výpis na obrazovku, čítanie zo súboru či z klávesnice, poslanie správy aktorovi, atď. nie sú zmeny lokálneho stavu, ide teda o side-effect-y.

Príklad:

```scala
implicit def hostToInetAddress(host: String): InetAddress = {
  // side effect je napríklad čítanie súboru /etc/hosts z disku!
  InetAddress.getByName(host) 
}
```

## Za čo nemôže programátor

Okrem týchto relatívne technických problémov existujú ďalšie problémy, za ktoré programátor ani tak nemôže. Sú to problémy spojené so "skrývaním" chovania, ktoré prispievajú k neprehľadnosti či nejasnosti toho, ako sa program naozaj skompiluje. 

Predstavme si napríklad, že v konfigurácii máme uloženú názov a URL nejakej služby:

```scala
trait Service

trait Configuration {
  def serviceName: String
  def serviceURL: String
}
val config: Configuration = ...

def findService(serviceName: String): Option[Service] = ...
def findService(serviceURL: URL): Option[Service] = ...


implicit def stringToURL(s: String): URL = ...
val service = findService(config.serviceURL) // ktorá metóda sa zavolá?
```

Táto chyba je relatívne dobre viditeľná, ale kompilátor sa sťažovať vôbec nebude. V tomto prípade sa žiadna konverzia
nekoná, pretože netreba - zavolá sa metóda `findService(serviceName: String)` s chybným argumentom `config.serviceURL`.Keď sme všímaví, všimneme si to. Ak nie, tak sa to dozvieme až v runtime... 

Ešte horšie to však dopadne, keď naše metódy skomplikujeme:

```scala
trait Service

trait Configuration {
  def serviceName: String
  def serviceUrl: String
}

trait ServiceRegistry {
  def find(serviceName: String): Option[Service] 
}

trait UrlServiceRegistry extends ServiceRegistry {
  def find(serviceURL: URL): Option[Service]
}

class UrlServiceRegistryImpl extends UrlServiceRegistry {
  ...
}


// BadApplication.scala
object BadApplication {

  val config: Configuration = ...
  val registry = new UrlServiceRegistryImpl() 

  implicit def stringToURL(s: String): URL = ...
  registry.find(config.serviceUrl) // no, ktorá 'find' sa zavolá?
}
```

Ktorá z dvoch implementácií metódy `find` za zavolá?

Ak sú všetky tieto traity ešte aj v iných súboroch a my vidíme len súbor s objektom `BadApplication`, jednoducho to nemôžeme vedieť (bez podpory nášho inteligentného IDE). Nepriamo implicitná konverzia skrýva to, čo by nemalo byť skryté. 

## Čo použiť miesto implicitnej konverzie

Implicitné konverzie sa často píšu vtedy, keď vieme jednoducho vytvoriť potrebný typ `B` z typu `A`; a keď to robíme príliš
často, čím "riešime" best practice [DRY][dry]. Príklad:

```scala
implicit def stringToUrl(s: String): URL = ...

val config: Configuration = ...

service1.find(config.serviceUrl1)  // def find(url: URL) 
service2.find(config.serviceUrl2)  // def find(url: URL)
service3.find(config.serviceUrl3)  // def find(url: URL)
...
```

Toto použitie má však symptómy vyššie uvedených prípadov. Miesto toho, aby sme teraz zahodili celú Scalu, skúsme nájsť
riešenie, ktoré by nás nebolelo.

### Riešenie 1: Extension metóda

Extension metódu by som použil vtedy, ak by implicitná konverzia porušovala Liskovej substitučný princíp. Pretože nejde o to "zakázať" napr. prevádzanie `Double` na `Int`, ide o to, aby bol tento prevod **explicitne viditeľný**. 

```scala
object syntax {
  object string {
    implicit class StringExt(str: String) {
      def toURL: URL = new URL(str)
    }
  }
}

// Použitie:
import syntax.string._

service1.find(config.serviceUrl1.toURL) 
```

Rozdielom oproti implicitnej konverzii je okrem explicitného volania `.toURL` fakt, že:

- výnimku môžme jasne očakávať, pretože robíme explicitné volanie
- môžme vytvoriť niekoľko variantov konverzie, z ktorých si pri použití vyberieme.
- konverzia nie je viditeľná v celom scope, ale len tam, kde ju importujeme
- porušenie Liskovej princípu nevadí

### Riešenie 2: Typová trieda (type class)

Teraz si ukážeme správne riešenie ak Liskovej substitučný princíp porušovať netreba. Preto sa už nemôžeme držať príkladu s prevodom `String => URL`. Musíme vymyslieť lepší. Napríklad, každý tzv. "[product type][producttype]" vieme previesť na `String` vo formáte [JSON][json]. Samotný prevod však musíme naprogramovať my.

Operáciu prevodu (vlastne _konverziu_) vieme popísať aj tzv. [typovou triedou][typeclass], pre ľubovoľný typ `A`:

```scala
trait JsonPrintable[A] {
  def toJson(value: A): String
}
object JsonPrintable {
  def apply[A](implicit printable: JsonPrintable[A]): JsonPrintable[A] = printable
}
```

Jednou z možností ako napísať metódu, ktorá využíva túto operáciu je nasledovná:

```scala
def sendJson[A: JsonPrintable](value: A): Unit = {
  val json = JsonPrintable[A].toJson(value)
  ...
}

// Je to to isté ako:
//def sendJson[A](value: A)(implicit printable: JsonPrintable[A]): Unit = {
//  val json = printable.toJson(value)
//  ...
//}
```

Už teraz vidno, že sa jedná o úplne iný prístup ku konverzii. Implementačne sa to podobá na extension metódu,
avšak tým, že `JsonPrintable` je trait, sa ustanovuje štandardná sada metód, ktoré musí mať každý typ,
pre ktorý bude existovať `JsonPrintable`. To nám umožní zovšeobecniť metódu `sendJson` na ľubovoľný typ.

Je to ako keby sme povedali: metóda `sendJson` vie poslať hocičo, čo sa dá previesť do JSON-u pomocou `JsonPrintable`. 
Pre každý typ zvlášť vytvoríme implicitnú inštanciu typovej triedy a použitie je priam skvostné:

```scala
case class Person(name: String, age: Int)

object instances {
  object json {
    implicit val personJsonPrintable = new JsonPrintable[Person] {
      def toJson(value: Person): String = s"""{"name":"${value.name}","age":${value.age}}"""
    }
  }
}

import instances.json._
sendJson(Person("Peter", 36))
```

Vidíte tú krásu? Dosiahli sme syntakticky ideálne riešenie, ktoré nič neskrýva:

- Problém v konverzii objektu na JSON môžme očakávať (rovnako ako pri extension metóde), pretože robíme explicitné volanie `.toJson` (vo funkcii `sendJson` a nie pri každom jej volaní, a to je o dosť lepšie než v prípade extension metódy).
- konverzia nie je viditeľná v celom scope, ale len tam, kde ju importujeme
- pri pridávaní typov, ktoré môžu byť použité pre funkciu `sendJson` nám stačí len pridať ďaľší `implicit val` a nič iné meniť nemusíme. Toto je krásnym príkladom dodržania [Open-Closed][open-closed] princípu: *"Software entities should be open for extension, but closed for modification"*

Nie vždy sa však dá použiť typová trieda. Problém nastáva, keď potrebujeme skutočný typ `B`, nie len operácie nad `B`.


[liskov]: https://en.wikipedia.org/wiki/Liskov_substitution_principle
[liskov-oop]: https://reflectoring.io/lsp-explained/
[liskov-variance]: https://apiumhub.com/tech-blog-barcelona/scala-generics-covariance-contravariance/
[magnet-pattern]: https://blog.madhukaraphatak.com/scala-magnet-pattern/
[scalaz]: https://github.com/scalaz/scalaz
[cats]: https://github.com/typelevel/cats
[open-closed]: https://stackify.com/solid-design-open-closed-principle/
[solid]: https://en.wikipedia.org/wiki/SOLID
[mixin]: https://en.wikipedia.org/wiki/Mixin
[dry]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[typeclass]: https://en.wikipedia.org/wiki/Type_class
[producttype]: https://en.wikipedia.org/wiki/Product_type
[json]: https://en.wikipedia.org/wiki/JSON
