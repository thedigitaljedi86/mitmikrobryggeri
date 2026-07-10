# Mikrobrygger-app design

_Started 2026-07-09 20:22 UTC_

---

## User

Jeg skal bruge et design af en app henvendt til mikrobryggerier på samme måde som vi har en app til mikrobagerier. 

Temaet skal matche målgruppen for mikrobryggerier men designet skal være stilrent minimalistisk.

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- ds_conflict: Lav en ny stilren/minimalistisk retning til bryggerier
- users: Begge
- features: Brygopskrifter & batches, Lagerstyring (malt, humle, gær), Salg & bestillinger, Gæringsovervågning / logbog, Taproom / events
- platform: Mobil (telefon)
- variations: Nej, én gennemarbejdet retning
- tone: Håndværker-varm (som bagerappen?)
- language: Dansk
- notes: Her er link til mikrobageri.dk

## Assistant

_[tool: read_skill_prompt]_

_[tool: web_fetch]_

_[tool: copy_starter_component]_

_[tool: web_fetch]_

_[tool: grep]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Designet er klar (1a): **Mit Mikrobryggeri** — stilren, håndværker-varm retning med Instrument Serif/Sans, varm papirtone og kobber-accent.

- **Bryggerens app** (5 skærme): Hjem, Brygninger, Gæringslog med SG-kurve, Lager med lav-beholdning-advarsler, Salg & taproom
- **Kundens app** (1 skærm): øl-menu, event-tilmelding og kurv — parallel til mikrobageri.dk
- Accentfarven kan skiftes under Tweaks (kobber / humlegrøn / dybblå)

Sig til, hvis du vil have flere skærme (fx opskrift-detalje eller kundens kort/find-bryggeri) eller justeret tonen.

## User

Du må gerne lave et fuldt sæt af screenshots med hvordan vi håndterer tenants og hvordan de kan styre deres indstillinger for bryggeriet, lager og online salg. Der skal også være et statestik modul for salg.

## Assistant

Jeg fortsætter den stilrent minimalistiske retning, du valgte tidligere (Talværkstedet-systemet er et børnespil og passer ikke her). Tilføjer et nyt sæt skærme øverst: tenant-styring, indstillinger for bryggeri/lager/online salg og salgsstatistik.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Nyt sæt skærme er tilføjet øverst (2a), i samme minimalistiske stil:

- **07 Mine bryggerier** — tenant-liste, skift mellem bryggerier, brugere & roller (ejer/brygger/taproom), invitér bruger
- **08 Indstillinger** — hub med Bryggeri, Lager, Online salg, Brugere, Abonnement + notifikationer
- **09 Bryggeri** — profil, CVR, åbningstider, tanke & kapacitet
- **10 Lager** — advarsler, auto-indkøbsliste, minimumsgrænser, leverandører
- **11 Online salg** — webshop, klik & hent, levering, betaling (MobilePay/kort/faktura), sortiment
- **12 Statistik** — omsætning pr. måned, kanalfordeling (taproom/webshop/erhverv), mest solgte

Bemærk: Talværkstedet-designsystemet er et legende børnespil, så jeg holdt fast i den stilrene bryggeri-retning, du valgte i starten — sig til, hvis du alligevel vil have det anvendt.

## User

Jeg bryder mig ikke om at fonten er presset sammen. 

Formålet med løsningen er at vi vil lave et danmarkskort over mikrobryggerier som er åbent for alle. Mikrobryggerierne kan så tilmelde sig for at blive vist på kortet eller købe en starter eller pro tier hvor de får en app til at styre online bestillinger, lager, Bryggeri, statestik, brygninger osv.

## Assistant

To ting: jeg skifter den sammenpressede serif (Instrument Serif er meget condensed) ud med Lora, som er bredere og roligere — og tilføjer et nyt sæt øverst (3a) med det offentlige danmarkskort, bryggeri-profil og tilmelding med Gratis/Starter/Pro.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Klar:

