import { NextResponse, type NextRequest } from "next/server";

/**
 * Multi-tenancy via subdomæne + Host-header-routing (CLAUDE.md §4, template §4.1).
 *
 * `{slug}.{ROOT_DOMAIN}` udpeger en tenant:
 *   - workspace/auth/API-stier passerer uændret (hele værktøjet virker også på
 *     subdomænet; tenant udledes af sessionen — aldrig af URL'en)
 *   - alt andet rewrites internt til kundefladen `/bestil/{slug}`
 *
 * På roddomænet (og localhost) sker ingen rewrite → det offentlige site.
 *
 * VIGTIGT (template §7): reverse-proxyen SKAL bevare den oprindelige Host-header.
 * Sæt ALDRIG en Host-override, ellers kollapser alle subdomæner til én tenant.
 */

// Stier der hører til workspacet/delt infra og aldrig må omskrives til kundefladen.
const WORKSPACE_PREFIXES = ["/system", "/login", "/api", "/_next"];

function slugFraHost(host: string | null): string | null {
  if (!host) return null;
  const vaert = host.split(":")[0].toLowerCase();
  const rod = (process.env.ROOT_DOMAIN ?? "").toLowerCase();
  if (!rod || vaert === rod || vaert === `www.${rod}`) return null;
  if (vaert.endsWith(`.${rod}`)) {
    return vaert.slice(0, -(rod.length + 1)).split(".")[0] || null;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const slug = slugFraHost(req.headers.get("host"));
  if (!slug) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (WORKSPACE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Kundeflade: rewrite til /bestil/{slug}{resten}
  const url = req.nextUrl.clone();
  url.pathname = `/bestil/${slug}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Kør på alt undtagen statiske filer.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
