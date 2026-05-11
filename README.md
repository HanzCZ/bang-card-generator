# Bang! Card Generator

Nástroj pro tvorbu vlastních karet do karetní hry **Bang!** — přímo v prohlížeči, bez instalace.

**Live: https://hanzcz.github.io/bang-card-generator/**

## Funkce

- Typy karet: Action, Blue Item, Green Item, Character (3–6 životů)
- Import vlastního artworku (drag & drop nebo výběr souboru)
- Volitelný artwork expanze
- Výběr hodnoty a barvy karty (nebo náhodně)
- Název, podtitulek, autor, popis s automatickým zalamováním
- Vignette efekt na artworku
- Generování zadní strany karty
- Export jako PNG v tiskové kvalitě (300 DPI)

## Vývoj

```bash
npm install
npm run dev
```

## Nasazení

```bash
npm run deploy
```

Buildne projekt a pushne na větev `gh-pages`.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Canvas API (generování karet v prohlížeči)
