# MicroSaaS-template

Generaliseret teknisk skabelon udledt af **Mit Mikrobageri** — en multi-tenant platform med
offentligt directory (kort/liste over godkendte udbydere), selvbetjent tilmelding med
abonnements-tiers, og et per-tenant "workspace" (her: bestillingssystem) hvor hver kunde får sit
eget subdomæne.

Brug filen sådan: læs **arkitektur-mønstrene** som en menu af byggeklodser, svar på
**afklaringerne** til sidst, og lad svarene bestemme hvilke klodser der er med, og hvad de skal
hedde i dit domæne. Alt herunder er skrevet domæne-neutralt; erstat de **`{krøllede}`** pladsholdere.

---

## 1. Hvad mønsteret grundlæggende er

En **B2B2C micro-SaaS med tre lag**:

1. **Platform / directory (B→marked)** — en offentlig side der viser *godkendte* tenants
   (på et kort, en liste eller et søgeindeks). Dette er marketing- og opdagelses-laget.
2. **Selvbetjent tilmelding + abonnement (B→tenant)** — en udbyder tilmelder sig, betaler et
   abonnement, og får øjeblikkelig adgang. Platformen tjener penge her.
3. **Per-tenant workspace + slutkunde-flade (tenant→C)** — hver betalende tenant får sit eget
   værktøj (dashboard) OG sin egen offentlige kundeside på `{slug}.{roddomæne}`, hvor tenantens
   egne slutkunder interagerer (bestiller, booker, køber osv.).

Nøgle-designbeslutning der går igen: **betaling og godkendelse er adskilte gates.**
Betaling låser workspacet op *øjeblikkeligt* (ingen manuel provisionering); admin-godkendelse
gater *kun* synlighed i det offentlige directory. Det gør onboarding friktionsfri uden at give
slip på kvalitetskontrol af det offentlige udstillingsvindue.

```
                 ┌─────────────────────────────────────────────┐
   offentlig  →  │  DIRECTORY  ({roddomæne})                    │  godkendte tenants
                 │  kort/liste, salgssider, tilmelding          │
                 └───────────────┬─────────────────────────────┘
                                 │ tilmeld + betal (Stripe abonnement)
                                 ▼
                 ┌─────────────────────────────────────────────┐
   tenant     →  │  WORKSPACE  ({roddomæne}/system)            │  låst op af betaling
                 │  dashboard, indstillinger, tier-features     │
                 └───────────────┬─────────────────────────────┘
                                 │ tenantens egen konfiguration
                                 ▼
                 ┌─────────────────────────────────────────────┐
   slutkunde  →  │  KUNDEFLADE  ({slug}.{roddomæne})           │  én pr. tenant
                 │  bestil/book/køb — tenantens egen Stripe     │
                 └─────────────────────────────────────────────┘
```

---

## 2. Referencestack

Minimalistisk, single-server, ingen ekstern managed database. Bevidst valgt for lave driftsomkostninger.

| Lag | Reference-valg | Rolle |
|---|---|---|
| Framework | **Next.js (App Router) + React** | SSR, API-routes, middleware/proxy til tenant-routing |
| Styling | **Tailwind + CSS-variabler** i en `globals.css` med færdige komponentklasser | Ét designsystem, tokens synkron med en `design-system/`-mappe |
| Database | **SQLite** (`better-sqlite3`, WAL) på disk | Én fil, ingen DB-server; god nok til single-node |
| Sessioner | **JWT via `jose`** i host-only cookie | To brugertyper (tenant + admin), signeret token |
| Email | **Resend** (eller anden transaktionel udbyder) | Velkomst, nulstilling, godkendelse/afvisning |
| Betaling (platform) | **Stripe** abonnementer | Tier-baseret månedsbetaling |
| Betaling (tenant) | **Stripe** — tenantens *egne* nøgler | Slutkunde-betalinger, per-tenant webhook |
| Kort/geo (hvis relevant) | **MapLibre GL** + geokodnings-endpoint | Kun hvis directory er geografisk |
| i18n (valgfrit) | **next-intl**, namespaces pr. flade | Landedetektion via reverse-proxy-header |
| Deploy | **Docker → GHCR → single Linux-server**, reverse proxy med wildcard-subdomæner | Auto-deploy ved merge til `main` |

> Byt frit: managed Postgres i stedet for SQLite, Auth-provider i stedet for hjemmerullet JWT,
> anden PSP end Stripe. Mønstrene nedenfor er uafhængige af disse valg — kun implementeringen ændrer sig.

