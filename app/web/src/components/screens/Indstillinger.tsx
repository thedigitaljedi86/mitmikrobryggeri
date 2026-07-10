import { Label, Screen } from "@/components/ui";
import { NavRow, ToggleRow } from "@/components/rows";
import Link from "next/link";

/* 08 · Indstillinger — hub */
export default function Indstillinger() {
  return (
    <Screen>
      <div className="flex flex-col gap-1 px-6">
        <div className="font-sans text-[13px] font-medium uppercase tracking-[2px] text-accent">
          Bryghuset Enghave
        </div>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Indstillinger
        </span>
      </div>

      <div className="kort mx-6 mt-[22px] px-5 py-1">
        <Link href="/system/indstillinger/bryggeri">
          <NavRow titel="Bryggeri" sub="Profil, adresse, åbningstider, tanke" />
        </Link>
        <Link href="/system/indstillinger/lager">
          <NavRow titel="Lager" sub="Minimumsgrænser, enheder, leverandører" />
        </Link>
        <Link href="/system/indstillinger/salg">
          <NavRow titel="Online salg" sub="Webshop, betaling, afhentning, levering" />
        </Link>
        <Link href="/system/bryggerier">
          <NavRow titel="Brugere &amp; roller" sub="3 brugere · ejer, brygger, taproom" />
        </Link>
        <NavRow titel="Abonnement" sub="Håndværker-plan · 349 kr/md" sidste />
      </div>

      <Label className="mx-6 mt-[22px]">NOTIFIKATIONER</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <ToggleRow titel="Påmindelse om daglig måling" on minH={56} plain />
        <ToggleRow titel="Advarsel ved lavt lager" on minH={56} plain />
        <ToggleRow titel="Ny online bestilling" minH={56} plain sidste />
      </div>
    </Screen>
  );
}
