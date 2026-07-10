import Link from "next/link";
import { Label, Screen, Tilbage } from "@/components/ui";
import { OelPrik } from "./Brygninger";

/* 14 · Bryggeri-profil — offentlig side ({slug}.roddomæne) */
export default function BryggeriProfil() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <Tilbage href="/kort">Kortet</Tilbage>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Bryghuset Enghave
        </span>
        <div className="flex items-center gap-2 text-[14px]">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--succes)" }} />
          <span className="font-semibold text-succes">Åbent til 22</span>
          <span className="text-tekst-daempet">· Enghavevej 41, Kbh SV · 1,2 km</span>
        </div>
      </div>

      <div className="mx-6 mt-[18px] flex gap-[10px]">
        <Link href="/bestil/enghave" className="btn btn-primary flex-1">
          Bestil øl
        </Link>
        <div className="btn btn-sekundaer flex-1">Rutevejledning</div>
      </div>

      <Label className="mx-6 mt-[22px]">PÅ HANEN LIGE NU</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <PaaHanen farve="#D08C2E" navn="Enghave IPA" stil="West coast IPA · 6,2 %" pris="44 kr" />
        <PaaHanen farve="#2E2013" navn="Havre Stout" stil="Oatmeal stout · 5,4 %" pris="46 kr" />
        <PaaHanen farve="#B4622D" navn="Rød Ale" stil="Irish red · 5,0 %" pris="42 kr" sidste />
      </div>

      <Label className="mx-6 mt-[22px]">ÅBNINGSTIDER</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Tid dag="Tor–fre" tid="16–22" />
        <Tid dag="Lørdag" tid="12–22" />
        <Tid dag="Søn–ons" tid="Lukket" daempet sidste />
      </div>

      {/* Event */}
      <div className="kort-moerk mx-6 mb-8 mt-4 flex flex-col gap-[6px] px-5 py-[18px]">
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
    </Screen>
  );
}

function PaaHanen({
  farve,
  navn,
  stil,
  pris,
  sidste = false,
}: {
  farve: string;
  navn: string;
  stil: string;
  pris: string;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[58px] items-center gap-[14px]"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <OelPrik farve={farve} size={36} />
      <div className="flex flex-col gap-[2px]">
        <span className="text-[15px] font-semibold">{navn}</span>
        <span className="text-[13px] text-tekst-daempet">{stil}</span>
      </div>
      <span className="ml-auto text-[14px] font-semibold">{pris}</span>
    </div>
  );
}

function Tid({ dag, tid, daempet = false, sidste = false }: { dag: string; tid: string; daempet?: boolean; sidste?: boolean }) {
  return (
    <div
      className="flex min-h-[46px] items-center"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <span className="text-[15px]" style={{ color: daempet ? "var(--tekst-daempet)" : undefined }}>
        {dag}
      </span>
      <span
        className="ml-auto text-[15px]"
        style={{ fontWeight: daempet ? 400 : 600, color: daempet ? "var(--tekst-daempet)" : undefined }}
      >
        {tid}
      </span>
    </div>
  );
}
