import { Label, Screen, Tilbage } from "@/components/ui";
import { LinjeRow, NavRow, ToggleRow } from "@/components/rows";

/* 10 · Lager — indstillinger, minimumsgrænser, leverandører */
export default function LagerIndst() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <Tilbage href="/system/indstillinger">Indstillinger</Tilbage>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Lager
        </span>
      </div>

      <div className="kort mx-6 mt-5 px-5 py-1">
        <ToggleRow titel="Advarsel ved lavt lager" sub="Notifikation når en vare når minimum" on />
        <ToggleRow titel="Automatisk indkøbsliste" sub="Varer under minimum tilføjes selv" on />
        <ToggleRow titel="Træk fra lager ved brygstart" sub="Opskriftens råvarer trækkes automatisk" sidste />
      </div>

      <Label className="mx-6 mt-5">MINIMUMSGRÆNSER</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <LinjeRow venstre="Pilsnermalt" hoejre="min. 40 kg" />
        <LinjeRow venstre="Münchenermalt" hoejre="min. 25 kg" />
        <LinjeRow venstre="Citra-humle" hoejre="min. 1,0 kg" />
        <LinjeRow venstre="US-05 gær" hoejre="min. 6 breve" sidste />
      </div>

      <Label className="mx-6 mt-5">FASTE LEVERANDØRER</Label>
      <div className="kort mx-6 mb-8 mt-[10px] px-5 py-1">
        <NavRow titel="Dansk Maltcentral" sub="Malt · levering 2–3 dage" minH={54} />
        <NavRow titel="Humlegården ApS" sub="Humle &amp; gær · levering 1–2 dage" minH={54} sidste />
      </div>
    </Screen>
  );
}
