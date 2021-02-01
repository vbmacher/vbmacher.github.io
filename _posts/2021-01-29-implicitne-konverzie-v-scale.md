---
layout: post
title:  Preč s implicitnými konverziami
date:   2021-01-29 08:45:00
categories: [Design kódu]
tags: scala
mathjax: true
---

Konverzia typu `A => B` je ekvivalentom "subtyping"-u (`A <: B`), keď platí [Liskovej substitučný princíp][liskov]. Jazyk Scala dokáže realizovať konverzie "implicitne", tj. automaticky všade tam, kde sa očakáva `B` a v kontexte je k dispozícii len objekt typu `A`. Aj keď sa bez implicitnej konverzie niekedy nedá zaobísť (napríklad pri [Magnet patterne][magnet-pattern]), dnes sa implicitné konverzie považujú za anti-pattern (rovnako aj Magnet pattern). Bohužiaľ sa týmto anti-patternom často oháňajú odporcovia Scaly ako dôvod, prečo je Scala zlá. Ako keby sa v iných jazykoch nedalo napísať nič smradľavé.




Najprv si povieme niečo o Liskovej substitučnom princípe, keďže som ho spomenul. Tento princíp má svoje písmeno **L** v akronyme [SOLID][solid] (princípy OOP), a popísala ho pani Barbara Liskov v roku 1994. Výstižne tento princíp hovorí:

> Subtype Requirement: Let $\phi(x)$ be a property provable about objects $x$ of type $T$. Then $\phi(y)$ should be true for objects $y$ of type $S$ where $S$ is a subtype of $T$.

Princíp hovorí o tom, že ak $S$ je podtypom $T$, tak od $S$ môžme očakávať rovnaké vlastnosti ako má typ $T$ (vlastnosti $\phi$). Jednoduchšími slovami - podľa vysvetlenia v designe [SOLID][solid]:

> Objects in a program should be replaceable with instances of their subtypes without altering the correctness of that program.

Ak $S$ je podtypom $T$ (`S <: T`), potom všade tam, kde očakávame $T$ vieme použiť $S$. Teda na "subtyping" sa dá nazerať aj ako na *konverziu*, pretože ak `S <: T`, tak vždy vieme *skonvertovať* `S` na typ `T`. Subtyping a konverzia su vďaka Liskovej princípu ekvivalentné. 

Príklad implicitnej konverzie v Scale môžme vidieť tu:

```scala
import scala.language.implicitConversions

implicit def convertToInt(s: String): Int = s.toInt

def sumUp(values: Int*): Int = values.sum

sumUp("1", "2", "4.0", "35")
```

Keď kompilátor zbadá, že metódu `sumUp` voláme s argumentami typu `String`, zistí, že typy nesedia a tak hľadá implicitnú hodnotu alebo konverziu, ktorou by mohol žiadaný typ `String` vyrobiť. Nájde ju (`convertToInt`) a použije. Výsledkom je očakávaná 42.

Vďaka implicitnej konverzii (a Liskovej princípu) sme umelo zostrojili vzťah `String <: Int`, teda všade tam, kde očakávame `Int` teraz už vieme použiť priamo `String`. 

V posledných rokoch, hlavne vďaka knižniciam typu [scalaz][scalaz], [cats][cats], apod. sa Scala stala viac funkcionálnym jazykom. To znamená, že sa zmenilo aj mnoho best practices. Platí to aj pre užívanie implicitných konverzií, ktoré sa dnes už považujú za anti-pattern.

## Prípad 1

Hlavný dôvod, prečo je implicitná konverzia považovaná za anti-pattern je ten, že *nevieme ako sa program bude chovať
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
def connect(address: InetAddress): Boolean = ...
```
na:

```scala
def connect(address: Try[InetAddress]): Boolean = ...
```

čo zas kladie nepochopiteľné nároky na implementáciu metódy `connect` a z jej pohľadu je `Try` úplne nepotrebný.


## Prípad 2

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
