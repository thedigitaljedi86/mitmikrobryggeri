import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * SQLite-forbindelse + skema (CLAUDE.md §5, template §4.7).
 *
 * - Én fil på disk (WAL), ingen DB-server.
 * - Idempotente migrationer kører ved hver opstart (sikre* -mønsteret).
 * - In-memory under `next build` for at undgå fil-lock fra parallelle build-workers.
 * - Alle tenant-tabeller har `bryggeri_id`; domænefunktioner tager bryggeriId først.
 */

export type DB = Database.Database;

const UNDER_BUILD = process.env.NEXT_PHASE === "phase-production-build";

// Singleton på tværs af hot-reload i dev.
declare global {
  // eslint-disable-next-line no-var
  var __mbDb: DB | undefined;
}

function nyForbindelse(): DB {
  if (UNDER_BUILD) {
    const db = new Database(":memory:");
    forberedSkema(db);
    return db;
  }

  const sti = resolve(process.env.DATABASE_PATH ?? "data/mit-mikrobryggeri.db");
  mkdirSync(dirname(sti), { recursive: true });

  const db = new Database(sti);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  forberedSkema(db);
  return db;
}

export function getDb(): DB {
  if (!globalThis.__mbDb) globalThis.__mbDb = nyForbindelse();
  return globalThis.__mbDb;
}

/* ─────────────────────────── Skema ─────────────────────────── */

function forberedSkema(db: DB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bryggerier (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT NOT NULL UNIQUE,
      navn          TEXT NOT NULL,
      adresse       TEXT,
      postnr        TEXT,
      by            TEXT,
      lat           REAL,
      lng           REAL,
      cvr           TEXT,
      foedevare_reg INTEGER NOT NULL DEFAULT 0,
      status        TEXT NOT NULL DEFAULT 'afventer_godkendelse',
      tier          TEXT NOT NULL DEFAULT 'gratis',
      oprettet      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brugere (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      navn        TEXT NOT NULL,
      email       TEXT NOT NULL,
      kode_hash   TEXT NOT NULL,
      rolle       TEXT NOT NULL DEFAULT 'taproom',
      oprettet    TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (bryggeri_id, email)
    );

    CREATE TABLE IF NOT EXISTS admin_brugere (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      email     TEXT NOT NULL UNIQUE,
      kode_hash TEXT NOT NULL,
      oprettet  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS oel (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      navn        TEXT NOT NULL,
      stil        TEXT,
      abv         REAL,
      pris_oere   INTEGER NOT NULL DEFAULT 0,
      farve       TEXT,
      paa_hanen   INTEGER NOT NULL DEFAULT 0,
      i_webshop   INTEGER NOT NULL DEFAULT 0,
      udsolgt     INTEGER NOT NULL DEFAULT 0,
      sortering   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tanke (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      navn        TEXT NOT NULL,
      volumen_l   INTEGER,
      type        TEXT NOT NULL DEFAULT 'gaering',
      status      TEXT NOT NULL DEFAULT 'ledig'
    );

    CREATE TABLE IF NOT EXISTS brygninger (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id    INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      nr             INTEGER NOT NULL,
      oel_id         INTEGER REFERENCES oel(id) ON DELETE SET NULL,
      tank_id        INTEGER REFERENCES tanke(id) ON DELETE SET NULL,
      volumen_l      INTEGER,
      status         TEXT NOT NULL DEFAULT 'planlagt',
      startet        TEXT,
      klar_forventet TEXT,
      oprettet       TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (bryggeri_id, nr)
    );

    CREATE TABLE IF NOT EXISTS maalinger (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id  INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      brygning_id  INTEGER NOT NULL REFERENCES brygninger(id) ON DELETE CASCADE,
      sg           REAL,
      temperatur   REAL,
      note         TEXT,
      tidspunkt    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leverandoerer (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      navn        TEXT NOT NULL,
      kategori    TEXT,
      leveringstid TEXT
    );

    CREATE TABLE IF NOT EXISTS lager_varer (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id   INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      kategori      TEXT NOT NULL DEFAULT 'andet',
      navn          TEXT NOT NULL,
      beholdning    REAL NOT NULL DEFAULT 0,
      enhed         TEXT NOT NULL DEFAULT 'kg',
      minimum       REAL NOT NULL DEFAULT 0,
      leverandoer_id INTEGER REFERENCES leverandoerer(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bestillinger (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id       INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      kunde_navn        TEXT,
      kunde_email       TEXT,
      afhentningstid    TEXT,
      status            TEXT NOT NULL DEFAULT 'ny',
      betalings_ref     TEXT,
      alder_verificeret INTEGER NOT NULL DEFAULT 0,
      sum_oere          INTEGER NOT NULL DEFAULT 0,
      oprettet          TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bestilling_linjer (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      bestilling_id  INTEGER NOT NULL REFERENCES bestillinger(id) ON DELETE CASCADE,
      oel_id         INTEGER REFERENCES oel(id) ON DELETE SET NULL,
      navn           TEXT,
      antal          INTEGER NOT NULL DEFAULT 1,
      pris_oere      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      titel       TEXT NOT NULL,
      dato        TEXT,
      tid         TEXT,
      kapacitet   INTEGER NOT NULL DEFAULT 0,
      tilmeldte   INTEGER NOT NULL DEFAULT 0,
      sted        TEXT
    );

    CREATE TABLE IF NOT EXISTS bryggeri_indstillinger (
      bryggeri_id INTEGER NOT NULL REFERENCES bryggerier(id) ON DELETE CASCADE,
      noegle      TEXT NOT NULL,
      vaerdi      TEXT NOT NULL,
      PRIMARY KEY (bryggeri_id, noegle)
    );

    CREATE INDEX IF NOT EXISTS idx_bryggerier_status ON bryggerier(status);
    CREATE INDEX IF NOT EXISTS idx_oel_bryggeri ON oel(bryggeri_id);
    CREATE INDEX IF NOT EXISTS idx_brygninger_bryggeri ON brygninger(bryggeri_id);
    CREATE INDEX IF NOT EXISTS idx_maalinger_brygning ON maalinger(brygning_id);
    CREATE INDEX IF NOT EXISTS idx_bestillinger_bryggeri ON bestillinger(bryggeri_id);
  `);

  koerMigrationer(db);
}

/**
 * Idempotente migrationer (template §4.7): tilføj kolonner senere med
 * try/catch, så opstart altid er sikker uanset eksisterende skema-version.
 */
function koerMigrationer(db: DB) {
  // Stripe-felter på tenant (platform-abonnement). Tilføjes idempotent, så
  // eksisterende databaser opgraderes sikkert ved opstart.
  sikreKolonne(db, "bryggerier", "stripe_customer_id", "TEXT");
  sikreKolonne(db, "bryggerier", "stripe_subscription_id", "TEXT");
  sikreKolonne(db, "bryggerier", "stripe_status", "TEXT");
}

/** Tilføj en kolonne hvis den ikke findes (SQLite mangler ADD COLUMN IF NOT EXISTS). */
export function sikreKolonne(db: DB, tabel: string, kolonne: string, definition: string) {
  try {
    db.exec(`ALTER TABLE ${tabel} ADD COLUMN ${kolonne} ${definition}`);
  } catch (e) {
    const besked = e instanceof Error ? e.message : String(e);
    if (!/duplicate column name/i.test(besked)) throw e;
  }
}