**Font:** Instrument Serif (meget condensed) er skiftet til **Lora** overalt — bredere skrift og løsere linjeafstand, så det ikke virker sammenpresset.

**Nyt sæt 3a øverst** — det åbne danmarkskort og forretningsmodellen:
- **13 Kortet** — offentligt danmarkskort med pins/klynger, søgning og nærmeste bryggeri
- **14 Bryggeri-profil** — offentlig side med øl på hanen, åbningstider, events og "Bestil øl"
- **15 Planer** — Gratis (på kortet) / Starter 149 kr (webshop & bestillinger) / Pro 349 kr (lager, brygninger, fuld statistik)

Kortet er en stiliseret skitse — sig til hvis du vil have et rigtigt kortudsnit (fx skærmbillede fra jeres kortleverandør) sat ind i stedet.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Rettet — status-pillerne ("GÆRING · DAG 5", "LAGRING · DAG 12") ombrydes ikke længere efter fontskiftet. (Advarslen om Talværkstedet-systemet er forventet, da du valgte en ny retning.)

## User

Kan du bruge den vedhæftede fil til at danne en CLAUDE.md fil ud fra, så vi kan begynde at bygge systemet?

## Assistant

_[tool: read_file]_

_[tool: write_file]_

_[tool: show_to_user]_

`CLAUDE.md` er oprettet ud fra skabelonen, med domænet udfyldt:

- **Domæne-mapping**: tenant = bryggeri, directory = Bryggerikortet, slutkunde = gæst (klik & hent + events)
- **Tiers**: Gratis / Starter 149 / Pro 349 med feature-tabel og webhook→tier-mapping
- **Roller**: admin + ejer/brygger/taproom (fra skærm 07)
- **Datamodel**: kerne-tabeller og per-tenant config-nøgler
- **Designsystem**: fonte, farvetokens og komponentregler taget direkte fra designet
- **Åbne spørgsmål** samlet i §7 (roddomæne, trial, SMS, hosting, backup)

Filen injiceres nu i alle samtaler i projektet. Afklar gerne de åbne spørgsmål i §7, så opdaterer jeg den — ellers er I klar til at bygge.

## User

Der er noget lovgivning ift. salg af alkohol online som skal overholdes. Kan du finde de gældende regler og skrive dem ind i Claude.md filen?

## Assistant

_[tool: str_replace_edit]_

_[tool: web_search]_

_[tool: show_to_user]_

Tilføjet som nyt afsnit §8 i `CLAUDE.md`. De vigtigste gældende regler:

- **Alderskontrol:** Alle webshops, der sælger alkohol til forbrugere, skal have et effektivt IT-system til alderskontrol — kravet trådte i kraft 1. oktober 2024. Systemet skal verificere, om køber er over aldersgrænsen, inden salget gennemføres; en pop-up-boks er ikke længere tilstrækkelig. MitID eller brugeroprettelse med pas/anden gyldig legitimation er godkendte metoder, og der er metodefrihed.
- **Tilsyn:** Sikkerhedsstyrelsen fører tilsyn og kan kræve dokumentation for, hvordan metoden effektivt verificerer kundens alder.
- **Aldersgrænser:** 16–17-årige må købe op til 6 %; stærkere alkohol kræver 18 år — gældende siden lovændringen i april 2025. Jeres IPA på 6,2 % kræver altså 18 år — derfor tjek pr. varelinje.
- **Øvrigt:** alkohol er en fødevare, så bryggeriet skal registreres som fødevarevirksomhed, og de almindelige webshop-regler (e-handelsloven, markedsføringsloven, forbrugeraftaleloven) gælder fortsat.

Filen anbefaler MitID-verifikation i checkout som delt platform-komponent og har ét nyt åbent spørgsmål: valg af MitID-broker. Bemærk: jeg er ikke jurist — få det verificeret, inden I går i luften.

