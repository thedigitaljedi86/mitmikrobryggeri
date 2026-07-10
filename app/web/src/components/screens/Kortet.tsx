import Link from "next/link";
import { BottomNav, Screen } from "@/components/ui";
import { publicNav } from "@/lib/nav";

/* 13 · Kortet — offentligt danmarkskort med pins/klynger */
export default function Kortet() {
  return (
    <Screen paddingTop={66}>
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-baseline gap-[10px]">
          <span className="font-display text-[28px]" style={{ lineHeight: 1.2 }}>
            Bryggerikortet
          </span>
          <span className="ml-auto text-[13px] text-tekst-daempet">214 bryggerier</span>
        </div>
        <div className="form-input">Søg bryggeri eller by</div>
      </div>

      {/* Kort-lærred */}
      <div className="relative mt-[14px] flex-1 overflow-hidden" style={{ background: "#E8EDE6" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 402 520"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 block"
        >
          {/* stiliseret danmarkskort */}
          <path
            d="M118,28 C96,52 104,96 88,128 C72,160 52,198 58,244 C64,292 84,336 114,368 C138,394 172,400 186,378 C196,362 182,334 184,306 C186,276 204,256 197,222 C190,190 172,174 174,142 C176,104 158,60 146,32 C138,12 128,12 118,28 Z"
            fill="#F7F2E6"
            stroke="#D6CCB8"
            strokeWidth="1.5"
          />
          <ellipse cx="232" cy="392" rx="40" ry="32" fill="#F7F2E6" stroke="#D6CCB8" strokeWidth="1.5" />
          <path
            d="M300,340 C294,312 316,290 344,294 C374,298 394,318 390,350 C386,382 360,404 332,398 C306,393 305,366 300,340 Z"
            fill="#F7F2E6"
            stroke="#D6CCB8"
            strokeWidth="1.5"
          />
          <circle cx="386" cy="470" r="10" fill="#F7F2E6" stroke="#D6CCB8" strokeWidth="1.5" />
          {/* klynge-markører */}
          <Klynge cx={120} cy={120} n="6" />
          <Klynge cx={96} cy={250} n="4" />
          <circle cx="150" cy="330" r="7" fill="var(--accent)" stroke="var(--baggrund)" strokeWidth="2.5" />
          <circle cx="232" cy="388" r="7" fill="var(--accent)" stroke="var(--baggrund)" strokeWidth="2.5" />
          <Klynge cx={330} cy={322} n="9" />
          <circle cx="356" cy="366" r="11" fill="var(--accent)" stroke="var(--baggrund)" strokeWidth="3" />
        </svg>

        {/* nærmeste bryggeri — løftet kort */}
        <Link
          href="/bryggeri/enghave"
          className="kort loeft absolute bottom-[18px] left-5 right-5 flex items-center gap-[14px] px-[18px] py-4"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-knap font-display text-[18px] text-moerk-tekst" style={{ background: "var(--moerk-flade)" }}>
            BE
          </div>
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="font-display text-[19px]" style={{ lineHeight: 1.35 }}>
              Bryghuset Enghave
            </span>
            <span className="text-[13px] text-tekst-daempet">
              1,2 km · <span className="font-semibold text-succes">Åbent</span> · 3 øl på hanen
            </span>
          </div>
          <span className="ml-auto flex-shrink-0 text-tekst-daempet">→</span>
        </Link>
      </div>

      <BottomNav items={publicNav("kort")} marginTopAuto={false} />
    </Screen>
  );
}

function Klynge({ cx, cy, n }: { cx: number; cy: number; n: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="13" fill="var(--moerk-flade)" />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="var(--moerk-tekst)"
        fontFamily="var(--font-instrument), sans-serif"
        fontSize="12"
        fontWeight="700"
      >
        {n}
      </text>
    </>
  );
}
