# CLAUDE.md — Mit Mikrobryggeri

Multi-tenant micro-SaaS til **mikrobryggerier**, bygget efter mønstrene i
`uploads/MicroSaas-template.md` (udledt af Mit Mikrobageri). Denne fil er kilden til
sandhed for domæne-beslutninger, arkitektur og designsystem. Alt er dansk: kode-navne,
UI, commits og docs.

Design-referencen ligger i `Mit Mikrobryggeri.dc.html` (skærm 01–15): bryggerens app,
tenant-/indstillings-skærme, statistik, det offentlige danmarkskort og planer.

---

## 1. Domænet (svar på template §5.A)

| Template-begreb | Her |
|---|---|
| Platform / directory | **Bryggerikortet** — offentligt danmarkskort over godkendte mikrobryggerier |
| Tenant | **Bryggeri** (`bryggerier`-tabellen), slug fx `enghave` |
| Workspace | **Bryggeriets app**: brygninger, gæringslog, lager, salg, taproom/events, statistik, indstillinger |
| Slutkunde | **Gæst** — bestiller øl (klik & hent), tilmelder sig events på `{slug}.{roddomæne}` |
| Central transaktion | Online bestilling til afhentning + event-tilmelding |

Der ER en slutkunde-flade → begge Stripe-integrationer (§4.4) er med.

## 2. Tiers & features (§5.C)

| Tier | Pris | Features |
|---|---|---|
| **Gratis** ("På kortet") | 0 kr | Profil på kortet, åbningstider, øl på hanen, events vises |
| **Starter** | 149 kr/md | Alt i Gratis + webshop/online bestillinger, klik & hent, salgsoverblik (light) |
| **Pro** | 349 kr/md | Alt i Starter + lager (min.-grænser, indkøbsliste), brygninger & gæringslog, tanke, fuld statistik, flere brugere/roller |

- Feature-mapping centralt i `lib/tier.ts`; UI og API tjekker samme kilde.
- Betaling låser workspace op øjeblikkeligt; **admin-godkendelse gater kun synlighed på kortet** (§4.6).
- Gratis tier = directory-synlighed uden workspace (kun profil-redigering).
- Trial: åbent spørgsmål (se §7).

## 3. Roller (§5.F)

- **Admin** (platform) — godkender bryggerier til kortet. Seedes fra `ADMIN_USERS`-env.
- **Tenant-brugere med roller**: `ejer`, `brygger`, `taproom` (se skærm 07).
  - ejer: alt inkl. indstillinger, brugere, abonnement
  - brygger: brygninger, gæringslog, lager
  - taproom: salg, bestillinger, events
- Auth: hjemmerullet JWT (`jose`), host-only cookie, to brugertyper — som referencen.
- Tenant udledes ALTID af session i workspacet; af Host-header på kundefladen.

## 4. Directory / kortet (§5.B)

- Geografisk **danmarkskort** (MapLibre GL + geokodning ved tilmelding) + søgbar liste.
- Offentlige felter pr. bryggeri: navn, slug, adresse/koordinater, åbningstider (taproom),
  øl på hanen (navn, stil, ABV, pris), kommende events, afstand, åben/lukket-status.
- Klynge-markører ved zoom-ud; betalende tiers kan få mere prominent markør (valgfrit, §4.3).
- Optagelse kræver admin-godkendelse.

## 5. Datamodel (kerne-tabeller, alle tenant-tabeller har `bryggeri_id`)

- `bryggerier` — slug, navn, adresse, lat/lng, cvr, status (`afventer_godkendelse`/`godkendt`/`afvist`), tier
- `brugere` — pr. bryggeri, rolle (ejer/brygger/taproom)
- `oel` — navn, stil, abv, pris, farve, på_hanen, i_webshop
- `brygninger` — nr., øl, tank, volumen, status (planlagt/gæring/lagring/klar/arkiv), datoer
- `maalinger` — brygning_id, SG, temperatur, tidspunkt, note
- `lager_varer` — kategori (malt/humle/gær/andet), beholdning, enhed, minimum, leverandør
- `leverandoerer` — navn, kategori, leveringstid
- `tanke` — navn, volumen, type (gæring/lager), status
- `bestillinger` — kunde, linjer, afhentningstid, status, betalings-ref
- `events` — titel, dato, kapacitet, tilmeldte
- `bryggeri_indstillinger` — nøgle/værdi, **defaults i kode** (§4.5)

Per-tenant config-nøgler (defaults i kode): webshop_aktiv, klik_og_hent, levering,
notifikation_maaling / lavt_lager / ny_bestilling, auto_indkoebsliste, traek_lager_ved_brygstart,
aabningstider, moms.

## 6. Betaling (§5.D)

1. **Platform**: Stripe abonnementer (`lib/stripe.ts`), webhook sætter `bryggerier.tier`.
   `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`.
2. **Tenant**: bryggeriets egne Stripe-nøgler i config (`lib/system/kundeStripe.ts`),
   webhook pr. tenant: `/api/payments/stripe/webhook/[bryggeriId]`. MobilePay via Stripe.
3. Webhook→tier: `checkout.session.completed` + `customer.subscription.updated` sætter tier;
   `customer.subscription.deleted` → nedgrader til gratis (data bevares, features låses).

## 7. Stack, drift & regler

Følg referencen uændret (template §2, §4.7–4.11, §7 — læs faldgruberne!):
Next.js App Router, Tailwind + CSS-variabler, SQLite (WAL, idempotente migrationer,
in-memory under build), Resend, wildcard-subdomæner via middleware/Host-header
(ingen Host-override i proxyen!), uploads i `data/uploads/{bryggeriId}/`,
cron bag `CRON_SECRET`, Docker → GHCR → single server, `.env` udenfor git.

