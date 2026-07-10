import { BottomNav, Display, Screen } from "@/components/ui";
import { brewerNav } from "@/lib/nav";

/* 01 · Hjem — bryggerens forside */
export default function Hjem() {
  return (
    <Screen>
      <div className="flex flex-col gap-1 px-6">
        <div className="font-sans text-[13px] font-medium uppercase tracking-[2px] text-accent">
          Godmorgen, Anders
        </div>
        <Display>Bryghuset Enghave</Display>
      </div>

      {/* Overblik */}
      <div className="kort mx-6 mt-[22px] px-5 py-[6px]">
        <Overblik tal="2" farve="var(--accent)" tekst="batches i gæring" link="Se alle" top={false} />
        <Overblik tal="3" farve="var(--accent)" tekst="nye bestillinger i dag" link="Salg" top />
        <Overblik tal="1" farve="var(--advarsel)" tekst="måling mangler på nr. 24" link="Log" top={false} sidste />
      </div>

      <div className="label mx-6 mt-[26px]">AKTIVE BRYG</div>

      <div className="mx-6 mt-3 flex flex-col gap-[10px]">
        <BrygKort
          navn="Nr. 24 · Enghave IPA"
          pilleTekst="GÆRING · DAG 5"
          pilleKlasse="pille-accent"
          bjaelke={38}
          bjaelkeFarve="var(--accent)"
          felter={["SG 1,018", "19,5 °C", "Klar ca. 24. jul"]}
        />
        <BrygKort
          navn="Nr. 23 · Havre Stout"
          pilleTekst="LAGRING · DAG 12"
          pilleKlasse="pille-succes"
          bjaelke={74}
          bjaelkeFarve="var(--succes)"
          felter={["FG 1,012", "4 °C", "Klar ca. 16. jul"]}
        />
      </div>

      <div className="mx-6 mt-[18px] flex gap-[10px]">
        <div className="btn btn-primary flex-1">+ Ny brygning</div>
        <div className="btn btn-sekundaer flex-1">Tilføj måling</div>
      </div>

      <BottomNav items={brewerNav("hjem")} />
    </Screen>
  );
}

function Overblik({
  tal,
  farve,
  tekst,
  link,
  top,
  sidste = false,
}: {
  tal: string;
  farve: string;
  tekst: string;
  link: string;
  top: boolean;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[54px] items-center gap-[14px]"
      style={{
        borderTop: top ? "1px solid var(--kant-svag)" : undefined,
        borderBottom: sidste ? undefined : "1px solid var(--kant-svag)",
      }}
    >
      <span
        className="font-display"
        style={{ fontSize: 26, lineHeight: 1, color: farve, minWidth: 28 }}
      >
        {tal}
      </span>
      <span className="text-[15px]">{tekst}</span>
      <span className="ml-auto text-[13px] text-tekst-daempet">{link}</span>
    </div>
  );
}

function BrygKort({
  navn,
  pilleTekst,
  pilleKlasse,
  bjaelke,
  bjaelkeFarve,
  felter,
}: {
  navn: string;
  pilleTekst: string;
  pilleKlasse: string;
  bjaelke: number;
  bjaelkeFarve: string;
  felter: [string, string, string];
}) {
  return (
    <div className="kort flex flex-col gap-3 px-5 py-[18px]">
      <div className="flex items-baseline gap-[10px]">
        <span className="font-display text-[22px] leading-none">{navn}</span>
        <span className={`pille ${pilleKlasse} ml-auto`}>{pilleTekst}</span>
      </div>
      <div className="bjaelke" style={{ height: 5 }}>
        <span style={{ width: `${bjaelke}%`, background: bjaelkeFarve }} />
      </div>
      <div className="flex gap-[18px] text-[13px] text-tekst-daempet">
        <span>{felter[0]}</span>
        <span>{felter[1]}</span>
        <span className="ml-auto">{felter[2]}</span>
      </div>
    </div>
  );
}
