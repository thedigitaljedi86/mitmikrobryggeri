import { Label, Screen, Tilbage } from "@/components/ui";
import { LinjeRow, ToggleRow } from "@/components/rows";

/* 11 · Online salg — webshop, betaling, afhentning, sortiment */
export default function OnlineSalg() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <Tilbage href="/system/indstillinger">Indstillinger</Tilbage>
        <div className="flex items-baseline">
          <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
            Online salg
          </span>
          <span className="pille pille-succes ml-auto">WEBSHOP ÅBEN</span>
        </div>
      </div>

      <div className="kort mx-6 mt-5 px-5 py-1">
        <ToggleRow titel="Webshop aktiv" sub="enghave.mitbryggeri.dk" on />
        <ToggleRow titel="Klik &amp; hent" sub="Afhentning i taproomets åbningstid" on />
        <ToggleRow titel="Levering" sub="Kun erhverv · min. 2 fustager" sidste />
      </div>

      <Label className="mx-6 mt-5">BETALING</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <LinjeRow venstre="MobilePay" hoejreNode={<Tilsluttet />} />
        <LinjeRow venstre="Kort (Visa/Mastercard)" hoejreNode={<Tilsluttet />} />
        <LinjeRow
          venstre="Faktura (erhverv)"
          hoejreNode={<span className="ml-auto text-[13px] text-tekst-daempet">Tilslut →</span>}
          sidste
        />
      </div>

      <Label className="mx-6 mt-5">SORTIMENT I WEBSHOPPEN</Label>
      <div className="kort mx-6 mb-8 mt-[10px] px-5 py-1">
        <ToggleRow titel="Enghave IPA · 44 kr" on plain minH={52} />
        <ToggleRow titel="Havre Stout · 46 kr" on plain minH={52} />
        <ToggleRow titel="Rød Ale · udsolgt" plain daempet minH={52} sidste />
      </div>
    </Screen>
  );
}

function Tilsluttet() {
  return (
    <span
      className="ml-auto font-sans uppercase"
      style={{ fontWeight: 600, fontSize: 11, letterSpacing: "1px", color: "var(--succes)" }}
    >
      Tilsluttet
    </span>
  );
}
