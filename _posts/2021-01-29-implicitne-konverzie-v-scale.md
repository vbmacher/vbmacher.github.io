---
layout: post
title:  Preč s implicitnými konverziami
date:   2021-01-29 08:45:00
categories: [Design kódu]
tags: scala
mathjax: true
---

Scala dokáže určité metódy zavolať automaticky (implicitne) ako konverzie z typu `A` do `B`. V niektorých prípadoch sa bez implicitnej konverzie ani nedá zaobísť (napríklad pri [Magnet patterne][magnet-pattern]), dnes sa však implicitné konverzie považujú za anti-pattern (rovnako aj Magnet pattern). Bohužiaľ sa týmto anti-patternom často oháňajú odporcovia Scaly ako dôvod, prečo je Scala zlá. Ako keby sa v iných jazykoch nedalo napísať nič smradľavé.




V posledných rokoch, hlavne vďaka knižniciam typu [scalaz][scalaz], [cats][cats], apod. sa Scala stala viac funkcionálnym jazykom. To znamená, že sa zmenilo aj mnoho best practices. Platí to aj pre užívanie implicitných konverzií, ktoré sa dnes už považujú za anti-pattern. Teraz si čo-to vysvetlíme a potom pôjdeme na príklady.

## Subtyping ako konverzia

Príklad implicitnej konverzie v Scale môžme vidieť tu:

```scala
import scala.language.implicitConversions

implicit def convertToInt(s: String): Int = s.toInt


def sumUp(values: Int*): Int = values.sum

// Scala automaticky zavolá convertToInt pre každú hodnotu  
sumUp("1", "2", "4.0", "35")
sumUp(1, 2, 3) // alebo nechá pôvodné argumenty
```

Všade tam, kde sa očakáva `Int`, Scala v tomto prípade automaticky prevedie každý `String` na `Int`, ako keby bol `String` podtypom typu `Int` (označujeme ako `String <: Int`). Príklad:

```scala
case class SInt(int: Int)
case class SString(str: String) extends SInt(str.toInt)

def sumUp(values: SInt*): Int = values.map(_.int).sum

sumUp(SString("1"), SString("2"), SString("4.0"), SString("35"))
sumUp(SInt(1), SInt(2), SInt(3))
```

Čo je to teda subtyping? Človek si môže myslieť, že ide o "technický" vzťah medzi dvoma typmi. Ak typ `S` je skutočným podtypom `T` (v Scale označujeme ako `S <: T`) tak technicky všade tam kde sa očakáva "rodič" `T` vieme použiť "dieťa" `S`, pretože `T` je aj `S`. Táto vlastnosť je formálne popísaná [Liskovej substitučným princípom][liskov]. Tento princíp má svoje písmeno **L** aj v akronyme [SOLID][solid] (princípy OOP), a popísala ho pani Barbara Liskov v roku 1994. V skratke tento princíp hovorí nasledovné:

> Subtype Requirement: Let $\phi(x)$ be a property provable about objects $x$ of type $T$. Then $\phi(y)$ should be true for objects $y$ of type $S$ where $S$ is a subtype of $T$.

Znamená to, že ak `S <: T`, tak od `S` môžme očakávať *rovnaké vlastnosti* ako má typ `T` (vlastnosti $\phi$). Teda všetko to, čo vie "rodič", vie aj "dieťa". No a v tomto prípade sa *na "subtyping" dá nazerať aj ako na konverziu*, pretože ak `S <: T`, tak vždy vieme *skonvertovať* `S` na typ `T`. 

## Prípad 1

V OOP subtyping zaručuje technicky, že `S` je aj `T`, pri konverzii na to však musíme myslieť my. Avšak sémanticky na to musíme myslieť aj v OOP - a práve princípy [SOLID][solid] designu nás nabádajú, aby sme vytvárali podtypy tak, aby boli skutočne len špecifickým prípadom rodiča (Mesiac nie je hviezda, ale Slnko áno). 

Tak by mali byť písané aj konverzie. Nemáme vedieť skonvertovať hocičo na hocičo. Keď konvertujeme čísla v reťazci String, mali by sme sémanticky vedieť, že `String` bude obsahovať len čísla (v tomto prípade to nevieme zaručiť, takže takáto konverzia by nemala existovať!). 

Toto je prvý príklad toho, čo sa môže pokaziť. 

## Prípad 2a

Ďaľší dôvod, prečo je implicitná konverzia považovaná za anti-pattern je ten, že *nevieme ako sa program bude chovať
v runtime ak konverzia zlyhá*. Zlyhať môže vtedy:

- ak funkcia konverzie nie je matematicky "úplná" (po anglicky _total_).
  Čiže vtedy, ak existuje hodnota vstupného argumentu, ktorú funkcia nevie spracovať. Príklad:
  
```scala
implicit def stringToBoolean(s: String): Boolean = {
  s.toUpper match {
    case "TRUE" => true
    case "FALSE" => false
  }
}
```

- ak funkcia konverzie nie je referenčne transparentná, inak povedané, ktorá nemá "side effect". Príklad:

```scala
implicit def ipFromHost(host: String): InetAddress = {
  // side effect je napríklad čítanie súboru /etc/hosts z disku! Alebo aj UnknownHostException
  InetAddress.getByName(host) 
}
```

Samozrejme, človeka môže napadnúť, že by sa konverzie dali napísať aj tak, aby vrátili typ `B` obalený napr. do `Try`:

```scala
implicit def ipFromHost(host: String): Try[InetAddress] = ...
```

Avšak týmto krokom už meníme očakávaný typ `B` na nejaký `Try[B]` a ak by sme chceli použiť výsledok, museli by sme
meniť aj vstupný argument metódy:

