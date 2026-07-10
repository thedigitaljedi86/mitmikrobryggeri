import type { ReactNode } from "react";

/**
 * PhoneFrame — forenklet iOS-enhedsramme (dynamic island, statusbjælke,
 * home-indikator). Port af project/ios-frame.jsx (IOSDevice + IOSStatusBar),
 * 402×874, radius 48. Bruges i galleriet; på rigtige ruter fylder den skærmen.
 */

function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "#ffffff" : "#000000";
  return (
    <div className="relative z-20 flex w-full items-center justify-between px-6 pb-[19px] pt-[21px]">
      <div className="flex-1 pt-[1.5px] text-center">
        <span
          className="font-[system-ui]"
          style={{ fontWeight: 590, fontSize: 17, lineHeight: "22px", color: c }}
        >
          9:41
        </span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-[7px] pr-px pt-px">
        {/* signal */}
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c} />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c} />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c} />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c} />
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path
            d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z"
            fill={c}
          />
          <path
            d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
            fill={c}
          />
          <circle cx="8.5" cy="10.5" r="1.5" fill={c} />
        </svg>
        {/* batteri */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

export default function PhoneFrame({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden font-sans"
      style={{
        width: 402,
        height: 874,
        borderRadius: 48,
        background: dark ? "#000" : "var(--baggrund)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)",
      }}
    >
      {/* dynamic island */}
      <div
        className="absolute left-1/2 top-[11px] z-50 -translate-x-1/2"
        style={{ width: 126, height: 37, borderRadius: 24, background: "#000" }}
      />
      {/* statusbjælke */}
      <div className="absolute inset-x-0 top-0 z-10">
        <StatusBar dark={dark} />
      </div>
      {/* indhold — scroller inde i rammen */}
      <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
      {/* home-indikator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] flex h-[34px] items-end justify-center pb-2">
        <div
          style={{
            width: 139,
            height: 5,
            borderRadius: 100,
            background: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
}
