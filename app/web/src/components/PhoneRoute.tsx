import type { ReactNode } from "react";
import PhoneFrame from "./PhoneFrame";

/**
 * Centrerer én skærm i telefonrammen på design-lærredet.
 * Bruges på de enkelte ruter, så hver skærm kan ses som en rigtig enhed.
 */
export default function PhoneRoute({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <main
      className="flex min-h-screen items-start justify-center p-6 sm:p-10"
      style={{ background: "var(--laerred)" }}
    >
      <PhoneFrame dark={dark}>{children}</PhoneFrame>
    </main>
  );
}
