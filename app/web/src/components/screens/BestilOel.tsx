import { BottomNav, Label, Screen } from "@/components/ui";
import { customerNav } from "@/lib/nav";
import { OelPrik } from "./Brygninger";

/* 06 · Bestil øl — kundens flade ({slug}.roddomæne) */
export default function BestilOel() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <div className="font-sans text-[12px] font-medium uppercase tracking-[2px] text-tekst-daempet">
          Mit Mikrobryggeri
        </div>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Bryghuset Enghave
        </span>
        <div className="flex items-center gap-2 text-[14px]">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--succes)" }} />
          <span className="font-semibold text-succes">Åbent</span>
          <span className="text-tekst-daempet">· taproom til 22 · Enghavevej 41, Kbh SV</span>
        </div>
      </div>

      <Label className="mx-6 mt-5">PÅ HANEN &amp; I KØLEREN</Label>
      <div className="mx-6 mt-[10px] flex flex-col gap-[10px]">
        <OelRk farve="#D08C2E" navn="Enghave IPA" sub="West coast IPA · 6,2 % · 44 kr" />
        <OelRk farve="#2E2013" navn="Havre Stout" sub="Oatmeal stout · 5,4 % · 46 kr" />
        <OelRk farve="#B4622D" navn="Rød Ale" sub="Irish red · 5,0 % · 42 kr" />
      </div>

      {/* Event */}
      <div className="kort-moerk mx-6 mt-4 flex flex-col gap-[6px] px-5 py-[18px]">
        <div className="font-display text-[19px]" style={{ lineHeight: 1.35 }}>
          Fredagsbar · smagning af Havre Stout
        </div>
        <div className="flex items-baseline gap-[10px]">
          <span className="text-[13px] text-moerk-daempet">Fredag 11. juli · 16–22 · gratis</span>
          <span className="pille pille-fremhaev ml-auto" style={{ padding: "8px 14px", fontSize: 12 }}>
            TILMELD
          </span>
        </div>
      </div>

      {/* Kurv */}
      <div className="btn btn-accent mx-6 mt-[18px] justify-start px-5" style={{ height: 54 }}>
        <span>Se kurv · 2 varer</span>
        <span className="ml-auto">90 kr</span>
      </div>

      <BottomNav items={customerNav("oel")} />
    </Screen>
  );
}

function OelRk({ farve, navn, sub }: { farve: string; navn: string; sub: string }) {
  return (
    <div className="kort flex items-center gap-[14px] px-[18px] py-4">
      <OelPrik farve={farve} size={44} />
      <div className="flex min-w-0 flex-col gap-[3px]">
        <span className="font-display text-[20px]" style={{ lineHeight: 1.35 }}>
          {navn}
        </span>
        <span className="text-[13px] text-tekst-daempet">{sub}</span>
      </div>
      <div className="ml-auto flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[22px] text-moerk-tekst" style={{ background: "var(--moerk-flade)" }}>
        +
      </div>
    </div>
  );
}