---

## 3. Mappestruktur (reference)

```
{repo}/
├── {app}/                      # hele applikationen
│   ├── app/
│   │   ├── [locale]/           # offentlige + tenant-sider (i18n-scoped)
│   │   │   └── system/         # tenant-workspace (dashboard)
│   │   ├── b/[slug]/           # slutkunde-flade pr. tenant (uden [locale])
│   │   └── api/
│   │       ├── auth/*          # login, logout, nulstilling
│   │       ├── tilmeld         # tilmelding af ny tenant
│   │       ├── {directory}     # offentligt GET af godkendte tenants
│   │       ├── system/*        # tenant-workspace-API (tenant fra session)
│   │       ├── bestil/*        # slutkunde-API (tenant fra Host-header)
│   │       ├── payments/stripe/webhook/[tenantId]  # tenantens egen PSP-webhook
│   │       └── cron/*          # tidsstyrede jobs (bearer-beskyttet)
│   ├── lib/
│   │   ├── auth.ts             # JWT, to brugertyper
│   │   ├── db.ts               # skema + idempotente migrationer
│   │   ├── tier.ts             # tier→feature-mapping
│   │   ├── stripe.ts           # PLATFORMENS abonnementer
│   │   └── system/             # domænelogik pr. tenant (alle tager tenantId først)
│   │       ├── tenant.ts       # udled tenant af Host-header
│   │       ├── indstillinger.ts# nøgle/værdi-config pr. tenant m. defaults
│   │       └── kundeStripe.ts  # tenantens EGEN PSP
│   ├── proxy.ts (middleware)   # subdomæne → intern rewrite
│   ├── messages/*.json         # i18n
│   └── Dockerfile, docker-compose.yml, entrypoint.sh
├── design-system/              # DESIGNGUIDE, tokens.css/json, components.md
└── docs/                       # drift, produkt, vækst, historik
```

---

## 4. Kerne-arkitekturmønstre (byggeklodserne)

### 4.1 Multi-tenancy via subdomæne + Host-header-routing
- Hver tenant har en unik **`slug`** (genereret ved tilmelding, backfilled idempotent).
- Én middleware (`proxy.ts`) læser `Host`-headeren og **rewriter internt**:
  - `{slug}.{roddomæne}/...` → `/b/{slug}/...` (slutkunde-flade)
  - En hvidliste af stier (`/login`, `/system*`, `/profil` …) rewrites til tenantens *workspace* i
    stedet for kundefladen, så **hele værktøjet også virker direkte på subdomænet**.
- **Reverse proxy skal bevare den oprindelige Host-header.** (Cloudflare Tunnel gør det som
  standard — sæt IKKE en Host-override, ellers peger alle subdomæner på samme tenant.)
- Wildcard-DNS (`*.{roddomæne}`) + wildcard-TLS.

### 4.2 To brugertyper, delt cookie-mekanik
- Én signeret JWT-cookie, men to roller: **tenant** (email+kode, i `{tenants}`-tabellen) og
  **admin** (i `admin_brugere`, seedet fra en `ADMIN_USERS`-env ved opstart).
- Cookien er **host-only** — deles bevidst IKKE med subdomænerne som en wildcard-cookie ville;
  sessionen sættes separat pr. subdomæne ved login.
- **Tenant udledes ALDRIG fra URL/params i workspacet** — altid fra sessionen. På slutkunde-fladen
  udledes tenant af Host-headeren (med slug-param som fallback). Denne asymmetri er en
  sikkerhedsgrænse: workspace-data må aldrig kunne tilgås ved at gætte en anden tenants id i URL'en.

### 4.3 Tier-gatede features
- Central `tier.ts` mapper `{gratis|starter|pro|…}` → et sæt boolean-features.
- UI og API tjekker samme kilde. En Stripe-webhook sætter `{tenants}.tier`, og workspacet
  **låses op øjeblikkeligt** — ingen manuel provisionering.
- Visuelle konsekvenser kan også hænge på tier (fx directory-markørens størrelse/prominens).

### 4.4 To adskilte betalings-integrationer
Dette er det mest subtile mønster — hold dem strengt adskilt:
1. **Platformens abonnement** (`lib/stripe.ts`) — platformens egen Stripe-konto, én webhook,
   sætter tenantens tier. Dette er hvordan *du* tjener penge.
