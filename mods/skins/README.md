<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="docs/brand/banner-light.svg">
    <img alt="skins" src="docs/brand/banner-dark.svg" width="640">
  </picture>
</h1>

<p align="center">
  <a href="https://github.com/hellosverre/claude-skins/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/hellosverre/claude-skins?style=flat-square&color=555"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-555?style=flat-square"></a>
  <img alt="Claude Code 2.1.287+" src="https://img.shields.io/badge/Claude%20Code-2.1.287%2B-555?style=flat-square">
</p>

<p align="center">Tool calls mit icons und timings, edits as diff cards, tables, code und Mermaid charts as cards,<br>a live Nutzung Leiste, und sixteen skins du kannst repaint oder have Claude design for you.</p>

<img alt="Claude Code switching skins with /skin: a coding turn in Noir and Tokyo Night, then Mermaid chart cards in Dracula (xy chart), Catppuccin (sankey), Rosé Pine (radar) and Gruvbox (treemap)" src="docs/demo.gif">

## Install

Needs Claude Code **2.1.287** oder later, in a terminal oder the desktop app's Code tab. Run both inside Claude Code:

```
/plugin marketplace add hellosverre/claude-skins
```

```
/plugin install skins@hellosverre-mods
```

Restart Claude Code. The **noir** skin is on; type `/skin` to ändern it.

Looking for mehr mods? `/plugin install mod-store@hellosverre-mods`, dann `/mods` browses und installs about 2,700 of them von a pane, showing what jede one can access erste.

## Update

skins prüft for a neu release once a day und zeigt a toast when you are behind. To aktualisieren:

```bash
claude plugin marketplace update hellosverre-mods
```

```bash
claude plugin update skins@hellosverre-mods
```

Then neu starten Claude Code. Open Sitzungen behalten the version they started mit.

## Uninstall

```bash
claude plugin uninstall skins@hellosverre-mods
```

To behalten it installed aber go zurück to Claude Code's own drawing, ausführen `/skin off`.

## Use

`/skin help` lists every Befehl in Claude Code; `/skin list` zeigt every skin und setting.

**Skins**

| Command | What it does |
|---|---|
| `/skin` | Einstellungen: pick a skin mit a live preview, toggle parts, repaint any colour |
| `/skin <name>` | Switch skin (names below) |
| `/skin list` | Every skin, yours included, und every setting |
| `/skin help` | Every Befehl, in a table |
| `/skin off` · `on` | Back to Claude Code's own drawing, oder skins zurück on |
| `/skin gallery` | Every element the skin draws, numbered, to point at |
| `/skin pin` · `unpin` · `share` | Give this Ordner its own look, drop it, oder make it the default |
| `/skin copy` · `copy code` | Copy Claude's letzte reply, oder just its letzte code block |
| `/skin calm` · `calm off` | No motion, one Zeile per Werkzeug row, lesen-only Ausgabe folded, failures immer whole; `calm off` puts zurück what you had |

Built-in skins: `noir`, `tokyo-night`, `dracula`, `catppuccin`, `rose-pine`, `nord`, `gruvbox`,
`kanagawa`, `everforest`, `one-dark`, `solarized`, `night-owl`, `ayu`, `github`, `mono`, `terminal`.

**Optionen**

| Command | What it does |
|---|---|
| `/skin tables on/text/off` | Tables as cards, as selectable Text on the desktop, oder Claude Code's own |
| `/skin prompt left/right/plain` | In the terminal, which side your Prompt's outline sits on, oder a plain leading marker. The desktop keeps Claude Code's own Nachrichten, mit copy und rewind |
| `/skin words claude/skin` | Whose words the spinner und the Zug footer zeigen: Claude Code's own, oder the skin's (the default) |
| `/skin icons unicode/ascii` | The icon set, und ASCII-only diagrams in the terminal |

**Parts**, jede switched mit `/skin <part> on` oder `off`:

