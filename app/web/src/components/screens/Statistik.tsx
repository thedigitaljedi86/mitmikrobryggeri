import { Label, Screen } from "@/components/ui";

/* 12 · Statistik — omsætning, kanalfordeling, mest solgte */
export default function Statistik() {
  return (
    <Screen>
      <div className="px-6">
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Statistik
        </span>
      </div>

      <div className="segment mx-6 mt-4">
        <div className="segment-val">Uge</div>
        <div className="segment-val segment-val--aktiv">Måned</div>
        <div className="segment-val">År</div>
      </div>

      {/* Omsætning */}
      <div className="kort mx-6 mt-4 p-5">
        <div className="flex items-baseline gap-[10px]">
          <span className="label">OMSÆTNING · JULI</span>
          <span className="ml-auto font-display text-[26px] leading-none text-accent">48.320 kr</span>
        </div>
        <div className="mt-1 flex gap-4 text-[13px] text-succes">
          <span>+12 % vs. juni</span>
        </div>
        <div className="mt-4 flex h-[110px] items-end gap-2">
          <Soejle h={42} />
          <Soejle h={58} />
          <Soejle h={50} />
          <Soejle h={66} />
          <Soejle h={74} accent />
          <Soejle h={92} accent />
          <Soejle h={30} stiplet />
        </div>
        <div className="mt-2 flex gap-2 text-[11px] text-tekst-daempet">
          {["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul"].map((m) => (
            <span key={m} className="flex-1 text-center">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Kanalfordeling */}
      <div className="mx-6 mt-[14px] flex gap-[10px]">
        <Kanal etiket="TAPROOM" tal="61 %" />
        <Kanal etiket="WEBSHOP" tal="27 %" />
        <Kanal etiket="ERHVERV" tal="12 %" />
      </div>

      <Label className="mx-6 mt-5">MEST SOLGTE</Label>
      <div className="kort mx-6 mb-8 mt-[10px] px-5 py-1">
        <MestSolgt navn="Enghave IPA" tal="412 stk · 18.130 kr" pct={100} />
        <MestSolgt navn="Havre Stout" tal="296 stk · 13.620 kr" pct={72} />
        <MestSolgt navn="Rød Ale" tal="188 stk · 7.900 kr" pct={44} sidste />
      </div>
    </Screen>
  );
}

function Soejle({ h, accent = false, stiplet = false }: { h: number; accent?: boolean; stiplet?: boolean }) {
  return (
    <div
      className="flex-1"
      style={{
        height: `${h}%`,
        borderRadius: "6px 6px 0 0",
        background: stiplet ? "var(--kant-svag)" : accent ? "var(--accent)" : "var(--kant)",
        border: stiplet ? "1px dashed #c9bfad" : undefined,
        boxSizing: "border-box",
      }}
    />
  );
}

function Kanal({ etiket, tal }: { etiket: string; tal: string }) {
  return (
    <div className="kort flex flex-1 flex-col gap-1 px-[18px] py-4">
      <span
        className="font-sans uppercase"
        style={{ fontSize: 12, fontWeight: 600, letterSpacing: "1px", color: "var(--tekst-daempet)" }}
      >
        {etiket}
      </span>
      <span className="font-display text-[22px] leading-none">{tal}</span>
    </div>
  );
}

function MestSolgt({ navn, tal, pct, sidste = false }: { navn: string; tal: string; pct: number; sidste?: boolean }) {
  return (
    <div
      className="flex flex-col gap-2 py-[14px]"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <div className="flex items-baseline">
        <span className="text-[15px] font-semibold">{navn}</span>
        <span className="ml-auto text-[14px] text-tekst-daempet">{tal}</span>
      </div>
      <div className="bjaelke">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