2. **Tenantens egen PSP** (`lib/system/kundeStripe.ts`) — hver tenant lægger sine *egne*
   Stripe-nøgler i sin config; slutkunde-betalinger går til tenantens konto.
   Webhooken er **per-tenant med id i URL'en** (`/api/payments/stripe/webhook/[tenantId]`) fordi
   webhook-secret'en skal vælges *før* signaturen kan valideres.

### 4.5 Per-tenant konfiguration som nøgle/værdi
- En `{tenant}_indstillinger`-tabel (nøgle, værdi, tenantId) med **defaults i kode** —
  ingen seed-rækker pr. tenant. En ny tenant "arver" alle defaults gratis; kun afvigelser gemmes.

### 4.6 Godkendelses-flow (adskilt fra betaling)
1. Tenant udfylder tilmelding → status `afventer_godkendelse`, slug genereres, evt. geokodning.
2. Admin godkender/afviser → transaktionel email sendes.
3. Godkendt tenant vises i det offentlige directory.
- **Godkendelse gater KUN directory-synlighed.** Workspacet er allerede låst op af betaling.

### 4.7 Database-hygiejne
- **Idempotente migrationer**: `try/catch ALTER TABLE`-mønster, kører sikkert ved hver opstart.
- **In-memory DB under build** (undgår fil-lock fra parallelle build-workers).
- Alle tenant-tabeller har en `{tenant}_id`-kolonne; alle domæne-funktioner tager `tenantId`
  som første argument (konsekvent tenant-scoping).
- WAL-tilstand → backup skal tage alle tre filer (`.db` + `-wal` + `-shm`) eller bruge `.backup`.

### 4.8 Uploads pr. tenant
- Fysisk isoleret: `data/uploads/{tenantId}/…`, serveret via en autoriseret route der tjekker
  at den forespørgende tenant ejer filen.

### 4.9 Cron / tidsstyrede jobs
- `/api/cron/*`-endpoints beskyttet af et delt bearer-token (`CRON_SECRET`), kaldt udefra
  (GitHub Actions cron el.lign.) — fx trial-påmindelser, oprydning.

### 4.10 Designsystem som kilde til sandhed
- CSS-variabler + komponentklasser i én `globals.css`, holdt synkron med `design-system/tokens.css`.
- Al ny UI bruger klasserne (`.btn-primary`, `.card`, `.badge-*`, `.form-input`), aldrig ad-hoc-styling.

### 4.11 Deploy-mønster
- Docker-image bygges i CI ved merge til `main`, pushes til et registry (GHCR), og en server
  *trækker* imaget (bygger aldrig selv). Nås fx over et privat netværk (Tailscale).
- Persistens = bind-mounts af `data/` (DB + uploads). `entrypoint.sh` kører migrationer og
  seeder admin ved opstart. Hemmeligheder i en `.env` ved siden af compose (aldrig i git).

---

## 5. Tekniske afklaringer — udfyld ved nyt domæne

Besvar disse før implementering. Svarene bestemmer hvilke byggeklodser fra §4 der er med, og
hvad tabeller/routes/features skal hedme. Behold ubesvarede punkter som åbne spørgsmål.

### A. Domæne & aktører
1. **Hvad er en "tenant" i dit domæne?** (bageri → `{…}`) Og hvad hedder slutkunden?
2. **Hvad er kerne-værdien i workspacet?** (bestillingssystem → book/lager/kalender/CRM/…?)
   Hvad er den centrale transaktion en slutkunde udfører på `{slug}`-fladen?
3. **Er der overhovedet en slutkunde-flade?** Eller er workspacet rent internt for tenanten?
   (Uden slutkunde-flade falder §4.4-punkt-2 og en del af §4.1 væk.)

### B. Directory / opdagelse
4. **Hvordan opdages tenants offentligt?** Geografisk kort, søgbar liste, kategori-index,
   eller intet offentligt directory? (Bestemmer om MapLibre/geokodning er med.)
5. **Hvilke felter vises offentligt pr. tenant?** (navn, billede, kategori, placering, åbningstider …)
6. **Kræver directory-optagelse admin-godkendelse?** Hvis nej → drop §4.6, betaling er eneste gate.

### C. Prismodel & tiers
7. **Hvilke tiers, og hvad koster de?** (gratis/starter/pro → `{…}`)
8. **Hvilke features låses bag hvert tier?** Lav en tabel: feature → mindste tier.
9. **Er der en gratis tier med directory-synlighed men uden workspace?** (Ja i referencen.)
10. **Trial-periode?** Hvis ja → definér cron-påmindelser (§4.9) og hvad der sker ved udløb.