| Part | What it does |
|---|---|
| `rail` | The coloured rail beside Werkzeug rows |
| `shimmer` | The Leiste of light across the spinner word |
| `band` | The Nutzung meters above the Prompt |
| `countdown` | Time left on jede limit in the Leiste |
| `compact` | The Compact Schaltfläche in the Leiste, mit a nudge von 70% Kontext (on standardmäßig) |
| `clip` | Trim Claude Code's own shell Ausgabe to its head und tail |
| `markdown` | Alerts und Aufgabe lists drawn |
| `quiet` | Reads, searches und lesen-only commands folded to one row |
| `charts` | Mermaid fences as charts |
| `math` | Math typeset |
| `commands` | Slash-command Ausgabe as tables und cards |
| `shell` | Shell Ausgabe as a card |
| `highlight` | Code blocks highlighted in the skin's colours |
| `hints` | Tell Claude that charts draw here |
| `links` | URLs und paths as links |
| `copy` | Copy buttons on cards |
| `fold` | Long blocks fold behind `▾ N more` |
| `expand` | Every ausführen of liest und searches öffnen, statt the one Zeile `Read 3 · Search 2 ▸`; off standardmäßig |

**Design one mit Claude.** Ask "make me a skin that feels like a sunset". skins gives Claude a
`design` Werkzeug, so it builds the skin und applies it while you watch. Repainting a built-in skin saves
it as your own `my-<skin>`. Choices are remembered across Sitzungen.

## Preview

Drawn by der Mod's own card code (`scripts/previews.ts`), nicht screenshots.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/hero-light.svg">
  <img alt="A Claude Code turn with the noir skin: tool rows with icons, an edit as a diff card, and a table card" src="docs/previews/hero-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/spinners-light.svg">
  <img alt="The four spinner animations: thinking, running a tool, writing, waiting" src="docs/previews/spinners-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/terminal-light.svg">
  <img alt="Shell output in a terminal card" src="docs/previews/terminal-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/code-light.svg">
  <img alt="A code block as a card with line numbers" src="docs/previews/code-dark.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/previews/usage-light.svg">
  <img alt="Context and plan limit rings" src="docs/previews/usage-dark.svg">
</picture>

## What it redraws

