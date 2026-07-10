import { Screen } from "@/components/ui";

/* 07 · Mine bryggerier — tenant-liste, skift, brugere & roller */
export default function MineBryggerier() {
  return (
    <Screen>
      <div className="flex flex-col gap-1 px-6">
        <div className="font-sans text-[13px] font-medium uppercase tracking-[2px] text-accent">
          Konto · Anders Holm
        </div>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Mine bryggerier
        </span>
      </div>

      <div className="mx-6 mt-5 flex flex-col gap-[10px]">
        {/* Aktivt bryggeri — accent-kant */}
        <div
          className="flex items-center gap-4 rounded-kort bg-flade px-5 py-[18px]"
          style={{ border: "1.5px solid var(--accent)" }}
        >
          <Avatar bogstaver="BE" bg="var(--moerk-flade)" />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-display text-[21px]" style={{ lineHeight: 1.35 }}>
              Bryghuset Enghave
            </span>
            <span className="text-[13px] text-tekst-daempet">Ejer · København SV · 3 brugere</span>
          </div>
          <span
            className="ml-auto flex-shrink-0 font-sans uppercase"
            style={{ fontWeight: 600, fontSize: 11, letterSpacing: "1px", color: "var(--accent)" }}
          >
            Aktiv
          </span>
        </div>

        <div className="kort flex items-center gap-4 px-5 py-[18px]">
          <Avatar bogstaver="VB" bg="var(--succes)" />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-display text-[21px]" style={{ lineHeight: 1.35 }}>
              Vesterbro Bryglaug
            </span>
            <span className="text-[13px] text-tekst-daempet">Brygger · København V · 5 brugere</span>
          </div>
          <span className="ml-auto flex-shrink-0 text-[13px] text-tekst-daempet">Skift til</span>
        </div>

        <div className="kort-stiplet flex min-h-[56px] items-center justify-center text-[14px] font-semibold text-tekst-daempet">
          + Opret nyt bryggeri
        </div>
      </div>

      <div className="label mx-6 mt-[26px]">BRUGERE · BRYGHUSET ENGHAVE</div>
      <div className="kort mx-6 mt-3 px-5 py-1">
        <Bruger navn="Anders Holm" email="anders@enghave.dk" rolle="EJER" rolleKlasse="pille-moerk" />
        <Bruger navn="Sofie Lund" email="sofie@enghave.dk" rolle="BRYGGER" rolleKlasse="pille-neutral" />
        <Bruger navn="Mikkel Rask" email="mikkel@enghave.dk" rolle="TAPROOM" rolleKlasse="pille-neutral" sidste />
      </div>

      <div className="btn btn-sekundaer mx-6 mb-8 mt-3">Invitér bruger</div>
    </Screen>
  );
}

function Avatar({ bogstaver, bg }: { bogstaver: string; bg: string }) {
  return (
    <div
      className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-knap font-display text-[20px] text-moerk-tekst"
      style={{ background: bg }}
    >
      {bogstaver}
    </div>
  );
}

function Bruger({
  navn,
  email,
  rolle,
  rolleKlasse,
  sidste = false,
}: {
  navn: string;
  email: string;
  rolle: string;
  rolleKlasse: string;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[58px] items-center gap-[14px]"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{navn}</span>
        <span className="text-[13px] text-tekst-daempet">{email}</span>
      </div>
      <span className={`pille ${rolleKlasse} ml-auto`} style={{ padding: "5px 10px" }}>
        {rolle}
      </span>
    </div>
  );
}
