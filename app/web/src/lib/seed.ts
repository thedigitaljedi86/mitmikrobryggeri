import { getDb } from "./db";
import { hashKode } from "./auth";

/**
 * Demo-data der spejler designet (Bryghuset Enghave m.fl.). Idempotent:
 * springes over hvis bryggeriet allerede findes. Kaldes ved opstart når
 * SEED_DEMO=1 (eller i udvikling). Demo-kode til alle brugere: "bryg1234".
 */

const DEMO_KODE = "bryg1234";

export function seedDemo(): void {
  const db = getDb();
  const findes = db.prepare("SELECT id FROM bryggerier WHERE slug = ?");

  const opret = db.transaction(() => {
    // ── Bryghuset Enghave (Pro) ──
    if (!findes.get("enghave")) {
      const bId = Number(
        db
          .prepare(
            `INSERT INTO bryggerier (slug, navn, adresse, postnr, by, lat, lng, cvr, foedevare_reg, status, tier)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`
          )
          .run("enghave", "Bryghuset Enghave", "Enghavevej 41", "2450", "København SV", 55.6606, 12.5406, "41882307", 1, "godkendt", "pro")
          .lastInsertRowid
      );

      const kode = hashKode(DEMO_KODE);
      const bruger = db.prepare(
        "INSERT INTO brugere (bryggeri_id, navn, email, kode_hash, rolle) VALUES (?,?,?,?,?)"
      );
      bruger.run(bId, "Anders Holm", "anders@enghave.dk", kode, "ejer");
      bruger.run(bId, "Sofie Lund", "sofie@enghave.dk", kode, "brygger");
      bruger.run(bId, "Mikkel Rask", "mikkel@enghave.dk", kode, "taproom");

      const oel = db.prepare(
        "INSERT INTO oel (bryggeri_id, navn, stil, abv, pris_oere, farve, paa_hanen, i_webshop, udsolgt, sortering) VALUES (?,?,?,?,?,?,?,?,?,?)"
      );
      const ipaId = Number(oel.run(bId, "Enghave IPA", "West coast IPA", 6.2, 4400, "#D08C2E", 1, 1, 0, 1).lastInsertRowid);
      const stoutId = Number(oel.run(bId, "Havre Stout", "Oatmeal stout", 5.4, 4600, "#2E2013", 1, 1, 0, 2).lastInsertRowid);
      const aleId = Number(oel.run(bId, "Rød Ale", "Irish red", 5.0, 4200, "#B4622D", 1, 0, 1, 3).lastInsertRowid);
      const pilsId = Number(oel.run(bId, "Sommerpilsner", "Tjekkisk pilsner", 4.8, 4000, "#E8C36A", 0, 0, 0, 4).lastInsertRowid);

      const tank = db.prepare(
        "INSERT INTO tanke (bryggeri_id, navn, volumen_l, type, status) VALUES (?,?,?,?,?)"
      );
      const t1 = Number(tank.run(bId, "Tank 1", 500, "gaering", "ledig").lastInsertRowid);
      const t2 = Number(tank.run(bId, "Tank 2", 500, "gaering", "i_brug").lastInsertRowid);
      const t3 = Number(tank.run(bId, "Tank 3", 1000, "lager", "i_brug").lastInsertRowid);

      const bryg = db.prepare(
        "INSERT INTO brygninger (bryggeri_id, nr, oel_id, tank_id, volumen_l, status, startet, klar_forventet) VALUES (?,?,?,?,?,?,?,?)"
      );
      const b24 = Number(
        bryg.run(bId, 24, ipaId, t2, 500, "gaering", "2025-07-04", "2025-07-24").lastInsertRowid
      );
      bryg.run(bId, 23, stoutId, t3, 500, "lagring", "2025-06-26", "2025-07-16");
      bryg.run(bId, 25, pilsId, null, 1000, "planlagt", null, null);
      bryg.run(bId, 22, aleId, t1, 500, "klar", "2025-06-10", "2025-07-01");

      const maaling = db.prepare(
        "INSERT INTO maalinger (bryggeri_id, brygning_id, sg, temperatur, note, tidspunkt) VALUES (?,?,?,?,?,?)"
      );
      maaling.run(bId, b24, 1.062, 20.5, "Pitchet gær", "2025-07-04 18:00");
      maaling.run(bId, b24, 1.048, 20.2, "Falder", "2025-07-05 08:05");
      maaling.run(bId, b24, 1.034, 20.1, "Falder", "2025-07-06 08:15");
      maaling.run(bId, b24, 1.024, 19.8, "Falder", "2025-07-08 08:05");
      maaling.run(bId, b24, 1.018, 19.5, "Stabil", "2025-07-09 08:10");

      const lev = db.prepare(
        "INSERT INTO leverandoerer (bryggeri_id, navn, kategori, leveringstid) VALUES (?,?,?,?)"
      );
      const malt = Number(lev.run(bId, "Dansk Maltcentral", "malt", "2–3 dage").lastInsertRowid);
      const humle = Number(lev.run(bId, "Humlegården ApS", "humle", "1–2 dage").lastInsertRowid);

      const vare = db.prepare(
        "INSERT INTO lager_varer (bryggeri_id, kategori, navn, beholdning, enhed, minimum, leverandoer_id) VALUES (?,?,?,?,?,?,?)"
      );
      vare.run(bId, "malt", "Pilsnermalt", 120, "kg", 40, malt);
      vare.run(bId, "malt", "Münchenermalt", 18, "kg", 25, malt);
      vare.run(bId, "malt", "Havreflager", 45, "kg", 20, malt);
      vare.run(bId, "humle", "Citra", 2.4, "kg", 1, humle);
      vare.run(bId, "humle", "Saaz", 0.3, "kg", 1, humle);
      vare.run(bId, "gaer", "US-05 · tørgær", 14, "breve", 6, humle);

      db.prepare(
        "INSERT INTO events (bryggeri_id, titel, dato, tid, kapacitet, tilmeldte, sted) VALUES (?,?,?,?,?,?,?)"
      ).run(bId, "Fredagsbar · smagning af Havre Stout", "2025-07-11", "16–22", 32, 18, "taproom");
    }

    // ── Vesterbro Bryglaug (Starter) — for tenant-skift i skærm 07 ──
    if (!findes.get("vesterbro")) {
      const vId = Number(
        db
          .prepare(
            `INSERT INTO bryggerier (slug, navn, adresse, postnr, by, lat, lng, cvr, foedevare_reg, status, tier)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`
          )
          .run("vesterbro", "Vesterbro Bryglaug", "Sønder Boulevard 12", "1720", "København V", 55.6673, 12.5510, "38221190", 1, "godkendt", "starter")
          .lastInsertRowid
      );
      const kode = hashKode(DEMO_KODE);
      // Anders er også brygger her (samme email — unik pr. bryggeri).
      db.prepare("INSERT INTO brugere (bryggeri_id, navn, email, kode_hash, rolle) VALUES (?,?,?,?,?)")
        .run(vId, "Anders Holm", "anders@enghave.dk", kode, "brygger");
    }
  });

  opret();
}
