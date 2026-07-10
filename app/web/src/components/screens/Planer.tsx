import { Screen } from "@/components/ui";

/* 15 · Planer — Gratis / Starter / Pro */
export default function Planer() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <div className="font-sans text-[13px] font-medium uppercase tracking-[2px] text-accent">
          For bryggerier
        </div>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Kom på kortet
        </span>
        <div className="text-[15px] text-tekst-daempet" style={{ lineHeight: 1.45 }}>
          Bliv vist gratis — eller få hele værkstedet til bestillinger, lager og brygninger.
        </div>
      </div>

      <div className="mx-6 mt-5 flex flex-col gap-3">
        {/* Gratis */}
        <div className="kort flex flex-col gap-[10px] p-5">
          <PlanHoved navn="På kortet" pris="Gratis" />
          <PlanPunkter punkter={["Profil på danmarkskortet", "Åbningstider & øl på hanen", "Events vises for gæster"]} />
          <PlanKnap etiket="Tilmeld gratis" klasse="btn-omrids" />
        </div>

        {/* Starter */}
        <div className="kort flex flex-col gap-[10px] p-5">
          <PlanHoved navn="Starter" pris="149 kr" enhed="/md" />
          <PlanPunkter punkter={["Alt i Gratis", "Webshop & online bestillinger", "Klik & hent · salgsoverblik"]} />
          <PlanKnap etiket="Vælg Starter" klasse="btn-omrids" />
        </div>

        {/* Pro */}
        <div className="kort-moerk relative flex flex-col gap-[10px] p-5">
          <span
            className="pille pille-fremhaev absolute right-[18px] top-[-10px]"
            style={{ padding: "6px 12px", fontSize: 11 }}
          >
            FLEST VÆLGER
          </span>
          <PlanHoved navn="Pro" pris="349 kr" enhed="/md" moerk />
          <PlanPunkter
            moerk
            punkter={["Alt i Starter", "Lager, brygninger & gæringslog", "Fuld statistik & flere brugere"]}
          />
          <PlanKnap etiket="Vælg Pro" klasse="btn-fremhaev" />
        </div>
      </div>

      <div className="mx-6 mb-8 mt-[14px] text-center text-[13px] text-tekst-daempet">
        Ingen binding · skift eller opsig når som helst
      </div>
    </Screen>
  );
}

function PlanHoved({ navn, pris, enhed, moerk = false }: { navn: string; pris: string; enhed?: string; moerk?: boolean }) {
  return (
    <div className="flex items-baseline">
      <span className="font-display text-[22px]" style={{ lineHeight: 1.35 }}>
        {navn}
      </span>
      <span
        className="ml-auto font-display text-[22px] leading-none"
        style={{ color: moerk ? "var(--fremhaev)" : undefined }}
      >
        {pris}
        {enhed && (
          <span
            className="font-sans text-[13px] leading-none"
            style={{ color: moerk ? "var(--moerk-daempet)" : "var(--tekst-daempet)" }}
          >
            {enhed}
          </span>
        )}
      </span>
    </div>
  );
}

function PlanPunkter({ punkter, moerk = false }: { punkter: string[]; moerk?: boolean }) {
  return (
    <div
      className="flex flex-col gap-[6px] text-[14px]"
      style={{ color: moerk ? "var(--moerk-daempet)" : "var(--tekst-blod)" }}
    >
      {punkter.map((p) => (
        <span key={p}>· {p}</span>
      ))}
    </div>
  );
}

function PlanKnap({ etiket, klasse }: { etiket: string; klasse: string }) {
  return (
    <div className={`btn ${klasse}`} style={{ height: 46, borderRadius: 12 }}>
      {etiket}
    </div>
  );
}
