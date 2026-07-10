import { BottomNav, Screen, Tilbage } from "@/components/ui";
import { brewerNav } from "@/lib/nav";

/* 03 · Gæringslog — batch-detalje med SG-kurve */
export default function Gaeringslog() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <Tilbage href="/system/brygninger">Brygninger</Tilbage>
        <div className="flex items-baseline gap-3">
          <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
            Nr. 24 · Enghave IPA
          </span>
        </div>
        <div className="mt-1 flex gap-2">
          <span className="pille pille-accent">GÆRING · DAG 5</span>
          <span className="pille pille-neutral">TANK 2 · 500 L</span>
        </div>
      </div>

      {/* SG-kort */}
      <div className="kort mx-6 mt-5 p-5">
        <div className="flex items-baseline">
          <span className="label">MASSEFYLDE (SG)</span>
          <span className="ml-auto font-display text-[24px] leading-none text-accent">1,018</span>
        </div>
        <svg width="100%" height="120" viewBox="0 0 314 120" className="mt-[14px] block">
          <line x1="0" y1="20" x2="314" y2="20" stroke="var(--kant-svag)" strokeWidth="1" />
          <line x1="0" y1="60" x2="314" y2="60" stroke="var(--kant-svag)" strokeWidth="1" />
          <line x1="0" y1="100" x2="314" y2="100" stroke="var(--kant-svag)" strokeWidth="1" />
          <polyline
            points="10,14 70,26 130,52 190,78 250,92 304,98"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            [10, 14],
            [70, 26],
            [130, 52],
            [190, 78],
            [250, 92],
          ].map(([cx, cy]) => (
            <circle key={`${cx}`} cx={cx} cy={cy} r="4" fill="var(--baggrund)" stroke="var(--accent)" strokeWidth="2" />
          ))}
          <circle cx="304" cy="98" r="5" fill="var(--accent)" />
        </svg>
        <div className="mt-2 flex justify-between text-[12px] text-tekst-daempet">
          <span>4. jul · 1,062</span>
          <span>Mål: 1,012</span>
        </div>
      </div>

      <div className="label mx-6 mt-5">SENESTE MÅLINGER</div>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Maaling tid="I dag 08:10" vaerdi="SG 1,018 · 19,5 °C" note="Stabil" noteFarve="var(--succes)" />
        <Maaling tid="I går 08:05" vaerdi="SG 1,024 · 19,8 °C" note="Falder" />
        <Maaling tid="6. jul 08:15" vaerdi="SG 1,034 · 20,1 °C" note="Falder" sidste />
      </div>

      <div className="btn btn-accent mx-6 mt-[18px]">+ Tilføj måling</div>

      <BottomNav items={brewerNav("bryg")} />
    </Screen>
  );
}

function Maaling({
  tid,
  vaerdi,
  note,
  noteFarve = "var(--tekst-daempet)",
  sidste = false,
}: {
  tid: string;
  vaerdi: string;
  note: string;
  noteFarve?: string;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[52px] items-center gap-[14px]"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <span className="min-w-[64px] text-[14px] text-tekst-daempet">{tid}</span>
      <span className="text-[15px] font-semibold">{vaerdi}</span>
      <span className="ml-auto text-[13px]" style={{ color: noteFarve }}>
        {note}
      </span>
    </div>
  );
}
