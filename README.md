# „U Czarnego” Mechanik — strona internetowa

Statyczna strona-wizytówka (HTML + CSS + odrobina JavaScriptu, bez bibliotek i bez budowania)
dla warsztatu **„U Czarnego” Mechanik**, ul. Jeziorna 44, 83-312 Kamela (gmina Somonino).

> **Zasada projektu:** na stronie jest wyłącznie to, co udało się potwierdzić. Brakujące informacje
> (telefon, godziny, usługi, zdjęcia, opinie) nie są zastępowane wymyślonymi — mają gotowe miejsca
> do uzupełnienia. Szczegóły i źródła: [`docs/FACT-CHECK.md`](docs/FACT-CHECK.md).

## Co zawiera strona

One-page wizytówka: hero → o warsztacie (karta z potwierdzonymi danymi) → dojazd (mapa Google
ładowana po kliknięciu) → kontakt (formularz — sam frontend) → stopka. Do tego `404.html`,
`robots.txt`, `sitemap.xml`, dane strukturalne JSON-LD (`AutoRepair`), Open Graph / X Cards,
favicon i manifest.

Dlaczego nie wielostronicowy serwis: research potwierdził tylko podstawowe dane firmy, więc
dodatkowe podstrony byłyby wypełniane wymyśloną treścią. Gdy pojawią się usługi / galeria / opinie,
wystarczy wkleić gotowe sekcje (patrz niżej).

## Struktura plików

```
index.html                 strona główna (struktura + dane strukturalne w <head>)
404.html                   strona błędu
assets/css/tokens.css      fonty, kolory, typografia, odstępy (zmiana wyglądu = tu)
assets/css/base.css        reset, typografia, układ, dostępność
assets/css/components.css  przyciski, nagłówek, hero, sekcje, formularz, stopka, komponenty na przyszłe treści
assets/js/site-config.js   konfiguracja (adres wysyłki formularza)
assets/js/main.js          menu mobilne, animacje wejścia, mapa, formularz, kopiowanie adresu
assets/fonts/              Inter + Space Grotesk (podzbiór: łacina + polskie znaki, licencja OFL)
assets/img/                og-image.jpg (grafika do udostępniania), ikony PWA
docs/FACT-CHECK.md         lista potwierdzonych faktów i ich źródeł
docs/snippets/             gotowe sekcje do wklejenia: usługi, galeria, opinie, telefon + godziny
scripts/set-domain.sh      podmiana __DOMAIN__ na prawdziwą domenę
.htaccess                  konfiguracja Hostingera (cache, kompresja, 404, nagłówki)
```

## Podgląd lokalny

```bash
python3 -m http.server 8000
# otwórz http://localhost:8000
```

Ścieżki do zasobów są absolutne (`/assets/...`), więc strona musi działać w głównym katalogu
domeny (tak jak na Hostingerze) — nie otwieraj `index.html` bezpośrednio z dysku.

## Wdrożenie na Hostingerze

1. **Domena:** po wybraniu domeny uruchom `scripts/set-domain.sh twojadomena.pl`. Podmieni znacznik
   `__DOMAIN__` w `canonical`, Open Graph, JSON-LD, `sitemap.xml` i `robots.txt`.
   Sprawdź potem: `grep -r "__DOMAIN__" --exclude-dir=docs --exclude-dir=.git .` — nie powinno nic zwrócić.
2. **Publikacja** (do wyboru):
   - *Git:* w hPanel → Zaawansowane → Git podłącz to repozytorium (katalog docelowy `public_html`),
     potem „Deploy”; kolejne zmiany to `git push` + „Deploy”.
   - *Ręcznie:* wgraj zawartość repozytorium do `public_html` (menedżer plików lub FTP).
   Pliki `docs/`, `scripts/` i `*.md` są blokowane w `.htaccess` (zwracają 404).
3. **SSL:** włącz darmowy certyfikat w hPanelu, a następnie odkomentuj sekcję „Wymuszenie HTTPS”
   w `.htaccess`.
4. **Google:** dodaj stronę w Google Search Console i zgłoś `https://twojadomena.pl/sitemap.xml`.
   Na wizytówce Google Maps warto wpisać adres nowej strony.

## Uruchomienie formularza

Formularz ma kompletny frontend (walidacja, komunikaty, dostępność, pole-pułapka na boty), ale
**nie ma backendu ani adresu e-mail** — celowo nic nie wymyślono.

1. Wybierz sposób odbioru wiadomości: usługa formularzy (Formspree, Getform, Web3Forms…) albo
   własny skrypt PHP na hostingu.
2. Wpisz adres wysyłki w `assets/js/site-config.js` → `formEndpoint`. Formularz wyśle `POST`
   (FormData) i oczekuje odpowiedzi 2xx.
3. Żółta uwaga „Tryb podglądu” pod formularzem zniknie automatycznie.
4. Przed startem potwierdź z właścicielem treść zgody RODO przy formularzu (`index.html`).

## Uzupełnianie treści od klienta

Każdy brakujący element ma gotowy, ostylowany kod w `docs/snippets/` oraz komentarz
`[UZUPEŁNIJ]` w miejscu, w które należy go wkleić:

| Brakuje | Snippet | Dodatkowo |
| --- | --- | --- |
| Usługi | `uslugi.html` | link w nawigacji (nagłówek i stopka) |
| Zdjęcia / realizacje | `galeria.html` | tylko prawdziwe zdjęcia, `.webp`, realne `width`/`height` |
| Opinie | `opinie.html` | tylko prawdziwe, z podaniem źródła |
| Telefon, e-mail, godziny | `kontakt-telefon-godziny.html` | dopisz do JSON-LD (`telephone`, `openingHoursSpecification`) i dodaj „Zadzwoń” do paska mobilnego |
| Logo | — | zamień `favicon.*`, `apple-touch-icon.png`, `assets/img/icon-*.png`, `og-image.jpg`; w nagłówku dodaj `<img>` |
| Prawdziwe zdjęcie do hero / OG | — | tylko zdjęcie firmy, za zgodą właściciela |

## Lista kontrolna przed publikacją

- [ ] Ustawiona domena (`set-domain.sh`), brak `__DOMAIN__` w plikach
- [ ] Podłączony `formEndpoint` i wysłana wiadomość testowa
- [ ] Właściciel potwierdził dane z `docs/FACT-CHECK.md` (adres, nazwa, NIP/REGON w stopce)
- [ ] Uzupełnione telefon i godziny (lub świadoma decyzja, że ich nie podajemy)
- [ ] Włączony SSL i przekierowanie HTTPS
- [ ] Test na telefonie: menu, formularz, przyciski „Wyznacz trasę”, mapa po kliknięciu
- [ ] Sitemap zgłoszona w Google Search Console

## Technikalia

- Brak zależności i etapu budowania. JS ~12 kB (~4 kB po gzip), CSS ~36 kB (~9 kB po gzip), fonty ~47 kB (WOFF2, podzbiór).
- Mapa Google to zewnętrzny `iframe` ładowany dopiero po kliknięciu (szybkość + prywatność).
- Dostępność: link „Przejdź do treści”, widoczny fokus, obsługa klawiatury i `Esc` w menu,
  `aria-*` w formularzu i menu, `prefers-reduced-motion`, kontrasty zgodne z WCAG AA.
- Formatowanie: Prettier (`.prettierrc.json`), `.editorconfig`.

## Licencje

Fonty: Inter i Space Grotesk na licencji SIL OFL 1.1 (pliki licencji w `assets/fonts/`).
