import { Label, Screen, Tilbage } from "@/components/ui";
import { FeltRow, LinjeRow } from "@/components/rows";

/* 09 · Bryggeri — profil, adresse, CVR, åbningstider, tanke */
export default function BryggeriIndst() {
  return (
    <Screen>
      <div className="flex flex-col gap-[6px] px-6">
        <Tilbage href="/system/indstillinger">Indstillinger</Tilbage>
        <span className="font-display" style={{ fontSize: 34, lineHeight: 1.3 }}>
          Bryggeri
        </span>
      </div>

      <Label className="mx-6 mt-5">PROFIL</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <FeltRow etiket="NAVN" vaerdi="Bryghuset Enghave" />
        <FeltRow etiket="ADRESSE" vaerdi="Enghavevej 41, 2450 København SV" />
        <FeltRow etiket="CVR" vaerdi="41 88 23 07" sidste />
      </div>

      <Label className="mx-6 mt-5">ÅBNINGSTIDER · TAPROOM</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <LinjeRow venstre="Torsdag" hoejre="16–21" minH={48} />
        <LinjeRow venstre="Fredag" hoejre="14–22" minH={48} />
        <LinjeRow venstre="Lørdag" hoejre="12–22" minH={48} />
        <LinjeRow venstre="Søn–ons" hoejre="Lukket" minH={48} daempet sidste />
      </div>

      <Label className="mx-6 mt-5">TANKE &amp; KAPACITET</Label>
      <div className="kort mx-6 mt-[10px] px-5 py-1">
        <Tank navn="Tank 1" spec="500 L · gæringstank" pille="LEDIG" pilleKlasse="pille-succes" />
        <Tank navn="Tank 2" spec="500 L · gæringstank" pille="I BRUG" pilleKlasse="pille-accent" />
        <Tank navn="Tank 3" spec="1.000 L · lagertank" pille="I BRUG" pilleKlasse="pille-accent" sidste />
      </div>

      <div className="btn btn-sekundaer mx-6 mb-8 mt-3">+ Tilføj tank</div>
    </Screen>
  );
}

function Tank({
  navn,
  spec,
  pille,
  pilleKlasse,
  sidste = false,
}: {
  navn: string;
  spec: string;
  pille: string;
  pilleKlasse: string;
  sidste?: boolean;
}) {
  return (
    <div
      className="flex min-h-[52px] items-center gap-3"
      style={{ borderBottom: sidste ? undefined : "1px solid var(--kant-svag)" }}
    >
      <span className="text-[15px] font-semibold">{navn}</span>
      <span className="text-[13px] text-tekst-daempet">{spec}</span>
      <span className={`pille ${pilleKlasse} ml-auto`}>{pille}</span>
    </div>
  );
}
