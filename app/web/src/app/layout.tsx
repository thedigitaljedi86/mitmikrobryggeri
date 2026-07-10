import type { Metadata } from "next";
import { Lora, Instrument_Sans } from "next/font/google";
import "./globals.css";

/* Fonte fra CLAUDE.md §9: Lora (display/titler/tal) + Instrument Sans (UI/body). */
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mit Mikrobryggeri",
  description:
    "Bryggerikortet — offentligt danmarkskort over mikrobryggerier, med app til bestillinger, lager, brygninger og statistik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className={`${lora.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
