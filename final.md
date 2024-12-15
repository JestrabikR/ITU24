# Cestovatelský deník

- autoři: **Dominik Borek** (xborek12), Ondřej Hruboš (xhrubo01), Radek Jestřabík (xjestr04)

## Cíl projektu

Aplikace slouží k zaznamenávání cest uživatele. Hlavní funkctionalitou bude zaznamenávání jednotlivých cest, které 
obsahují informace o místě, datu a poznámkách z cesty. Vedlejší funkcionalitou bude interaktivní mapa, kde si uživatel bude moci zadat země, kam se chce podívat
nebo kde už byl.

Aplikace bude implementována ve třech variantách, každý člen týmu zpracuje svou vlastní verzi. Všechny verze budou 
implementovány jako webové aplikace založené na moderních technologiích.

- Hlavní funkce:
	- zobrazení seznamu cest
    - zaznamenávání cesty
    - editace cesty
    - cesty jako dlaždicový seznam
        - zobrazení detailu cesty
            - zobrazí popisek a mapu
            - editace cesty
        - přidání nové cesty
            - výběr lokace na mapě
            - nastavení popisku, data, ...
            - přidání více lokací pro vytvoření cesty
        - zobrazení všech cest na mapě
            - kliknutí na cestu pro zobrazení detailů
    - přidání/odstranění navštívné země na interaktivní mapě
    - přidání/odstranění země, kterou chce uživatel navštívit, na interaktivní mapě

## Rozdělení práce v týmu

Každý člen týmu se podílel na tvorbě backendu (ve formě API), poté si každý člen vytvořil sám celou aplikaci, která 
komunikuje s tímto backendem. Každý z členů si vybral různé technologie (jiný frontend framework).

## Připomínky z kontrolní prezentace

Při kontrolní prezentaci nebyly vzneseny žádné připomínky k návrhu aplikace.

## Aplikace ve SvelteKit (Ondřej Hruboš)

### Video