```scala
//def connect(address: InetAddress): Boolean = ...
def connect(address: Try[InetAddress]): Boolean = ...
```

čo zas kladie nepochopiteľné nároky na implementáciu metódy `connect` a z jej pohľadu je `Try` úplne nepotrebný.


## Prípad 2b

Okrem týchto relatívne viditeľných problémov existujú ďalšie (nie tak úplne) runtime problémy, ktoré majú spoločné nežiadúce skrývanie chovania. Predstavme si napríklad, že v konfigurácii máme uloženú nejakú URL ako String:

```scala
implicit def toURL(s: String): URL = ...

trait Configuration {
  def serviceUrl: String
}
val config: Configuration = ...


val url: URL = config.serviceUrl
```

Tento kód aktívne skrýva možné zlyhanie. Všetko vyzerá tak krásne, až kým `serviceUrl` nevráti napr. "abcdefgh" a program
spadne. Ako odchytíme chybu? Kde?

- Vo funkcii konverzie? Nemôžme, kvôli dôsledkom objasneným v predošlom Prípade
- V jej použití? Jedine... ak nás to napadne.

Keďže sa implicitná konverzia volá automaticky,
pri jej používaní na viacerých miestach si už prestaneme všímať a uvedomovať si možné zlyhanie.

## Prípad 3

Predstavme si tento príklad:

```scala
implicit def toURL(s: String): URL = ...

def find(name: String): Option[String] = ...
def find(url: URL): Option[String] = ...  // viem, že tieto metódy sú hlúpy príklad...

find("file://...")
```

Ak viete trochu Scalu, tak sa posledného volania funkcie `find` nebojíte. Viete, že v tomto prípade sa žiadna konverzia
realizovať nebude, pretože netreba. Horšie to však bude, keď zapojíme `Trait`:

```scala
trait Configuration {
  def serviceUrl: String
}

trait NameKeyStore {
  def find(name: String): Option[String] 
}

trait UrlKeyStore extends NameKeyStore {
  def find(url: URL): Option[String]
}

class UrlKeyStoreImpl extends UrlKeyStore {
  ...
}


// BadApplication.scala
object BadApplication {

  val config: Configuration = ...
  val store = new UrlKeyStoreImpl() 

  implicit def toURL(s: String): URL = ...
  store.find(config.serviceUrl) // no, ktorá 'find' sa zavolá?
}
```

Ktorá z dvoch implementácií metódy `find` za zavolá? Predpokladajme, že funkcia `find(String)` vráti niečo iné ako
`find(URL)` (nie je to vôbec pekné, ale aj také kódy bývajú).

Ak sú všetky tieto traity v iných súboroch a my
vidíme len súbor s objektom `BadApplication`, jednoducho to nemôžeme vedieť (bez podpory nášho inteligentného IDE).
Nepriamo implicitná konverzia skrýva to, čo by nemalo byť skryté. 

## Čo použiť miesto implicitnej konverzie

Implicitné konverzie sa často píšu vtedy, keď vieme jednoducho vytvoriť potrebný typ `B` z typu `A`; a keď to robíme príliš
často, ako napr.:

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

- výnimku môžme jasne očakávať, pretože robíme explicitné volanie - pri použití
- môžme vytvoriť niekoľko variantov konverzie, z ktorých si pri použití vyberieme.
- konverzia nie je viditeľná v celom scope, ale len tam, kde ju importujeme

### Riešenie 2: Typová trieda (type class)

Predstavme si, že potrebujeme napríklad previesť ľubovoľný objekt do JSON-u.
Túto operáciu (vlastne _konverziu_) vieme popísať aj typovou triedou, pre ľubovoľný typ `A`:

```scala
trait JsonPrintable[A] {
  def toJson(value: A): String
}
```

Jednou z možností ako napísať metódu, ktorá využíva túto operáciu je takáto:

```scala
def sendJson[A](value: A)(implicit printable: JsonPrintable[A]): Unit = {
  val json = printable.toJson(value)
  ...
}
```

Už teraz vidno, že sa jedná o úplne iný prístup ku konverzii. Implementačne sa to podobá na extension metódu,
avšak tým, že `JsonPrintable` je trait, tak tým ustanovuje štandardnú sadu metód, ktoré musí mať každý typ,
pre ktorý bude existovať `JsonPrintable` a to nám umožní zovšeobecniť metódu `sendJson` na ľubovoľný typ.

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

- Problém v konverzii objektu na JSON môžme očakávať (rovnako ako pri extension metóde), pretože robíme explicitné volanie `.toJson` (vo funkcii `sendJson` a nie pri každom jej volaní, čo je o dosť lepšie než v prípade extension metódy).
- konverzia nie je viditeľná v celom scope, ale len tam, kde ju importujeme
- pri pridávaní typov, ktoré môžu byť použité pre funkciu `sendJson` nám stačí len pridať ďaľší `implicit val` a nič iné meniť nemusíme. Toto je krásnym príkladom dodržania [Open-Closed][open-closed] princípu: *"Software entities should be open for extension, but closed for modification"*

Nie vždy sa však dá použiť typová trieda. Problém nastáva, keď potrebujeme skutočný typ `B`, nie len operácie nad `B`.


[liskov]: https://en.wikipedia.org/wiki/Liskov_substitution_principle
[liskov-oop]: https://reflectoring.io/lsp-explained/
[liskov-variance]: https://apiumhub.com/tech-blog-barcelona/scala-generics-covariance-contravariance/
[magnet-pattern]: http://blog.madhukaraphatak.com/scala-magnet-pattern/
[scalaz]: https://github.com/scalaz/scalaz
[cats]: https://github.com/typelevel/cats
[open-closed]: https://stackify.com/solid-design-open-closed-principle/
[solid]: https://en.wikipedia.org/wiki/SOLID
