import Link from "next/link";
import { BottomNav, Display, Screen } from "@/components/ui";
import { brewerNav } from "@/lib/nav";

/* Øl-farve-cirkel (skum/farve), 3px papirkant + 1px ring */
export function OelPrik({ farve, size = 46 }: { farve: string; size?: number }) {
  return (
    <div
      className="flex-shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: farve,
        border: "3px solid var(--baggrund)",
        boxShadow: "0 0 0 1px var(--kant)",
      }}
    />
  );
}

/* 02 · Brygninger */
export default function Brygninger() {
  return (
    <Screen>
      <div className="px-6">
        <Display>Brygninger</Display>
      </div>

      <div className="segment mx-6 mt-[18px]">
        <div className="segment-val segment-val--aktiv">Aktive</div>
        <div className="segment-val">Planlagte</div>
        <div className="segment-val">Arkiv</div>
      </div>

      <div className="mx-6 mt-[18px] flex flex-col gap-[10px]">
        <Rk href="/system/brygninger/24" farve="#D08C2E" navn="Nr. 24 · Enghave IPA" sub="West coast IPA · 6,2 % · 500 L" pille="GÆRING" pilleKlasse="pille-accent" />
        <Rk farve="#2E2013" navn="Nr. 23 · Havre Stout" sub="Oatmeal stout · 5,4 % · 500 L" pille="LAGRING" pilleKlasse="pille-succes" />
        <Rk farve="#E8C36A" navn="Nr. 25 · Sommerpilsner" sub="Tjekkisk pilsner · 4,8 % · 1.000 L" pille="PLANLAGT" pilleKlasse="pille-tom" />
        <Rk farve="#B4622D" navn="Nr. 22 · Rød Ale" sub="Irish red · 5,0 % · 500 L" pille="KLAR" pilleKlasse="pille-succes-fyldt" />
      </div>

      <div className="btn btn-primary mx-6 mt-[18px]">+ Ny brygning fra opskrift</div>

      <BottomNav items={brewerNav("bryg")} />
    </Screen>
  );
}

function Rk({
  farve,
  navn,
  sub,
  pille,
  pilleKlasse,
  href,
}: {
  farve: string;
  navn: string;
  sub: string;
  pille: string;
  pilleKlasse: string;
  href?: string;
}) {
  const body = (
    <div className="kort flex items-center gap-4 px-5 py-[18px]">
      <OelPrik farve={farve} />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-display text-[21px]" style={{ lineHeight: 1.35 }}>
          {navn}
        </span>
        <span className="text-[13px] text-tekst-daempet">{sub}</span>
      </div>
      <span className={`pille ${pilleKlasse} ml-auto`}>{pille}</span>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
