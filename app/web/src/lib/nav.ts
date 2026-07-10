import type { NavItem } from "@/components/ui";

/* Bundnavigation pr. app-flade. active = som er markeret. */

export function brewerNav(active: "hjem" | "bryg" | "lager" | "salg"): NavItem[] {
  return [
    { label: "HJEM", href: "/system", active: active === "hjem" },
    { label: "BRYG", href: "/system/brygninger", active: active === "bryg" },
    { label: "LAGER", href: "/system/lager", active: active === "lager" },
    { label: "SALG", href: "/system/salg", active: active === "salg" },
  ];
}

export function customerNav(active: "oel" | "events" | "bestillinger" | "profil"): NavItem[] {
  return [
    { label: "ØL", href: "/bestil/enghave", active: active === "oel" },
    { label: "EVENTS", active: active === "events" },
    { label: "BESTILLINGER", active: active === "bestillinger" },
    { label: "PROFIL", active: active === "profil" },
  ];
}

export function publicNav(active: "kort" | "liste" | "events" | "profil"): NavItem[] {
  return [
    { label: "KORT", href: "/kort", active: active === "kort" },
    { label: "LISTE", active: active === "liste" },
    { label: "EVENTS", active: active === "events" },
    { label: "PROFIL", active: active === "profil" },
  ];
}
