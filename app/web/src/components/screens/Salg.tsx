import { BottomNav, Label, Screen } from "@/components/ui";
import { brewerNav } from "@/lib/nav";

/* 05 · Salg & taproom */
export default function Salg() {
  return (
    <Screen>
      <div className="flex flex-col gap-1 px-6">
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Salg
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[30px] leading-none text-accent">2.140 kr</span>
          <span className="text-[13px] text-tekst-daempet">i dag · 9 bestillinger</span>
        </div>
      </div>

      <Label className="mx-6 mt-5">TIL AFHENTNING I DAG</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Bestilling navn="Mette K." detalje="6 × Enghave IPA · 1 × gavekort" hoejre="KL. 16:00" hoejreFarve="var(--accent)" />
        <Bestilling navn="Café Vestervang" detalje="2 fustager · Havre Stout" hoejre="KL. 17:30" hoejreFarve="var(--accent)" />
        <Bestilling navn="Jonas B." detalje="12 × blandet kasse" hoejre="AFHENTET" hoejreFarve="var(--succes)" sidste />
      </div>

      <Label className="mx-6 mt-5">TAPROOM &amp; EVENTS</Label>
      <div className="kort-moerk mx-6 mt-[10px] flex flex-col gap-[10px] p-5">
        <div className="flex items-baseline">
          <span className="font-display text-[22px]" style={{ lineHeight: 1.35 }}>
            Fredagsbar · smagning af Nr. 23
          </span>
        </div>
        <div className="text-[13px] text-moerk-daempet">Fredag 11. juli · 16–22 · taproom</div>
        <div className="mt-1 flex items-center gap-[10px]">
          <span className="font-display text-[24px] leading-none" style={{ color: "var(--fremhaev)" }}>
            18
          </span>
          <span className="text-[13px] text-moerk-daempet">tilmeldte · 32 pladser</span>
          <span className="pille pille-fremhaev ml-auto" style={{ padding: "8px 14px", fontSize: 12 }}>
            REDIGÉR
          </span>
        </div>
      </div>
      <div className="kort-stiplet mx-6 mt-[10px] flex min-h-[52px] items-center justify-center text-[14px] font-semibold text-tekst-daempet">
        + Nyt event
      </div>

      <BottomNav items={brewerNav("salg")} />
    </Screen>
  );
}

function Bestilling({
  navn,
  detalje,
  hoejre,
  hoejreFarve,
  sidste = false,
}: {
  navn: string;
  detalje: string;
  hoejre: string;
  hoejreFarve: string;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[58px] items-center gap-3"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{navn}</span>
        <span className="text-[13px] text-tekst-daempet">{detalje}</span>
      </div>
      <span
        className="ml-auto font-sans"
        style={{ fontWeight: 600, fontSize: 11, lineHeight: 1, letterSpacing: "1px", color: hoejreFarve }}
      >
        {hoejre}
      </span>
    </div>
  );
}