Představení projektu ve formě videoprezentace naleznete na adrese [https://youtu.be/_oA2Tvl0v1o](https://youtu.be/_oA2Tvl0v1o)

### Spuštění

Aplikace se spustí příkazem `npm run dev -- --open` **v složce /svelte/** (přepínače `-- --open` slouží k přímému otevření aplikace ve výchozím prohlížeči).
*Před spuštěním aplikace* je potřeba spustit API v hlavní složce pomocí příkazu `make` nebo pomocí sekvence příkazů ve složce ```api/``` (vytvoření a stažení knihoven stačí udělat jednou, spustit se musí vždy při otevření nové konzole):
  - Vytvoření virtuálního prostředí: ```python -m venv .venv```
  - Aktivování virtuálního prostředí: ```.venv\Scripts\activate```
  - Stažení knihoven: ```pip install -r requirements.txt```
  - Spuštění backendu: ```python main.py```.

### Implementace
Frontend aplikace byl implementován ve frameworku **SvelteKit**. API, implementované ve frameworku **Flask**, zpřístupňuje endpointy frontendové aplikaci, díky 
nimž aplikace získává data a odesílá data. Vzhled byl vytvářen pomocí knihovny **BeerCSS**. BeerCSS využívá knihovny *Material symbols and icons* od společnosti
Google, pro zobrazování ikon. Pro vykreslování a práci s mapou byla použita knihovna `leaflet.js`. Graf na stráce *Visited* je vykreslován knihovnou `chart.js`.

Všechny stránky jsou implementovány v složce `src/routes/`. Bylo využito routování frameworku SvelteKit, kdy každý soubor a složka představuje routu. Následující routy zpracovávají stránky:

- `trip/[tripId]/+page.svelte` - dynamická routa, která zpracovává detail cesty
- `visited/+page.svelte` - stránka se seznamem navštívených zemí
- `+page.svelte` - hlavní stránka aplikace, která zobrazuje seznam všech výletů
- `+error.svelte` - stránka, která zpracovává správné zobrazení v případě chyby
- `+layout.svelte` - výchozí layout, kterými se řídí všechny routy.

Ve složce `src/libs/` jsou dodatečné pomocné soubory, zejména soubor `helper.js`. 
Komponenty vytvořené pro aplikaci se nachází ve složce `src/components/`. Nejpoužívanější komponenout je `Navbar.svelte`, která zpracovává responzivní menu
v aplikaci.

Pro komunikaci mezi stránkami bylo využito techniky *store*. V aplikaci se nachází jeden 
store, `src/stores/flashStore.js`, který zaručuje vypsání zprávy po odstranění výletu.

Jako CSS framework byla vybrána knihovna BeerCSS. Pomocí ní bylo implementováno rozhraní aplikace, včetně zpracování responzivního zobrazení.

### Testování

- Uživatelka:
    - *Studentka vysoké školy (věk 20 let)*
    - Pohlaví: ženské
    - Technická zdatnost: průměrná
    - Pracovní zaměření: archivnictví

- Průběh testu:
    - Test probíhal prezenčně po dobu 15 minut.
    - Uživatelka dostala základní informace o aplikaci a scénáře, které měla splnit.
        - Scénář 1: Zaznamenání informací o výletu, na který se připravuje
        - Scénář 2: Zaznamenání informací o výletu, který  nedávno absolvovala
        - Scénář 3: Úprava některého z přidaných výletů
        - Scénář 4: Přidání navštívených zemí do aplikace
        - Scénář 5: Přidání zemí, kam se chce v budoucnu podívat, do aplikace
    - Uživatelka byla instruována, aby nahlas popisovala, co se snaží udělat, co očekává, nebo co jí není jasné. Byla sledována její práce s uživatelským rozhraním, chápání funkcí a reakce na neočekávané situace.

- Výsledky testování:
    - Scénář 1: proběhl víceméně bez problému, jediný problém nastal při prvotním přidávání místa v rámci podvýletu, kdy nebylo jasné jak přidat místo. Na základě této
    zpětné vazby byl přidán popisek k mapě vyzívající zvolit lokaci na mapě.
    - Scénář 2: proběhl bez problému.
    - Scénář 3: bylo zjištěno, že uživatelka často zapomínala kliknout na uložení změn. Na základě tohoto pozorování bylo přidáno automatické uložení pokud uživatel
    klikne na tlačítko Apps (9 teček) v EditBaru.
    - Scénář 4: proběhl bez problému
    - Scénář 5: uživatelka na první pohled neviděla tlačítko přepnutí pro označení země na mapě, jelikož odscrollovala na stránce dolů. Také jí nebylo na první pohled
    jasné, co vlastně tlačítko dělalo. Nejprve myslela, že sloužilo pro filtrování (zobrazování) pouze jedné vybrané kategorie.
    - Uživatelka byla schopna se zorientovat v aplikace poměrně rychle. Pozitivním zjištěním bylo, že uživatelka byla schopna split všechny scénáře bez nápovědy.

- Klíčové poznatky:
    - Uživatelka velmi často zapomínala na manuální ukládání provedených změn. Z tohoto důvodu bylo přidáno automatické ukládání po přepnutí na hlavní stránku z detailu výletu.
    - Přepínací tlačítko na stránce "Visited" nevyjadřuje přesně svou funkci. Z důvodu tohoto zjištění byl přidán vysvětlující text vedle tlačítka.

## Aplikace v React (Dominik Borek)

Nezapomenout na popis spuštění
### Implementace

### Testování


## Aplikace ve Vue (Radek Jestřabík)
Celá aplikace byla implementována Radkem Jestřabíkem.

### Video
Odkaz na video prezentaci:
https://youtu.be/96_JvVEUEI0


### Spuštění
Aplikace se spouští pomocí příkazu `npm run dev` ve složce /vue/travel-journal/. Před spuštěním aplikace musí být spuštěno také API. popis spuštění API lze nalézt v souboru *README.md*.

### Implementace
Aplikace byla implementována ve frontendovém frameworku Vue.js, což je open-source framework pro Javascript. Také bylo využito Tailwind CSS, což je CSS framework, který usnadňuje práci při vytváření stylů a komponent.

#### **Komponenty**
Při vytváření uživatelského rozhraní je užitečné vytvářet komponenty, což jsou znovupoužitelné části kódu, které ale neslouží pouze pro znovupoužití, ale také ke zjednodušení čitelnosti kódu na stránkách, kde se využívají.

**Vybrané zajímavé komponenty (složka `src/components/`):**
- ***Navbar.vue*** - komponenta pro menu, které se zobrazuje na každé obrazovce
- ***SubtripForm.vue*** - tato komponenta slouží k zobrazení modalového okna a formuláře pro upravení výletu v rámci cesty.
- ***TripMap.vue*** - komponenta, která zobrazuje mapu s jednotlivými výlety v detailu cesty. Každý výlet má značku na mapě a jsou spojeny čarou postupně tak, jak probíhaly za sebou podle data. Spojení na mapě je vytvořeno z důvodu rychlejší orientace a zvýšení uživatelské přívětivosti.

#### **Obrázky a ikony**
Ve Vue.js je velmi jednoduchá práce s ikonami i s obrázky. Ikony se používají

#### **Stránky**
Jednotlivé stránky jsou vytvořeny ve složce `src/pages`.

#### **Uchování stavu mezi jednotlivými stránkami**
Vzhledem k tomu, že jsou stránky `TripForm.vue` a `SubtripForm.vue` oddělené do samostatných souborů, ale data se ukládají v rámci jednoho formuláře, bylo nutné si nějakým způsobem předávat data. Byl zvolena balíček *pinia*, který vytváří dočasné úložiště (anglicky *stores*), pomocí kterého je možné přenášet data mezi stránkami.

### Testování
Testování výsledné aplikace proběhlo se studentem střední školy se zaměření na IT, který má 18 let. Test probíhal dobře, uživatel se v aplikaci z většiny orientoval rychle a byl si vědomý, čeho chce dosáhnout. Jediné, kde měl lehce problémy bylo s výběrem navštívených zemí na mapce, protože si nebyl jistý jak vybírat navštívené a plánované země, myslel si, že přepínací tlačítko slouží ke změně režimu zobrazení. Toto by se dalo vylepšit důraznějším a změněným textem nad tlačítkem. Další nejistota byla při vracení se na hlavní stránku, že si nebyl jistý, která stránka je hlavní. Tento problém, by mohl mít řešení takové, že by se přidala ikona aplikace do navigačního menu, protože tu uživatelé mají spojenou s hlavní stránkou.