**Åbne spørgsmål** (afklar før implementering): roddomæne + slug-regel, trial-periode,
SMS/push bag Pro?, i18n (kun dansk indtil videre), backup-kadence, hosting-valg.

## 8. Lovkrav — online salg af alkohol (bindende for webshop/klik & hent)

Kilder: Sikkerhedsstyrelsen (sik.dk, regler pr. 1. okt 2024) + lovændring pr. 1. april 2025.
**Compliance er platformens ansvar at understøtte teknisk — hvert bryggeri er selv juridisk ansvarlig sælger.**

### 8.1 Alderskontrol (vigtigst — kræver teknisk implementering)
- Fra **1. oktober 2024** skal alle webshops, der sælger alkohol til forbrugere, have et
  **effektivt IT-system til alderskontrol**. En pop-up/afkrydsning "jeg er over 18" er IKKE nok.
- Systemet skal **verificere alderen inden købet gennemføres** — fx **MitID** eller upload/kontrol
  af gyldig legitimation (pas, kørekort) ved brugeroprettelse.
- **Sikkerhedsstyrelsen fører tilsyn**; webshoppen skal kunne **dokumentere og redegøre** for sin
  metode. Overtrædelse kan give bøde/politianmeldelse.
- Der er metodefrihed, men implementér **MitID-verifikation i checkout-flowet** som standard
  (`lib/system/alderskontrol.ts`): verificeret fødselsdato gemmes som flag på kundens session/ordre
  (aldrig CPR). Bestillinger kan ikke gennemføres uden godkendt verifikation.
- Log verifikations-hændelser pr. ordre (tidspunkt, metode, resultat) til dokumentationspligten.

### 8.2 Aldersgrænser (pr. 1. april 2025)
- **Under 16 år**: må ikke købe alkohol over 1,2 %.
- **16–17 år**: må købe op til **6 %** (detailsalg).
- **18+**: ingen begrænsning.
- Mikrobryggeri-øl over 6 % (fx IPA 6,2 %) kræver altså 18 år — grænsen skal tjekkes **pr. varelinje**
  (`oel.abv` afgør aldersgrænse 16/18). Afvis kun de linjer, køberen er for ung til.

### 8.3 Udlevering (klik & hent)
- Ved fysisk udlevering gælder samme aldersgrænser — **ID-tjek ved tvivl**. Vis køberens
  verificerede aldersstatus på bestillingen i taproom-visningen (skærm 05).

### 8.4 Øvrige krav
- **Fødevareregistrering**: alkohol er en fødevare — bryggeriet skal være registreret som
  fødevarevirksomhed hos Fødevarestyrelsen. Felt + vejledning i onboarding (selvdeklaration).
- **Skiltning**: lovpligtig synlig information om aldersgrænser i webshoppen.
- **Almindelig e-handelsret** gælder fortsat: e-handelsloven, markedsføringsloven,
  forbrugeraftaleloven (fortrydelsesret, ordrebekræftelse, prisoplysninger inkl. moms/pant).
- **Markedsføring**: alkoholmarkedsføring må ikke målrettes mindreårige — gælder også
  events/nyhedsmails sendt via platformen.
- **GDPR**: legitimations-/aldersdata minimeres (gem kun "verificeret 18+"-flag + metode, aldrig
  kopi af ID eller CPR). Cookiesamtykke på kundefladen.
- **Punktafgifter** (bryggeriets eget ansvar, uden for platformen): registrering hos
  Skattestyrelsen for ølafgift — nævnes i onboarding-vejledning, håndteres ikke af systemet.

**Åbent spørgsmål**: valg af MitID-broker (Criipto, Signaturgruppen el.lign.) og om
alderskontrol skal ligge på platform-niveau (delt komponent) — anbefalet — eller pr. tenant.

## 9. Designsystem (bindende — fra designet i dette projekt)

Stilrent, minimalistisk, håndværker-varmt. **Ingen Talværkstedet-styling** (fravalgt).

- **Fonte**: Lora (display/titler/tal, vægt 400) + Instrument Sans (UI/body, 400–700).
  Aldrig condensed fonte. Labels: 10–12px uppercase, letter-spacing 1–2.4px, vægt 600.
- **Farver** (CSS-variabler i `globals.css` / `design-system/tokens.css`):
  - `--baggrund: #FBF7F0` (varm papir) · `--flade: #FFFFFF` · `--kant: #E7DFD0` · `--kant-svag: #F0EADF`
  - `--tekst: #211B12` · `--tekst-daempet: #8B8070`
  - `--accent: #A85B1F` (kobber — primær) · `--succes: #4A6741` · `--advarsel: #C98A2C` · `--fremhaev: #E8C36A`
  - Mørk flade: `#211B12` med tekst `#FBF7F0` / dæmpet `#B8AE9D`
- **Form**: kort radius 18px, knapper 12–14px, piller 999px. Kanter 1px solid `--kant`
  (dashed = tom/tilføj-tilstand). Ingen tunge skygger — kun løftede lag (bottom sheets)
  får `0 8px 24px rgba(33,27,18,0.10)`.
- **Komponentklasser** (§4.10): `.btn-primary` (mørk #211B12), `.btn-accent`, `.btn-sekundaer`
  (hvid + kant), `.kort` (card), `.pille-status`, `.form-input`, `.toggle` — al ny UI bruger
  klasserne, aldrig ad-hoc-styling.
- **Tone**: dansk, håndværker-varm, kortfattet. Ingen emoji. Status i uppercase-piller
  (GÆRING · DAG 5). Hit targets ≥ 44px.
