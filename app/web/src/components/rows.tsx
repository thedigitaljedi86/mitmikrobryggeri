import type { ReactNode } from "react";
import { Toggle } from "@/components/ui";

/* Delte rækketyper til indstillings- og listekort. */

const sep = "1px solid var(--kant-svag)";

/* Række med titel + undertekst + → (navigationsrække) */
export function NavRow({
  titel,
  sub,
  minH = 62,
  hoejre = "→",
  sidste = false,
}: {
  titel: string;
  sub?: string;
  minH?: number;
  hoejre?: ReactNode;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-[14px]"
      style={{ minHeight: minH, borderBottom: sidste ? undefined : sep }}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{titel}</span>
        {sub && <span className="text-[13px] text-tekst-daempet">{sub}</span>}
      </div>
      <span className="ml-auto text-tekst-daempet">{hoejre}</span>
    </div>
  );
}

/* Række med titel + undertekst + toggle */
export function ToggleRow({
  titel,
  sub,
  on = false,
  minH = 58,
  plain = false,
  daempet = false,
  sidste = false,
}: {
  titel: string;
  sub?: string;
  on?: boolean;
  minH?: number;
  plain?: boolean;
  daempet?: boolean;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-[14px]"
      style={{ minHeight: minH, borderBottom: sidste ? undefined : sep }}
    >
      <div className="flex flex-col gap-[3px]">
        <span
          className={`text-[15px] ${plain ? "" : "font-semibold"}`}
          style={{ color: daempet ? "var(--tekst-daempet)" : undefined }}
        >
          {titel}
        </span>
        {sub && <span className="text-[13px] text-tekst-daempet">{sub}</span>}
      </div>
      <div className="ml-auto">
        <Toggle on={on} />
      </div>
    </div>
  );
}

/* Felt-række (etiket over værdi) — til profil-visning */
export function FeltRow({
  etiket,
  vaerdi,
  sidste = false,
}: {
  etiket: string;
  vaerdi: string;
  sidste?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 py-[14px]" style={{ borderBottom: sidste ? undefined : sep }}>
      <span
        className="font-sans uppercase"
        style={{ fontSize: 12, fontWeight: 600, letterSpacing: "1px", color: "var(--tekst-daempet)" }}
      >
        {etiket}
      </span>
      <span className="text-[15px] font-semibold">{vaerdi}</span>
    </div>
  );
}

/* Simpel to-kolonne-række (venstre tekst, højre værdi) */
export function LinjeRow({
  venstre,
  hoejre,
  minH = 52,
  daempet = false,
  hoejreNode,
  sidste = false,
}: {
  venstre: string;
  hoejre?: string;
  minH?: number;
  daempet?: boolean;
  hoejreNode?: ReactNode;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ minHeight: minH, borderBottom: sidste ? undefined : sep }}
    >
      <span className="text-[15px]" style={{ color: daempet ? "var(--tekst-daempet)" : undefined }}>
        {venstre}
      </span>
      {hoejreNode ?? (
        <span
          className="ml-auto text-[15px]"
          style={{ fontWeight: daempet ? 400 : 600, color: daempet ? "var(--tekst-daempet)" : undefined }}
        >
          {hoejre}
        </span>
      )}
    </div>
  );
}
