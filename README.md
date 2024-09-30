# Cestovatelský deník

Aplikace slouží k zaznamenávání cest uživatele. Uživatel může prostřednictvím formuláře a interaktivní 
mapy přidávat jednotlivé cesty, které obsahují informace o místě, datu a poznámkách z cesty.

## Specifikace

- Hlavní funkce:
	- zobrazení seznamu cest
		- cesty jako dlaždicový seznam
		- možnost odstranení cesty
		(- editace cesty)
	- zobrazení detailu cesty
		- zobrazí popisek a mapu
		(- editace cesty)
	- přidání nové cesty
		- výběr lokace na mapě
		- nastavení popisku, data, ...
		- přidání více lokací pro vytvoření cesty
	- zobrazení všech cest na mapě
		(- kliknutí na cestu pro zobrazení detailů)

## Technologie

- Python backend, ve Flasku
- Frontend:
	- Dominik Borek: React
	- Radek Jestřabík: Vue
	- Ondřej Hruboš: Svelte