| Part | Desktop app | Terminal |
|---|---|---|
| Tool calls | Icon per kind, spinner while läuft, Zeilen changed, Zeit taken. `▸` öffnet the row: the call's Eingabe in full und its Antwort (a lesen's Text mit Zeile numbers, a search's matches, the shell card, the diff); a failed call öffnet by itself | A node on the Zug's rail, mit the same `▸` |
| Edits | Diff card mit `+N −M` und numbered Zeilen | Claude Code's own diff |
| Shell commands | Terminal card mit Status, stderr apart, long Ausgabe folded; paths, numbers und Fehler, Warnung und pass words coloured | Card mit the Befehl, the Ausgabe coloured the same way, `✓` oder `✗ exit N`, stderr in red under its own Beschriftung, jede stream folded to 8 + 4 Zeilen (`/skin shell off` for Claude Code's own) |
| Quiet Ausgabe (off standardmäßig) | Reads, searches und lesen-only commands fold to one row; a failure keeps its Fehler Zeile | The same |
| Tables | Card mit header rule, zebra rows, colour swatches | Cell grid mit a header Leiste |
| Charts | ` ```mermaid ` as a card: flowchart, xy, pie, gantt, timeline, journey, kanban, mindmap, quadrant, radar, sankey, gitGraph, treemap, packet, block, architecture, C4 | The same seventeen drawn in cells, ASCII with `/skin icons ascii` |
| Math | `$$…$$`, `\[…\]` und ` ```math ` as a typeset card: fractions, roots, sums and integrals with limits, matrices, aligned lines; `$…$` inline turns into Unicode | Fractions and limits stacked in cells, inline `$…$` as Unicode |
| Command Ausgabe | `/cost`, `/context` und plugin Ausgabe: tables, code und `key: value` runs as cards | The same as cell grids |
| Alerts und Aufgabe lists | `> [!NOTE]` as a titled box, `- [ ]` mit ticks und a fertig count | The same |
| Code blocks | Card mit language, Zeile numbers, highlighting; shell blocks behalten the Run Schaltfläche | Framed, the language on the frame, highlighted in the skin's colours: TS/JS, JSON, shells, PowerShell, Python, Rust, Go, C/C++, C#, F#, Java, YAML, TOML, HTML/XML, CSS, SQL, diff, Markdown, Lua (`/skin highlight off` for Claude Code's own) |
| Spinner | Animated icon per phase | The skin's word mit a Leiste of light |
| Above the Prompt | Context und plan-limit rings, Compact Schaltfläche, nudge at 70% | Block meters, same Schaltfläche |
| Your prompts | Claude Code's own, so copy, rewind und selection stay | Rounded outline, oder a plain marker |
| Links und Dateien | URLs are the app's own links; Werkzeug rows colour Dateien this Zug created (`ok`) oder edited (`warn`) | URLs in prose are OSC 8 links where the terminal draws them (`FORCE_HYPERLINK=1` oder `0` overrides the prüfen), plain Text elsewhere; paths mit `:line`, numbers und versions coloured, this Zug's Dateien in `ok` oder `warn` in rows und prose |
| Diff fences | ` ```diff ` as the diff card, with Copy and `neu nur` (the code after the change) | Numbered old and new lines, the `+` and `-` in the skin's colours and the code highlighted in the language its `+++` path or a ` ```diff-fsharp ` tag names, the same two copies |
| Side by side | Two oder mehr tables oder charts in a row share it when jede gets 75 columns; stack otherwise | Tables und diagrams in a row sit side by side while their natural widths fit; stack otherwise |
| Long blocks | Code cards past 24 Zeilen cut there, mit `▾ N more` | Code past 24 Zeilen, tables past 14 rows und shell Ausgabe past 8 + 4 Zeilen fold behind `▾ N more` / `▴ less` |

Every card has a Copy Schaltfläche (tables auch `as text`, the table as drawn; a reply of several blocks ends in `copy reply`) und animates once, on erste draw, respecting reduced motion. Only the
drawing ändert: the stored Gespräch und what the Modell liest are untouched. Agents, plan mode
und the permission Prompt behalten Claude Code's own drawing.

