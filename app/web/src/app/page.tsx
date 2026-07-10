import Link from "next/link";
import PhoneFrame from "@/components/PhoneFrame";

import Kortet from "@/components/screens/Kortet";
import BryggeriProfil from "@/components/screens/BryggeriProfil";
import Planer from "@/components/screens/Planer";
import MineBryggerier from "@/components/screens/MineBryggerier";
import Indstillinger from "@/components/screens/Indstillinger";
import BryggeriIndst from "@/components/screens/BryggeriIndst";
import LagerIndst from "@/components/screens/LagerIndst";
import OnlineSalg from "@/components/screens/OnlineSalg";
import Statistik from "@/components/screens/Statistik";
import Hjem from "@/components/screens/Hjem";
import Brygninger from "@/components/screens/Brygninger";
import Gaeringslog from "@/components/screens/Gaeringslog";
import Lager from "@/components/screens/Lager";
import Salg from "@/components/screens/Salg";
import BestilOel from "@/components/screens/BestilOel";

type Skaerm = { nr: string; navn: string; href: string; el: React.ReactNode };

const SET_3A: Skaerm[] = [
  { nr: "13", navn: "Kortet · offentligt", href: "/kort", el: <Kortet /> },
  { nr: "14", navn: "Bryggeri-profil · offentlig", href: "/bryggeri/enghave", el: <BryggeriProfil /> },
  { nr: "15", navn: "Planer · for bryggerier", href: "/planer", el: <Planer /> },
];

const SET_2A: Skaerm[] = [
  { nr: "07", navn: "Mine bryggerier", href: "/system/bryggerier", el: <MineBryggerier /> },
  { nr: "08", navn: "Indstillinger", href: "/system/indstillinger", el: <Indstillinger /> },
  { nr: "09", navn: "Bryggeri", href: "/system/indstillinger/bryggeri", el: <BryggeriIndst /> },
  { nr: "10", navn: "Lager", href: "/system/indstillinger/lager", el: <LagerIndst /> },
  { nr: "11", navn: "Online salg", href: "/system/indstillinger/salg", el: <OnlineSalg /> },
  { nr: "12", navn: "Statistik · salg", href: "/system/statistik", el: <Statistik /> },
];

const BRYGGER: Skaerm[] = [
  { nr: "01", navn: "Hjem", href: "/system", el: <Hjem /> },
  { nr: "02", navn: "Brygninger", href: "/system/brygninger", el: <Brygninger /> },
  { nr: "03", navn: "Gæringslog", href: "/system/brygninger/24", el: <Gaeringslog /> },
  { nr: "04", navn: "Lager", href: "/system/lager", el: <Lager /> },
  { nr: "05", navn: "Salg & taproom", href: "/system/salg", el: <Salg /> },
];

const KUNDE: Skaerm[] = [{ nr: "06", navn: "Bestil øl", href: "/bestil/enghave", el: <BestilOel /> }];

export default function Gallery() {
  return (
    <main className="min-h-screen" style={{ background: "var(--laerred)" }}>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 px-8 py-16 sm:px-[72px]">
        <Sektion
          badge="3A"
          titel="Danmarkskortet & planer"
          undertitel="Åbent kort for alle · bryggerier tilmelder sig eller opgraderer"
          skaerme={SET_3A}
        />
        <Sektion
          badge="2A"
          titel="Tenants, indstillinger & statistik"
          undertitel="Administration af bryggerier på platformen"
          skaerme={SET_2A}
        />
        <Sektion
          badge="1A"
          titel="Mit Mikrobryggeri"
          undertitel="Stilren håndværksretning · mobil · dansk"
          skaerme={BRYGGER}
          gruppe="BRYGGERENS APP"
          ekstraGruppe={{ navn: "KUNDENS APP", skaerme: KUNDE }}
        />
      </div>
    </main>
  );
}

function Sektion({
  badge,
  titel,
  undertitel,
  skaerme,
  gruppe,
  ekstraGruppe,
}: {
  badge: string;
  titel: string;
  undertitel: string;
  skaerme: Skaerm[];
  gruppe?: string;
  ekstraGruppe?: { navn: string; skaerme: Skaerm[] };
}) {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-baseline gap-[18px]">
        <span
          className="rounded-full px-[11px] py-[7px] font-sans text-[13px] font-semibold uppercase tracking-[1px]"
          style={{ background: "var(--moerk-flade)", color: "var(--moerk-tekst)" }}
        >
          {badge}
        </span>
        <span className="font-display text-tekst" style={{ fontSize: 44, lineHeight: 1.25 }}>
          {titel}
        </span>
        <span className="font-sans text-[16px] text-tekst-daempet">{undertitel}</span>
      </div>

      {gruppe ? (
        <div className="flex flex-col gap-5">
          <GruppeEtiket>{gruppe}</GruppeEtiket>
          <Raekke skaerme={skaerme} />
        </div>
      ) : (
        <Raekke skaerme={skaerme} />
      )}

      {ekstraGruppe && (
        <div className="flex flex-col gap-5">
          <GruppeEtiket>{ekstraGruppe.navn}</GruppeEtiket>
          <Raekke skaerme={ekstraGruppe.skaerme} />
        </div>
      )}
    </section>
  );
}

function GruppeEtiket({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-sans uppercase"
      style={{ fontSize: 12, fontWeight: 600, letterSpacing: "2.4px", color: "var(--tekst-daempet)" }}
    >
      {children}
    </div>
  );
}

function Raekke({ skaerme }: { skaerme: Skaerm[] }) {
  return (
    <div className="flex flex-wrap gap-10">
      {skaerme.map((s) => (
        <div key={s.nr} className="flex flex-col gap-[14px]">
          <Link href={s.href} className="font-sans text-[13px] font-medium text-tekst-daempet hover:text-accent">
            {s.nr} · {s.navn}
          </Link>
          <PhoneFrame>{s.el}</PhoneFrame>
        </div>
      ))}
    </div>
  );
}
