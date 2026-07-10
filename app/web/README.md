# Mit Mikrobryggeri — app (web)

Pixel-perfekt implementering af designet fra `../../project/Mit Mikrobryggeri.dc.html`
(Claude Design-eksport). Stilrent, minimalistisk, håndværker-varmt — dansk hele vejen.

Bygget med **Next.js (App Router) + React + Tailwind + CSS-variabler**, jf. stakken i
`../../project/CLAUDE.md`. Dette er første pass: **alle 16 skærme som trofaste, navigerbare
UI'er med mock-data**. Auth, database, Stripe og MitID-alderskontrol er endnu ikke koblet på
(se `CLAUDE.md` §2–§8 for den planlagte arkitektur).

## Kom i gang

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build && npm run start` for produktionsbygget.

## Skærme & ruter

Forsiden (`/`) er et **galleri**, der viser alle 16 skærme i telefonrammer — samme opdeling
som design-lærredet (sæt 3A, 2A, 1A). Hver skærm har også sin egen rute:

| # | Skærm | Rute |
|---|---|---|
| 13 | Kortet (offentligt danmarkskort) | `/kort` |
| 14 | Bryggeri-profil (offentlig) | `/bryggeri/[slug]` |
| 15 | Planer (Gratis/Starter/Pro) | `/planer` |
| 07 | Mine bryggerier (tenants, brugere/roller) | `/system/bryggerier` |
| 08 | Indstillinger (hub) | `/system/indstillinger` |
| 09 | Bryggeri (profil, tanke) | `/system/indstillinger/bryggeri` |
| 10 | Lager (grænser, leverandører) | `/system/indstillinger/lager` |
| 11 | Online salg (webshop, betaling) | `/system/indstillinger/salg` |
| 12 | Statistik (omsætning, kanaler) | `/system/statistik` |
| 01 | Hjem (bryggerens forside) | `/system` |
| 02 | Brygninger | `/system/brygninger` |
| 03 | Gæringslog (SG-kurve) | `/system/brygninger/[nr]` |
| 04 | Lager | `/system/lager` |
| 05 | Salg & taproom | `/system/salg` |
| 06 | Bestil øl (kundeflade) | `/bestil/[slug]` |

Bundnavigationen i bryggerens app (HJEM · BRYG · LAGER · SALG) og indstillings-hubben er
klikbare, så flowet kan gennemgås.

## Designsystem

Kilden til sandhed er `src/app/globals.css` (tokens + komponentklasser) spejlet i
`design-system/tokens.css`, jf. `CLAUDE.md §9`.

- **Fonte**: Lora (display/titler/tal) + Instrument Sans (UI/body) via `next/font`.
- **Farver**: `--baggrund #FBF7F0`, `--accent #A85B1F` (kobber), `--succes #4A6741`,
  `--advarsel #C98A2C`, `--fremhaev #E8C36A`, mørk flade `#211B12`.
- **Komponentklasser**: `.kort`, `.btn-primary/.btn-accent/.btn-sekundaer`, `.pille-*`,
  `.toggle`, `.segment`, `.form-input`, `.bjaelke`.
- **Accent-varianter** (Tweaks): sæt `data-accent="humle"` eller `"dybblaa"` på et element.

## Struktur

```
src/
├── app/                       # Next.js App Router — ruter + globals.css
├── components/
│   ├── PhoneFrame.tsx         # iOS-enhedsramme (port af ../../project/ios-frame.jsx)
│   ├── PhoneRoute.tsx         # centrerer én skærm på lærredet
│   ├── ui.tsx, rows.tsx       # delte primitiver (Screen, BottomNav, Toggle, rækker)
│   └── screens/               # de 16 skærme
├── lib/nav.ts                 # bundnavigation pr. flade
design-system/tokens.css       # token-spejl
```
