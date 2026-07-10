# Mit Mikrobryggeri — app (web)

Pixel-perfekt implementering af designet fra `../../project/Mit Mikrobryggeri.dc.html`
(Claude Design-eksport). Stilrent, minimalistisk, håndværker-varmt — dansk hele vejen.

Bygget med **Next.js (App Router) + React + Tailwind + CSS-variabler + SQLite**, jf. stakken i
`../../project/CLAUDE.md`.

- **UI**: alle 16 skærme som trofaste, navigerbare skærme (i første omgang med mock-data i
  komponenterne).
- **Backend-fundament**: SQLite-skema + idempotente migrationer, tier→feature-mapping,
  rolle→rettighed-mapping, hjemmerullet JWT-auth (to brugertyper), tenant-udledning,
  per-tenant konfiguration med defaults i kode, subdomæne-middleware, begge Stripe-
  integrationer (platform-abonnement + tenantens egen PSP), samt eksempel-API'er.

Resend-email, MitID-alderskontrol (§8) og cron-jobs er de næste byggeklodser; live Stripe-
nøgler er ikke sat (endpoints degraderer pænt), og skærmene læser endnu mock-data, ikke live-DB.

## Kom i gang

```bash
cp .env.example .env      # udfyld SESSION_SECRET, ADMIN_USERS m.m.
npm install
npm run dev               # http://localhost:3000
```

`npm run build && npm run start` for produktionsbygget. Ved opstart (se
`src/instrumentation.ts`) forberedes DB'en, admins seedes fra `ADMIN_USERS`, og demo-data
indlæses når `SEED_DEMO=1` (auto i udvikling). Demo-login: `anders@enghave.dk` / `bryg1234`.

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

## Backend-fundament (`src/lib/`)

Følger mønstrene i `../../project/MicroSaas-template.md` og beslutningerne i `CLAUDE.md`.

| Fil | Ansvar |
|---|---|
| `lib/db.ts` | SQLite (better-sqlite3, WAL) · alle §5-tabeller · idempotente migrationer · in-memory under build |
| `lib/tier.ts` | `Tier` → `Feature`-mapping (`harFeature`) — samme kilde for UI og API (§2) |
| `lib/roller.ts` | Tenant-rolle → `Rettighed` (ejer/brygger/taproom, §3) |
| `lib/auth.ts` | JWT via `jose` · scrypt-kodehash · host-only cookie · to brugertyper · admin-seed |
| `lib/system/tenant.ts` | Tenant fra session (workspace) hhv. Host-header (kundeflade) · slug-generering |
| `lib/system/indstillinger.ts` | Nøgle/værdi-config med **defaults i kode** (§4.5) |
| `lib/stripe.ts` | **Platformens** abonnement (§6.1): checkout + webhook→tier |
| `lib/system/kundeStripe.ts` | **Tenantens egen** PSP (§6.2): slutkunde-betaling + per-tenant webhook |
| `middleware.ts` | Subdomæne → Host-header-routing (§4.1) — edge, ingen DB |
| `lib/seed.ts` | Demo-data der spejler designet (Bryghuset Enghave m.fl.) |
| `instrumentation.ts` (+ `-node`) | Opstarts-hook: DB-init, admin-seed, demo-seed |

### Multi-tenancy (middleware)

`{slug}.{ROOT_DOMAIN}` udpeger en tenant. `middleware.ts` (edge) rewriter internt:
workspace/auth/API-stier (`/system`, `/login`, `/api`) passerer uændret (værktøjet virker
også på subdomænet; tenant udledes af sessionen), mens alt andet rewrites til kundefladen
`/bestil/{slug}`. På roddomænet sker ingen rewrite → det offentlige site.
**Reverse-proxyen SKAL bevare Host-headeren** (sæt aldrig en Host-override — §7).

### Betaling — to adskilte Stripe-integrationer (§4.4)

1. **Platform** (`lib/stripe.ts`): platformens egen konto, én webhook der sætter
   `bryggerier.tier`. Sådan tjener platformen penge.
2. **Tenant** (`lib/system/kundeStripe.ts`): tenantens *egne* nøgler i config; slutkunde-
   betalinger (MobilePay/kort via Stripe) går til tenantens konto. Webhooken er **per-tenant**
   med id i URL'en, fordi secret'en skal vælges før signaturen kan valideres.

Uden Stripe-nøgler svarer endpoints pænt: `503` (ikke konfigureret), `401/403` (auth),
`400` (signatur/ugyldigt input) — så flowet kan udvikles uden live-nøgler.

**Sikkerhedsgrænser** fra template §4.2/§7 er overholdt: tenant udledes af sessionen i
workspacet (aldrig af URL), cookien er host-only, betaling og godkendelse er adskilte gates
(tilmelding låser workspacet, admin-godkendelse gater kun kort-synlighed).

### Eksempel-API'er

| Rute | Formål |
|---|---|
| `GET /api/health` | DB-tjek |
| `GET /api/directory` | Offentlig liste over **godkendte** bryggerier (kort/liste) |
| `POST /api/auth/login` | Login (`{email, kode, konto?}`) → host-only session-cookie |
| `POST /api/auth/logout` | Ryd session |
| `GET /api/auth/mig` | Whoami — verificér session, udled tenant, tier-features, rettigheder |
| `POST /api/tilmeld` | Opret bryggeri (`afventer_godkendelse`) + ejer, log ind |
| `POST /api/system/abonnement/checkout` | Start platform-abonnement-checkout (ejer, tier) |
| `POST /api/payments/stripe/webhook` | Platform-webhook → sætter tier |
| `POST /api/payments/stripe/webhook/[bryggeriId]` | Tenantens egen webhook → markér bestilling betalt |

## Struktur

```
src/
├── app/                       # Next.js App Router — ruter + globals.css + api/
├── components/
│   ├── PhoneFrame.tsx         # iOS-enhedsramme (port af ../../project/ios-frame.jsx)
│   ├── PhoneRoute.tsx         # centrerer én skærm på lærredet
│   ├── ui.tsx, rows.tsx       # delte primitiver (Screen, BottomNav, Toggle, rækker)
│   └── screens/               # de 16 skærme
├── lib/                       # backend-fundament (db, tier, roller, auth, system/)
├── instrumentation.ts         # opstarts-hook (DB-init, seeding)
design-system/tokens.css       # token-spejl
```
