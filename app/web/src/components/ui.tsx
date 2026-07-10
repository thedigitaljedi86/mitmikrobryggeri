import Link from "next/link";
import type { ReactNode } from "react";

/* ---- Skærm-skal: varm papirbaggrund, flex-kolonne ---- */
export function Screen({
  children,
  paddingTop = 72,
  dark = false,
}: {
  children: ReactNode;
  paddingTop?: number;
  dark?: boolean;
}) {
  return (
    <div
      className="flex min-h-full flex-col font-sans"
      style={{
        background: dark ? "var(--moerk-flade)" : "var(--baggrund)",
        color: dark ? "var(--moerk-tekst)" : "var(--tekst)",
        paddingTop,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Bundnavigation (tab bar) ---- */
export type NavItem = { label: string; active?: boolean; href?: string };

export function BottomNav({
  items,
  marginTopAuto = true,
}: {
  items: NavItem[];
  marginTopAuto?: boolean;
}) {
  return (
    <div
      className="flex border-t border-kant bg-baggrund"
      style={{ marginTop: marginTopAuto ? "auto" : undefined, padding: "14px 10px 34px 10px" }}
    >
      {items.map((it) => {
        const inner = (
          <div className="flex flex-1 flex-col items-center gap-[7px]">
            <div
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: it.active ? "var(--accent)" : "transparent" }}
            />
            <span
              className="font-sans uppercase"
              style={{
                fontWeight: it.active ? 700 : 600,
                fontSize: 10,
                lineHeight: 1,
                letterSpacing: "1.6px",
                color: it.active ? "var(--tekst)" : "var(--tekst-daempet)",
              }}
            >
              {it.label}
            </span>
          </div>
        );
        return it.href ? (
          <Link key={it.label} href={it.href} className="flex flex-1">
            {inner}
          </Link>
        ) : (
          <div key={it.label} className="flex flex-1">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Toggle ---- */
export function Toggle({ on = false }: { on?: boolean }) {
  return (
    <div className={`toggle ${on ? "toggle--on" : ""}`}>
      <div className="knop" />
    </div>
  );
}

/* ---- Sektionsetiket ---- */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`label ${className}`}>{children}</div>;
}

/* ---- Tilbage-link (← Tekst) ---- */
export function Tilbage({ children, href }: { children: ReactNode; href?: string }) {
  const cls = "font-sans text-[13px] font-medium text-tekst-daempet";
  return href ? (
    <Link href={href} className={cls}>
      ← {children}
    </Link>
  ) : (
    <div className={cls}>← {children}</div>
  );
}

/* ---- Serif-display-tekst ---- */
export function Display({
  children,
  size = 34,
  className = "",
  style = {},
}: {
  children: ReactNode;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`font-display ${className}`}
      style={{ fontWeight: 400, fontSize: size, lineHeight: 1.3, ...style }}
    >
      {children}
    </span>
  );
}