### D. Betaling
11. **Har tenants brug for at tage imod betaling fra deres egne slutkunder?**
    Hvis ja → begge Stripe-integrationer (§4.4). Hvis nej → kun platform-abonnementet.
12. **PSP-valg** for henholdsvis platform og tenant. (Samme eller forskellige udbydere?)
13. **Hvad er den præcise webhook→tier-mapping?** Hvilke Stripe-events sætter/nulstiller adgang?

### E. Multi-tenancy & domæner
14. **Roddomæne** og skal hver tenant have `{slug}.{roddomæne}`? Custom domæner senere?
15. **Slug-genereringsregel** (fra navn? kollisions-håndtering?).
16. **Skal workspacet også virke direkte på subdomænet** (PWA-installerbart), eller kun på roddomænet?

### F. Auth
17. **Hjemmerullet JWT eller ekstern auth-provider?**
18. **Hvordan seedes/administreres admins?** (env-liste som referencen, eller inviteret i UI?)
19. **Roller ud over tenant+admin?** (fx medarbejdere under en tenant, support-rolle.)

### G. Data & drift
20. **SQLite (single-node) eller managed database?** Forventet skala afgør dette.
21. **Hvilke per-tenant konfigurationsnøgler** findes, og hvad er deres defaults? (§4.5)
22. **Uploads/filer pr. tenant?** Hvilke typer, hvor store, hvordan autoriseres adgang?
23. **Notifikationskanaler**: email altid; SMS/push? (Referencen har SMS bag højeste tier.)
24. **i18n / flersprog?** Hvilke sprog og lande, og hvordan detekteres land?

### H. Deploy & infrastruktur
25. **Hvor hostes det?** (single server + Docker som referencen, eller PaaS/serverless?)
26. **CI/CD-trigger og reverse proxy** til wildcard-subdomæner (Cloudflare Tunnel / nginx / Caddy?).
27. **Backup-strategi** for DB + uploads.
28. **Hemmeligheds-håndtering** (`.env` + rotation, eller secret manager?).

### I. Ikke-funktionelt
29. **Sprog for kode, UI, commits, docs?** (Referencen er 100% dansk.)
30. **Arbejdsregler**: branch+PR-flow, deploy-automatik, designsystem-overholdelse — genbrug som er.

---

## 6. Env-variabler (reference — omdøb pr. domæne)

| Variabel | Formål |
|---|---|
| `SESSION_SECRET` | JWT-signeringsnøgle |
| `ADMIN_USERS` | `email:kode,…` — seedes ved første opstart |
| `{EMAIL}_API_KEY`, `EMAIL_FROM` | Transaktionel email |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Platform-abonnement |
| `STRIPE_PRICE_{TIER}` | Pris-id pr. tier |
| `PUBLIC_BASE_URL` | Fuld rod-URL (email- & PSP-links) — bemærk: *ikke* prefixet `NEXT_PUBLIC_` |
| `ROOT_DOMAIN` | Roddomæne for tenant-subdomæner |
| `CRON_SECRET` | Bearer-token til `/api/cron/*` |
| `{SMS}_TOKEN` | SMS-udbyder (hvis relevant), afsender pr. tenant |
| `DEFAULT_LAND` | Fallback-landekode når reverse-proxy-header mangler (lokal test) |

---

## 7. Faldgruber lært i referencen (undgå at gentage)

- **Sæt aldrig en Host-header-override i reverse-proxyen** → alle subdomæner kollapser til én tenant.
- **Tenant fra session i workspacet, aldrig fra URL** → ellers cross-tenant-datalæk.
- **Per-tenant webhook-secret** kan først vælges når du kender tenant → læg tenantId i webhook-URL'en.
- **Ingen seed-rækker pr. tenant for config** → hold defaults i kode, gem kun afvigelser.
- **WAL-backup** → tag alle tre SQLite-filer eller brug `.backup`, ellers får du en inkonsistent kopi.
- **In-memory DB under build** → ellers fil-lock fra parallelle build-workers.
- **Betaling og godkendelse er separate gates** → bland dem ikke, det ødelægger friktionsfri onboarding.
- **Hold hemmeligheder ude af git** fra dag ét (git-historik glemmer aldrig) → rotér ved mistanke.