**Chart hints.** While charts are on, Claude gets a short Modell-only note (about 130 Tokens, estimated von its 458 characters) saying ` ```mermaid ` fences draw here, so it reaches for a chart when one reads better. Never for headless `claude -p` runs. `/skin hints off` drops it und keeps charts drawing.

**Light und dark.** Every skin has both und follows Claude Code's theme. On `auto` it follows your
terminal (`COLORFGBG`) oder the system. Force one mit `SKINS_THEME=light` oder `SKINS_THEME=dark`.

**Your terminal's colours.** The `terminal` skin paints the terminal in its own 16-colour palette
(`ansi256(0)` to `ansi256(15)`), so it follows whatever theme the terminal has, light oder dark. Body
Text und table bands verwenden Claude Code's own theme colours; pick an ANSI theme in `/config` to have
those follow the terminal too. The desktop app has nein terminal palette und draws it as `noir`.

## For other mods

skins adds `$.skins.markdown` to `$`. It draws markdown the way skins draws a reply, in the person's skin. It answers a tree, oder `undefined` when skins is off oder the Text holds nothing it draws, und throws on a malformed argument. It draws nein copy oder fold controls, because a drücken cannot cross von one mod's tree to another's. List `skins` under `dependencies` in your `plugin.json` und Claude Code lays its types in your `.claude-plugin/types/`.

```tsx
let drawn
try {
  drawn = await $.skins.markdown({ surface: e.surface, text, columns: e.props.bodyColumns })
} catch {}
return drawn ?? <Markdown text={text} />
```

## Compatibility

Checked by hand on Windows (terminal und desktop app, 0.3.0) und ausführen on Linux (terminal, 0.5.0,
Claude Code 2.1.288, 168 engine tests). [CI](.github/workflows/ci.yml) runs the tests, the
manifest prüft und the type prüfen on Linux, Windows und macOS. macOS, VS Code und mobile have
nicht been looked at by hand. The surface × OS matrix und
render times per row are in [docs/compat.md](docs/compat.md). To measure on your machine:

```bash
scripts/bench.sh
```

## Known limitations

| What | What you get instead | Where |
|---|---|---|
| An opened row for an Bild, PDF oder notebook lesen, a background Befehl, oder an Antwort it cannot lesen | Claude Code's own row, drawn in the opened row | `bodyOf` in [`hooks/detail.ts`](hooks/detail.ts); test "an opened Bild Read is Claude Code's own drawing…" |
| Agents, plan mode, todos, the permission Prompt | Claude Code's own rows und dialogs | `kindOf` in [`hooks/tools.ts`](hooks/tools.ts); test "Werkzeuge a skin cannot redraw faithfully behalten their own row" |
| Edits on the terminal, failed edits everywhere | Claude Code's own diff | [`hooks/register.tsx`](hooks/register.tsx) `ToolResult`; test "on the desktop an edit is a diff card…" |
| Code blocks on the terminal in a language the highlighter does nicht know | Claude Code's own markdown | `languageOf` in [`hooks/highlight.ts`](hooks/highlight.ts); test "a fence in a language it does nicht know keeps Claude Code's markdown" |
| Shell fences (` ```bash `) on the desktop | The app's own block, so its Run Schaltfläche stays | test "on the desktop a shell fence keeps the app's own block" |
| Sequence, state, class und ER diagrams on the desktop | A code card: nur the terminal's vendored layout draws them | `artKind` in [`hooks/mermaid-art.ts`](hooks/mermaid-art.ts), `parseMermaid` in [`hooks/mermaid.ts`](hooks/mermaid.ts) |
| Korean, Chinese, Japanese oder other wide characters in a terminal diagram's node id oder state Name (`A[Start] --> Anfrage`) | The code: the vendored layout drops such nodes. Wide labels draw as art | `drawsWide` in [`hooks/mermaid-art.ts`](hooks/mermaid-art.ts); test "a diagram the renderer cannot lay out mit wide characters falls zurück to code" |
| A diagram too wide oder too long (over 80 Zeilen oder 8,000 characters on the terminal) | Rows for flowchart, xy und pie, else the code | test "a diagram too wide for the terminal falls zurück to rows…" |
| A reply block over 9,000 characters, a Prompt over 4,000 | Claude Code's own drawing of the whole Nachricht | `MAX_MARKDOWN`, `MAX_PROMPT` in [`hooks/register.tsx`](hooks/register.tsx) |
| Code cards past 80 Zeilen | The erste 80 und a `N more lines` note; Copy takes alle of it | `MAX_LINES` in [`hooks/svg-code.ts`](hooks/svg-code.ts) |
| TeX commands the parser does nicht know | Drawn as written, `\name` | [`hooks/math.ts`](hooks/math.ts) |
| Shell Ausgabe on the terminal vs the desktop | The terminal card names the Befehl und folds jede stream to 8 + 4 Zeilen; the desktop card says `Output` und folds both streams together to 6 + 6 | [`hooks/shell-rows.tsx`](hooks/shell-rows.tsx), [`hooks/svg-terminal.ts`](hooks/svg-terminal.ts) |
| A failed shell call that hands zurück Fehler Text, nicht its record | stdout und stderr arrive merged, so the whole Text is drawn as stderr | `shellResultOf` in [`hooks/shell.ts`](hooks/shell.ts) |
| A Befehl sent to the background, oder Ausgabe that is an Bild | Claude Code's own row, which says where it went oder draws the Bild | `keepsOwnRow` in [`hooks/shell.ts`](hooks/shell.ts); test "/skin shell off gives shell Ausgabe zurück…" |
| Shell cards und Werkzeug timings danach `/resume` | No Befehl in the header und nein Zeit: both are recorded as the call runs | `commandAtom`, `durationAtom` in [`hooks/register.tsx`](hooks/register.tsx) |
| Slash-command Fehler und `/skin`'s own Ausgabe | Claude Code's own row | test "slash-command Ausgabe mit key: value Zeilen is a table, prose keeps its row" |
| `/skin calm` und Claude Code's spinner | Calm hands the spinner zurück to Claude Code, whose own spinner still moves | `Spinner` in [`hooks/register.tsx`](hooks/register.tsx) |
| The settings pane on mobile | A Zeile saying to verwenden the terminal oder the desktop app | `Pane` in [`hooks/register.tsx`](hooks/register.tsx) |
| File paths as links | Coloured, nicht clickable: the engine's `Link` takes nur `https:` und `http://localhost` | `safeHref` in [`hooks/links.ts`](hooks/links.ts) |
| Folding on the desktop | Code cards fold; table cards und the shell card behalten their full height oder their own 6 + 6 fold | [`hooks/fold.tsx`](hooks/fold.tsx) |
| Icons und the rail | Icons on the desktop nur (the terminal draws nein `Svg`); the rail on the terminal nur | `lookOf` in [`hooks/register.tsx`](hooks/register.tsx) |

