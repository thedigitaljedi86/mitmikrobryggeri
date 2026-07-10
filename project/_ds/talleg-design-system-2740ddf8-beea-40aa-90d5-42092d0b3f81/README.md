# Talværkstedet — Design System ⚙️

**Talværkstedet** ("the Number Workshop") is a warm, Danish-language math game for children **~8–9 years old (0.–3. klasse)**. It runs as a single-page web app with no backend — progress is saved locally in the browser (`localStorage`, key `talvaerkstedet-save-v2`).

**The story / gamification:** the child helps a little **robot/machine** get repaired. Solving math problems earns **stars ⭐**, which both unlock new minigames *and* repair the machine's **5 gears (tandhjul)**. Correct answers are celebrated with confetti, a jubilation card and encouraging Danish text that addresses the child by name.

**Tone of voice:** warm, encouraging, playful and simple. Danish. **Never punishing** on mistakes — wrong answers get a gentle explanation and another try.

This repository is the **design system**: visual foundations, brand assets, reusable CSS tokens, and a high-fidelity UI kit for the app.

---

## ⚠️ Sources & provenance

This system was built from a **design-system description document** (`DESIGN-SYSTEM.md`) that was itself *generated from the product source code* (`index.html`, `style.css`, `script.js`). 

**I did not have direct access to the source code or a Figma file** — only the derived description. So:

- Tokens (colors, shadows, radii, type scale, spacing) are transcribed **verbatim** from that document's token tables and should be accurate.
- **Fonts:** the product source uses a system stack (`'Segoe UI', 'Arial Rounded MT Bold', Arial`). At your request the design system now hosts a **playful rounded webfont pair — Baloo 2 + Nunito** — as a flagged substitution for a consistent, friendly look across platforms. Swap back / to brand fonts as needed.
- **Logo & mascot are originals.** No real artwork was provided. `logo-mark.svg` is a geometric gear mark; `mascot-placeholder.svg` ("Verkis") is a clearly-flagged placeholder robot. Replace with real artwork.
- The UI kit recreates components from the **written description**, not pixel-measured source — see its caveat.

> **To make the UI kit pixel-perfect, please attach `index.html`, `style.css` and `script.js`** via the Import menu.

---

## CONTENT FUNDAMENTALS — how Talværkstedet talks

Audience: Danish children ~8–9 (and grown-ups in any parent/help text). All copy is **Danish**.

- **Address:** speak directly to the child with informal **"du"**, and by name where possible: *"Godt klaret, Emil!"*
- **Casing:** sentence case. UPPERCASE reserved for tiny labels only.
- **Tone:** warm, encouraging, playful, short. Celebrate effort.
- **Never harsh on errors.** Wrong = a gentle hint + a new chance: *"Ikke helt — prøv igen!"*, *"Du er tæt på!"* — never a bare *"Forkert!"* or a red stop sign.
- **Length:** very short. One friendly instruction line; buttons are 1–3 words: *Spil! · Tjek svar · Næste opgave · Videre!*
- **Numbers are the content.** Most "copy" is digits, operators and short instructions like *"Hvor mange er der i alt?"*
- **Emoji are part of the voice** (see ICONOGRAPHY) — minigames, stars and celebrations all speak in emoji.
- **Examples:**
  - Onboarding: *"Hvad hedder du?"* → **"Spil!"**
  - Correct: *"Rigtigt! 🎉"*, *"Godt klaret!"*, *"Sådan!"*
  - Try again: *"Ikke helt — prøv igen!"*, *"Tæt på! Læg først enerne sammen."*
  - Unlock: *"Lås op ved 40 ⭐"*
  - Machine status: *"3 af 5 tandhjul repareret!"*

---

## VISUAL FOUNDATIONS

Feeling: a friendly **workshop / machine** — rounded, soft, bright, tactile. Colour carries meaning.

### Color (meaning is fixed)
- **Background** is warm cream `--bg #FFF8EC`; cards/panels/buttons are white `--card-bg #FFFFFF`.
- **Blue `#4A90E2` = primary** — action, navigation, titles, active tabs. Hover/active → `--blue-dark #2D6DB8`.
- **Green `#5CB85C` = success/confirm/correct.** Hover → `#3F8F3F`.
- **Yellow `#F5A623` = stars, highlight, gentle "try again" feedback.**
- **Orange `#E8661A` = soft wrong answer** (never red) and the *ones* place value.
- **Purple `#7B61FF` = active/selected choice, totals, thousands.**
- **Pink `#E91E8C` = sparse accent. Red `#E74C3C` = reserved warning (rare).**
- **Place-value coding (fixed):** thousands = purple, hundreds = green, tens = blue, ones = orange. Reused across "Byg tal", "Byg 1000-tal" and "Plads-regn".
- Text `--text #2C2C2C`, secondary `--text-light #777`, hairlines `--border #E0D5C5`.

