# Weryfikacja faktów — co jest na stronie i skąd to wiadomo

Zasada projektu: **na stronie jest tylko to, co udało się potwierdzić**. Poniżej pełna lista
informacji o firmie użytych na stronie, ich źródło oraz lista rzeczy, których świadomie **nie** ma.

## Jak prowadzony był research

- Link z Map Google oraz większość katalogów firm (m.in. strony z danymi z CEIDG) były **zablokowane
  przez sieciowy proxy środowiska**, w którym powstawała strona — nie dało się ich otworzyć
  bezpośrednio. Dane pochodzą więc z **wyników wyszukiwania**, które w kilku niezależnych zapytaniach
  zwracały te same, spójne informacje o jednym wpisie firmy w katalogach (SprawdzonyWarsztat.pl,
  krs-online.com.pl, owg.pl / CEIDG, cabb.pl, bazafirmdane.pl).
- Nie znaleziono: własnej strony firmy, profili w mediach społecznościowych, numeru telefonu,
  godzin otwarcia, listy usług, opinii, zdjęć ani logo.
- Dopasowanie wpisu z katalogów do wizytówki z Map Google: nazwa „U Czarnego” + mechanik, adres
  w miejscowości Kamela, a współrzędne z Twojego linku (54.223158, 18.24116) leżą ok. 0,85 km od
  środka wsi Kamela (54.2294, 18.2339 wg Wikipedii) — to spójne, ale jest to **wniosek**, nie
  bezpośredni odczyt Map Google. **Warto, żeby właściciel potwierdził poniższe dane.**

## Informacje użyte na stronie

| Informacja | Gdzie na stronie | Źródło / pewność |
| --- | --- | --- |
| Nazwa: „U Czarnego” Mechanik | nagłówek, hero, title, schema | Nazwa wizytówki z linku Map Google (w adresie URL) |
| Nazwa rejestrowa: Bartłomiej Skierka „U CZARNEGO” | stopka, zgoda w formularzu, schema `legalName` | Katalogi firm oparte na CEIDG (spójne w wielu wynikach) |
| Adres: ul. Jeziorna 44, 83-312 Kamela | wszędzie, schema `address` | Katalogi firm (spójne); miejscowość zgodna ze współrzędnymi z linku |
| Gmina Somonino, powiat kartuski, woj. pomorskie | hero, O warsztacie, Dojazd | Katalogi firm; Wikipedia (Kamela leży w gminie Somonino) |
| Zakres: konserwacja i naprawa pojazdów samochodowych (PKD 45.20.Z) | hero, O warsztacie, stopka, schema `description` | Główny PKD firmy w katalogach |
| NIP 5891970753, REGON 221822159 | stopka | Katalogi firm; obie liczby mają poprawne sumy kontrolne |
| Współrzędne wizytówki z linku Map Google | tylko w działających linkach (trasa, mapa) i w schema `geo` — nigdzie jako widoczny tekst | Bezpośrednio z podanego linku Map Google |
| Linki „Wyznacz trasę” / „Mapy Google” | hero, Dojazd, stopka, pasek mobilny | Oficjalny format linków Google Maps + link do wizytówki (bez parametrów śledzących) |

## Czego świadomie NIE ma na stronie

- usług, ofert, specjalizacji, marek pojazdów, cen, promocji, gwarancji, certyfikatów,
- daty rozpoczęcia działalności (usunięta na życzenie klienta) oraz współrzędnych jako widocznego tekstu,
- numeru telefonu, e-maila, godzin otwarcia, profili społecznościowych,
- opinii, ocen i liczby opinii (także w schema.org — brak `Review`/`AggregateRating`),
- informacji o właścicielu i pracownikach (poza nazwą rejestrową w stopce), historii firmy,
  liczb, statystyk, realizacji, klientów, partnerów,
- zdjęć (żadnych stockowych ani generowanych), logo,
- w schema.org brak `telephone`, `openingHoursSpecification`, `sameAs`, `priceRange`.

## Elementy graficzne — co to jest

- **Ornament „wskaźnika”** w hero i obraz udostępniania `og-image.jpg` to czysto dekoracyjna
  grafika wektorowa (okręgi, kreski, łuk) — bez liczb, tekstów i bez udawania logo.
- **Favicon** (`favicon.svg`, `.ico`, `apple-touch-icon.png`, ikony 192/512) to neutralny, tymczasowy
  znak (pierścień z łukiem), **nie jest logo firmy**. Po otrzymaniu prawdziwego logo — wymień.
- Nagłówek strony to sam zapis typograficzny nazwy, bez grafiki logo.

## Elementy wymagające decyzji właściciela

- **Zgoda RODO w formularzu** (krótka klauzula) — to minimalny tekst; przed uruchomieniem formularza
  warto potwierdzić go z właścicielem / prawnikiem i ewentualnie dodać politykę prywatności.
- **NIP/REGON/imię i nazwisko w stopce** — to dane jawne z rejestru działalności, ale właściciel
  może zdecydować, czy chce je pokazywać.
- **Formularz** nie jest podłączony do żadnego adresu — patrz `README.md`.