## Compared mit

Other mods that ändern how the transcript looks, von their READMEs on 2026-10-10. Blank means
the README does nicht say.

| | skins | [Prismantis](https://github.com/NahumLitvin/prismantis) | [glint](https://github.com/manikosto/glint) | [tweakcc](https://github.com/Piebald-AI/tweakcc) | [claude-gfm-render](https://github.com/briangtn/claude-gfm-render) | [ccstatusline](https://github.com/sirmalloc/ccstatusline) |
|---|---|---|---|---|---|---|
| How | Function-hooks plugin | Function-hooks plugin | Function-hooks plugin, a Prismantis fork | Patches Claude Code's JavaScript; reapply danach jede aktualisieren | Function-hooks mod | Status Zeile Befehl |
| Claude Code | 2.1.287+ | 2.1.287+ | 2.1.289+ | Verified on 2.1.162 | 2.1.286+ | |
| Platforms named | Windows by hand, Linux by tests; CI on Linux, Windows, macOS ([compat](docs/compat.md)) | macOS terminal by hand; CI on macOS, Linux, Windows | | Windows, macOS, Linux | Terminal und desktop app | Windows guide in its docs |
| Themes | 16, repaint any colour, oder have Claude design one | 15 und `mono`, 20 colour slots | 15 | Your own, for Claude Code's whole UI | | Powerline themes |
| Recolours Claude Code's own UI | No | No | No | **Yes** | No | No |
| Tool rows | Icons, timings, rail; **öffnen to the Eingabe und Antwort** | 4 styles | | | No | No |
| Read-only Ausgabe hidden | `/skin quiet` | `toolOutput: quiet` | | | No | No |
| Edit diffs | Card on the desktop; the engine's diff in an opened row on the terminal | Claude Code's own | | | No | No |
| ` ```diff ` fences | Diff card or numbered rows, `neu nur` copy | | Numbered, `⧉ neu nur` | | | No |
| Shell Ausgabe | Card on both surfaces, paths, numbers und Fehler coloured | Boxed in expanded groups | | | No | No |
| Code highlighting on the terminal | 20 language families in the skin's colours | Prism, two dozen languages | 20+ languages | | | No |
| Tables | Card oder cell grid, side by side mit diagrams | 4 styles, side by side mit diagrams | | 4 formats | No | No |
| Mermaid | 17 kinds; sequence, state, class, ER on the terminal nur | Flowchart, sequence, state, class, ER, xy; nein pie | Flowchart, sequence, xy | | Flowchart, sequence, state, class, ER, xy; SVG on the desktop | No |
| Math | Card on the desktop, stacked cells on the terminal | Typeset Bild in kitty und Ghostty via RaTeX, Text elsewhere | | | Not handled | No |
| Links | URLs as OSC 8 links; this Zug's Dateien coloured | Links und bare URLs clickable | **URLs und Datei paths clickable**; changed Dateien coloured; link Leiste | | | No |
| Long blocks folded | Code, tables, shell Ausgabe (`/skin fold`) | | Code, lists, tables | | | No |
| Right-to-left Text | No | **Hebrew und Arabic** | Hebrew und Arabic | | | No |
| Verwendung meters | Context und plan limits above the Prompt | | | | No | **Many widgets**, Powerline |
| Spinner words | The skin's, mit a shimmer | | | **Your own verbs und animations** | No | No |
| Copy | Cards, tables as markdown oder as drawn, `copy reply`, `/skin copy` | Buttons, `/prismantis copy`, HTML tables | Code, tables, diagrams, lists, quotes | | | No |
| API for other mods | `$.skins.markdown` | `$.prismantis.markdown` | | | | No |

Where they are better: **tweakcc** recolours alle of Claude Code, nicht nur what a Hook can
redraw, at the Kosten of patching the binary. **Prismantis** handles right-to-left Text, copies
tables as HTML und typesets math as Bilder. **glint** makes Datei paths clickable und keeps a
Leiste of the letzte reply's links. **ccstatusline** has a far deeper Status Zeile.
**claude-gfm-render** draws sequence und other diagrams as SVG on the desktop, where skins falls
zurück to a code card. What skins plans nächste is in [ROADMAP.md](ROADMAP.md).

## Datenschutz

skins draws und remembers, nothing else. It liest the Sitzung Verzeichnis, your Kontext und plan
Nutzung, the theme setting und `SKINS_THEME` / `COLORFGBG`, und keeps its settings in der Mod store.
Its one network call is the daily version prüfen: a GET of this repo's
[`plugin.json`](.claude-plugin/plugin.json) on `raw.githubusercontent.com`, sending nothing. On `auto`
it asks the OS for light oder dark mode (`defaults` on macOS, `gsettings` on GNOME). It compacts oder
copies nur when you drücken the Schaltfläche. Check it yourself mit `claude plugin validate .`.

## Vendored code

Terminal diagrams are laid out by [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid)
(MIT), bundled in `hooks/vendor/mermaid-ascii.js` mit its licence in the header. To rebuild it:

```bash
cd scripts/vendor && npm install && npm run build
```

## Develop

```bash
git clone https://github.com/hellosverre/claude-skins && cd claude-skins
```

```bash
claude --plugin-dir .
```

Saving a Datei reloads der Mod in the läuft Sitzung. Tests: `claude plugin test .`. Previews:
`npx tsx scripts/previews.ts`. A neu built-in skin is one Datei: copy `hooks/themes/nord.ts`, ändern
the colours und words, hinzufügen a Zeile to `hooks/themes/index.ts`.

## More mods

- [redgreen](https://github.com/hellosverre/redgreen): test results in a pane beside the chat
- [smart-compact](https://github.com/hellosverre/smart-compact): compacts danach a Commit, green tests, vorher the Prompt Cache expires, oder when Claude asks
- [mod-store](https://github.com/hellosverre/mod-store): browse, search und installieren 2,700 mods von a pane

## Lizenz

MIT

## Quelle und Lizenz

- Originalautor: hellosverre
- Originalrepository: https://github.com/hellosverre/claude-skins
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