### Type
- **Baloo 2** (hosted) for titles, equations, numbers and button labels — chunky, rounded, playful.
- **Nunito** (hosted) for body, feedback and labels — rounded and highly legible.
- Large scale (touch UI for kids): equations 2–3rem / 800 with **2px letter-spacing** to separate digits; page title 1.55rem; celebration 1.6–1.9rem; instruction 1.2rem; body 1.0–1.1rem; labels 0.72–0.9rem. Mobile breakpoint scales these down at 480px.

### Spacing & layout
- Centered content **container max-width 680px**, side padding 14px.
- Component gaps 8–14px. A formal 4/8 spacing scale is provided in tokens (DS recommendation).
- Big, klikbare hit targets — primary controls ~36–68px. Mobile-first at the 480px breakpoint (grids collapse 3→1–2 columns).

### Corner radii & shape
- `--radius 20px` for large cards/panels, `--radius-sm 12px` for buttons/fields, `50%` for circular elements (icon buttons, gears, blocks), `999px` for pills/chips. Nothing sharp.

### Shadows & elevation
- One standard card shadow `--shadow: 0 4px 18px rgba(0,0,0,.10)`; a lighter `--shadow-sm` for chips. Soft, diffuse — no glassmorphism, no heavy blur.

### Borders
- Answer buttons (`.arith-btn`) use a **3px solid border** that turns green (correct) or orange (wrong); selected choices turn purple. Locked tabs use a **dashed** border. Hairline `--border` divides neutral content.

### Backgrounds & texture
- Flat warm color fields. No photographic imagery, no big gradients (the unlock card's yellow→ and progress bar's orange→red gradients are the rare exceptions).

### Animation & motion (library)
Short, playful easings, typically 0.1–0.45s. Animations confirm an action or celebrate success — never attention-seeking loops (except gentle idle bounces).

| Keyframe | Purpose |
|---|---|
| `gear-spin` | repaired gears + name-screen gear rotate |
| `gear-pop` / `just-repaired` | a gear "pops" the moment it's repaired |
| `confetti-fall` | confetti falls & rotates on success |
| `pop-in` | modals / cards appear |
| `slide-up` | feedback box slides in |
| `wiggle` | celebration emoji wiggles |
| `block-pop` | place-value block appears |
| `total-bounce` | running total bounces when correct |
| `frog-bounce` | frog on the number line |
| `fade-in` / `fade-out` | overlays + name screen |

- **Press / hover:** buttons lift `translateY(-2/-3px)` on hover, return on `:active`; `:disabled` is dimmed (opacity).

### Cards
- White, `--radius` (20px), `--shadow`, comfortable padding. Feedback box adds a colored left edge; celebration uses a `pop-in` modal over a soft scrim.

---

## ICONOGRAPHY

Talværkstedet's icon system **is emoji** — there is no icon font and no SVG icon set in the product.

- **Minigames** are each an emoji + name: 📏 Tallinje · 🧱 Byg tal · 🐸 Regnehop · 🔢 Regnestykker · ✖️ Gangeværk · ➗ Delestykker · 🧭 Tal-labyrint · 🏗️ Byg 1000-tal · 🧲 Plads-regn.
- **Brand / rewards:** ⚙️ (gears/machine), ⭐ (stars), 🎉 (celebration), 💡 (hint), 🐸 (number-line marker).
- **Controls use unicode glyphs:** `?` (help), `↺` (restart), `+` / `−` (counters), `✓` / `✗` (check/wrong), arrows `→`.
- **Confetti** is small colored rectangles (CSS), not emoji.
- Render emoji at large sizes; keep them as the platform's native emoji (don't recolor). Use brand colors for glyph buttons and gear graphics instead.
- The **logo mark** (`assets/logo-mark.svg`) is a blue gear with a star spark — pair with the "Talværkstedet" wordmark (lockup in `preview/logo.html`).

---

## VISUAL ASSETS (`assets/`)

| File | What it is |
|---|---|
| `logo-mark.svg` | Geometric blue gear mark + star spark. Font-free. |
| `mascot-placeholder.svg` | **Placeholder** robot "Verkis". Replace with real artwork. |

Emoji come from the platform; no icon files are stored.

---

## INDEX — what's in this folder

| Path | Purpose |
|---|---|
| `README.md` | This file. |
| `colors_and_type.css` | All design tokens: raw + semantic colors, place-value coding, fonts, type scale, radii, spacing, shadows, motion. **Import this in everything.** |
| `SKILL.md` | Agent-Skills-compatible entry point. |
| `assets/` | Gear logo mark + placeholder robot mascot. |
| `preview/` | 20 Design-System spec cards (Type, Colors, Spacing, Components, Brand). |
| `ui_kits/talvaerkstedet-app/` | High-fidelity, interactive UI kit for the app (see its own README). |

### UI kits
- **`ui_kits/talvaerkstedet-app/`** — name screen → main workshop (header with stars, machine + 5 gears, minigame tabs), an interactive **Regnestykker** arithmetic round and **Tallinje** number-line game, feedback box, celebration + confetti.

*No slide template was provided, so no `slides/` folder was created.*
