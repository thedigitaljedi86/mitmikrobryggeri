import { BottomNav, Label, Screen } from "@/components/ui";
import { brewerNav } from "@/lib/nav";

/* 04 · Lager — beholdning med lav-lager-advarsler */
export default function Lager() {
  return (
    <Screen>
      <div className="flex items-baseline px-6">
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Lager
        </span>
        <span className="pille pille-advarsel ml-auto">2 VARER LAVT</span>
      </div>

      <Label className="mx-6 mt-5">MALT</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Vare navn="Pilsnermalt" maengde="120 kg" pct={72} />
        <Vare navn="Münchenermalt" maengde="18 kg" pct={12} lavt />
        <Vare navn="Havreflager" maengde="45 kg" pct={48} sidste />
      </div>

      <Label className="mx-6 mt-5">HUMLE</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Vare navn="Citra" maengde="2,4 kg" pct={60} />
        <Vare navn="Saaz" maengde="0,3 kg" pct={8} lavt sidste />
      </div>

      <Label className="mx-6 mt-5">GÆR</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Vare navn="US-05 · tørgær" maengde="14 breve" pct={82} sidste />
      </div>

      <div className="btn btn-primary mx-6 mt-[18px]">Opret indkøbsliste · 2 varer</div>

      <BottomNav items={brewerNav("lager")} />
    </Screen>
  );
}

function Vare({
  navn,
  maengde,
  pct,
  lavt = false,
  sidste = false,
}: {
  navn: string;
  maengde: string;
  pct: number;
  lavt?: boolean;
  sidste?: boolean;
}) {
  const farve = lavt ? "var(--advarsel)" : "var(--succes)";
  return (
    <div
      className="flex flex-col gap-2 py-[14px]"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <div className="flex items-baseline gap-[10px]">
        <span className="text-[15px] font-semibold">{navn}</span>
        {lavt && (
          <span
            className="font-sans uppercase"
            style={{ fontWeight: 600, fontSize: 10, lineHeight: 1, letterSpacing: "1px", color: "var(--advarsel)" }}
          >
            LAVT
          </span>
        )}
        <span className="ml-auto text-[14px] text-tekst-daempet">{maengde}</span>
      </div>
      <div className="bjaelke">
        <span style={{ width: `${pct}%`, background: farve }} />
      </div>
    </div>
  );
}
