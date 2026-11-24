# Flightdeck

[![Release](https://img.shields.io/github/v/release/scasella/claude-flightdeck)](https://github.com/scasella/claude-flightdeck/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code 2.1.289+](https://img.shields.io/badge/Claude%20Code-2.1.289%2B%20mod-d97757.svg)](https://claude.com/blog/claude-code-mods)
[![Listed on statuslin.es](https://img.shields.io/badge/listed%20on-statuslin.es-c96442)](https://statuslin.es/mods/flightdeck)

**A Claude Code mod that puts a live Agent Dashboard in your terminal**: Kontext und Kosten, an advisor timeline, every permission prüfen, und your Subagenten as cards oder swimlanes. Every number comes von a real Sitzung event, und nothing leaves your machine.

<p align="center">
  <img src="docs/media/demo.gif" alt="Flightdeck during a live session: five audit subagents fan out as cards, switch to swimlanes and finish, while the permission gate fills with checks" width="520">
</p>

<p align="center">
  <a href="#install">Install</a> · <a href="#what-you-see">What you see</a> · <a href="#what-it-can-reach">What it can reach</a> · <a href="#configure">Configure</a> · <a href="#troubleshooting">Fehlerbehebung</a> · <a href="CHANGELOG.md">What's neu</a>
</p>

## Install

Inside Claude Code (2.1.289 oder later):

```
/plugin marketplace add scasella/claude-flightdeck
/plugin install flightdeck@claude-flightdeck
/reload-plugins
/flightdeck
```

<details>
<summary><strong>From the terminal, oder von a clone</strong></summary>

```sh
claude plugin marketplace add scasella/claude-flightdeck
claude plugin install flightdeck@claude-flightdeck
```

Or load it straight von a clone, for one Sitzung:

```sh
git clone https://github.com/scasella/claude-flightdeck
claude --plugin-dir ./claude-flightdeck
```

</details>

The installer may say config options aren't set; the defaults are fine, und [`/config`](#configure) ändert them.

Mods are an early-access Claude Code feature und their API kann ändern between releases. If something breaks, see [Troubleshooting](#troubleshooting).

## What you see

https://github.com/user-attachments/assets/9ad0fcc3-c81c-427a-a743-f7b6c49f5885

<p align="center">
  <img src="docs/media/docked-session.png" alt="Claude Code in fullscreen with the Flightdeck pane docked beside the transcript" width="820">
</p>

| Docked beside the transcript | Inline above the Prompt |
| --- | --- |
| <img src="docs/media/docked-pane.png" alt="The docked pane: main model vitals, architect timeline, permission gate, five agents as swimlanes, last-turn receipt and session log" width="380"> | <img src="docs/media/inline-mini.png" alt="The inline mini layout: the model, context gauge, session cost and architect consults; the permission gate strip and totals; the last turn's duration, agents, edits, errors and cost" width="420"><br><br>On the main screen, ohne fullscreen, the pane is a summary of at most 8 rows; up to 3 Agenten join it when the Sitzung has Subagenten. |

| Panel | Shows | From |
| --- | --- | --- |
| **main** | Modell, effort, permission mode, request count; a Kontext gauge mit compactions (⟲, oder ⟲~ when [estimated](#what-is-inferred-not-measured)), measured against the compaction Fenster when the Sitzung compacts in a smaller one than the Modell's (`autoCompactWindow`, oder Claude Code's own); Kosten und the erste two rate-limit windows when your plan reports them, mit the Zeit to jede zurücksetzen (↻) von 56 columns; the letzte main-loop request's Zeit to erste Token | `turn.step`, `session.measure`, `session.compact`, `$.session.usage()` (at jede main-loop request, und its local `summary` breakdown, once per Modell, for the compaction Fenster); the permission mode von `classic.UserPromptSubmit` und `agent.spawn` |
| **architect** | consults on a timeline, whether one is läuft, how long the letzte took; optionally the moment of jede consult; the erste Zeile of a Subagent architect's advice | a spawn of a matching Agent type, oder a matching Server Werkzeug in the assistant's rows |
| **gate** | one cell per permission prüfen: green allowed ohne asking, blue decided by the automatisch-mode classifier oder you und dann ausführen, amber pending, red ✗ denied, dim if made inside a Subagent. Totals, und a drill-down per Werkzeug family mit credentials masked | `tool.check`, settled by the `tool.call` around it |
| **Agenten** | cards side by side while they fit: the Aufgabe, type, live Kontext und Ausgabe Tokens, steps, a läuft clock, `max_tokens` in red. Beyond that, swimlanes on one Zeit axis | `agent.spawn`, `turn.step`, `tool.call`, `turn.complete` |
| **loops** | Modell loops that match nein card: workflow Agenten, compactions, memory forks | `turn.step` ids nein card claims |
| **receipt** | the läuft Zug, oder the letzte one: duration, Agenten, edits, Fehler, Kosten added | `turn.start`, `turn.complete` |
| **log** | prompts, spawns, completions, consults, edits, Fehler und denials; filtered to one Agent while you view its transcript | alle of the above |

Connectors animate nur while work flows: a Zug is läuft, an Agent is läuft, oder a consult ist öffnen. Panels mit nothing to zeigen take nein room, so a Sitzung ohne Subagenten zeigt just the main box und the log.

## Use

| Command | Does |
| --- | --- |
| `/flightdeck` | öffnen the pane |
| `/flightdeck close` | schließen it |
| `/flightdeck reset` | leeren Agenten, prüft, consults, log und the Zug (Kosten, rate limits und compactions stay) |
| `/flightdeck layout auto\|compact\|wide\|mini` | override the layout for this Sitzung |

Focus the pane mit `ctrl+x tab`, dann:

| Key | Does |
| --- | --- |
| `1`, `2`, … | expand an Agent card oder lane: its full Aufgabe, letzte 3 Werkzeug calls, starten of its Antwort |
| `f` `s` `o` | öffnen the gate's Datei / shell / other drill-down: the letzte 5 prüft und their verdicts |

`/clear` resets the pane along mit the Gespräch.

## Where it runs

- **Fullscreen terminal:** docked beside the transcript; two columns von 110 columns wide.
- **Main-screen terminal:** inline above the Prompt, as the 8-row summary.
- **Desktop app, VS Code, mobile:** the same panels, plus the Agenten drawn as an SVG Zeit axis. VS Code und mobile can't animate, so connectors und clocks are static there. (The VS Code extension may zeigen nein pane at alle yet: see [Troubleshooting](#troubleshooting).)

With `openOnStart`, the pane öffnet by itself when a Sitzung starts, in terminals at least 144 columns wide; below that, `/flightdeck` öffnet it. Colours come von your Claude Code theme, so light, dark und colour-blind themes alle lesen.

## What it can reach

Flightdeck nur watches. Every Hook passes its event on unchanged: it nie denies, rewrites oder delays a Werkzeug call, a Prompt oder a Subagent.

| It sees | Through |
| --- | --- |
| every Werkzeug call's Name und Eingabe, und whether it failed | `tool.call` |
| every permission verdict | `tool.check` |
| Subagent spawns, their Modell requests und Token Nutzung, und their final answers | `agent.spawn`, `turn.step`, `turn.complete` |
| your prompts' erste 70 characters, for the log | `turn.start` |
| Kontext, Kosten und rate-limit readings | `session.measure`, `$.session.usage()` |
| the Kontext breakdown `/context` zeigt (its categories, memory-file paths, MCP Werkzeuge, Agenten und Skills), estimated locally once per Modell; it keeps nur the compaction Fenster von it | `$.session.usage({ breakdown: 'summary' })` |
| advisor Werkzeug calls in the assistant's responses (their content is encrypted) | `session.append` |

What it keeps: short summaries (a Werkzeug Name plus a Pfad oder Befehl, the starten of jede Prompt, an Agent's Aufgabe und Antwort, the architect's advice, alle mit credentials masked) in Sitzung state, which ends mit the Sitzung. It makes **nein** network requests, runs nein processes, liest und schreibt nein Dateien, stores nothing across Sitzungen, und calls nein Modell. `claude plugin validate .` prints exactly what it Hooks und calls.

## What is inferred, nicht measured

- **Architect moments.** "Before a plan" means nein edits yet this Zug, "Fehler repeats" means 2+ main-loop Fehler in a row, "vorher fertig" means edits were made. They are labelled `(inferred)`; Zug them off mit `moments: false`.
- **Compactions under the built-in guard.** Where Claude Code's guard keeps `session.compact` von Flightdeck (see [Troubleshooting](#troubleshooting)), the count is estimated. Claude Code reports nein Kontext fill until the erste response danach a neu Sitzung, a `/clear` oder a compaction. So a main-loop request that finds nein fill danach a response came zurück counts as a compaction. The main box zeigt `⟲~1`, mit `(estimated)` when there's room, und the log says `context compacted (estimated)`. A rewind to your erste Prompt liest the same way, so it counts too. Wherever `session.compact` runs, its count replaces the estimate.
- **Server-side advice is encrypted.** For a Server Werkzeug such as Claude Code's `advisor`, the pane counts und times the consult aber cannot zeigen what it said.
- **Per-agent Kontext is the latest request's whole Eingabe** (uncached + Cache lesen + Cache schreiben). Es ist labelled `ctx`, nicht Kosten: the API has nein per-agent Kosten.
- **Other loops** can't tell a workflow Agent von a compaction fork; both are Modell loops nein card claims.
- **A background Agent's erste step** can arrive vorher its card exists, so its Nutzung may zeigen one step late.
- **Context against the compaction Fenster.** When the Sitzung compacts in a smaller Fenster than the Modell's, the gauge, `tokens/window` und the Status Zeile's `ctx N%` measure against that Fenster, so they lesen higher than Claude Code's own Status-line percentage (und claude-hud's), which measure against the Modell's Fenster. Auto-compaction runs a little vorher 100%, at its threshold inside that Fenster.
- **Time to erste Token.** `ttft` is timed at Flightdeck's own `turn.step` Hook, so it includes everything beneath it: other plugins' Hooks, the engine, the network und any erneut versuchen. When the Modell's thinking isn't streamed, the erste piece arrives danach it, so `ttft` includes the thinking. Measured, nicht inferred, aber nicht the API's own figure. Es gibt nein Ausgabe rate: the reported Tokens include thinking, so a rate over the visible stream isn't a real speed.

## Configure

In `/config`, oder under `pluginConfigs[<id>].options` in your user `settings.json`, where `<id>` is how Claude Code loaded das Plugin: `flightdeck@claude-flightdeck` when installed von the marketplace, `flightdeck` (oder `flightdeck@inline`) mit `--plugin-dir`. An entry under another key, oder in Projekt settings (`.claude/settings.json`), is ignored ohne a Warnung. From a terminal, `claude plugin configure flightdeck@claude-flightdeck` lists the options und which are unset, und saves them mit `--values-stdin`.

| Option | Default | Meaning |
| --- | --- | --- |
| `architectPattern` | `advisor\|architect` | case-insensitive regex for Agent types und Server Werkzeuge that count as the architect |
| `matchDescriptions` | `false` | auch match Agent descriptions, nicht just type names |
| `architectLabel` | `ARCHITECT` | the architect's Name in the pane |
| `gateLabel` | `GATE` | the permission Bereich's Name |
| `panels` | `main,architect,gate,agents,loops,receipt,log` | which panels zeigen, in order |
| `layout` | `auto` | `mini`, `compact`, `wide`, oder `auto` (mini inline, wide von 110 columns docked) |
| `maxCards` | `3` | cards side by side vorher swimlanes (1–6); fewer if the pane is too narrow |
| `paneColumns` | `66` | columns the docked pane asks for, 40 oder mehr. Claude Code caps the dock at 45% of the terminal, und a width you dragged it to, in this Sitzung oder an earlier one, wins. The wide layout starts at 110, so it needs a terminal of about 245 columns, oder `layout: wide` |
| `motion` | `while-active` | `off` keeps connectors still |
| `moments` | `true` | zeigen the inferred consult moments |
| `palette` | `theme` | `pastel` verwendet fixed colours tuned for dark terminals |
| `openOnStart` | `true` | ask to öffnen the pane when a Sitzung starts |
| `statusLine` | `true` | Kontext, läuft Agenten, consults und denials in the Status Zeile |

## Fehlerbehebung

**The pane doesn't appear.**
- Check `claude --version` ist 2.1.289 oder later, dann ausführen `/reload-plugins` und `/flightdeck`. On an older version the transcript says `flightdeck: hooks module did not load: …`.
- Below 144 columns, Claude Code won't seat a pane nobody asked for; `/flightdeck` öffnet it at any width.
- Look in the transcript for a dim Zeile starting `flightdeck:`. It names the Hook that failed oder the reason the pane was refused. Please [open an issue](https://github.com/scasella/claude-flightdeck/issues) mit it.
- If the pane zeigt nur `draw failed (…)`, its drawing Hook threw; include that Zeile in the Issue too.

**Nothing zeigt in the VS Code extension.** In one report its 2.1.296 build ran Flightdeck's Hooks aber showed nein pane, und keine for another mod either ([#5](https://github.com/scasella/claude-flightdeck/issues/5)). Run `claude` in VS Code's integrated terminal instead, dann `/flightdeck`: an integrated terminal is usually narrower than the 144 columns the pane needs to öffnen by itself.

**Under a Team oder Enterprise login, the permission mode is missing oder stale, und compactions are estimated.** On a machine mit managed settings, oder in a Sitzung on a Team oder Enterprise `/login`, Claude Code loads a built-in guard, `cc-plugin-sec-default`, that nie runs a user-installed plugin's Hooks on `classic.*` events oder `session.compact` (see "Know which Hooks of a user's mod don't ausführen" in [Manage mods for your organization](https://code.claude.com/docs/en/plugins/mods/admin)). No other event a user's plugin can Hook carries the permission mode except a Subagent's starten. So the main box zeigt nein mode until a Subagent starts, und dann the mode as it was at that starten. Until dann, in automatisch mode the gate credits the calls the classifier cleared to `you`. Compactions are counted von the Kontext Claude Code reports at jede request instead, so the main box marks them `⟲~` und the log says `context compacted (estimated)` (see [What is inferred, not measured](#what-is-inferred-not-measured)). On 2.1.299 oder later, `/plugin` zeigt a note naming those two Hooks. The rest of the pane works. An administrator can let the Hooks ausführen by installing Flightdeck as one of the organization's own mods ([#23](https://github.com/scasella/claude-flightdeck/issues/23)).

**Optionen seem ignored.** Check the key in your user `settings.json`: `pluginConfigs["flightdeck@claude-flightdeck"]` when installed, `pluginConfigs["flightdeck"]` mit `--plugin-dir`. See [Configure](#configure).

**Colours look wrong.** Set `palette` to `pastel` in `/config`.

**It's too much motion.** Set `motion` to `off`.

**Counters look stale danach an aktualisieren.** Run `/flightdeck reset`.

## So funktioniert es

| File | Holds |
| --- | --- |
| [`hooks/register.tsx`](hooks/register.tsx) | the event Hooks, state access, und one function per Bereich |
| [`hooks/core.ts`](hooks/core.ts) | every reducer, formatter und layout rule as pure functions, so behaviour is testable directly |
| [`hooks/rail.tsx`](hooks/rail.tsx), [`hooks/elapsed.tsx`](hooks/elapsed.tsx) | surface modules: animated connectors und live clocks that redraw nur themselves, on the surface's own frame clock |
| [`types/index.d.ts`](types/index.d.ts) | the state contract |
| [`tests/`](tests) | 65 tests: pure behaviour, plus drawings mounted on every surface at 24–120 columns, mit every width von 24 to 40 checked for anything that spills past its box |

State lives in `$.state` atoms. Every lesen is merged over defaults, so a missing oder older field nie breaks the pane; an aktualisieren that ändert the state's shape may still zurücksetzen its counters once. New to mods? Start mit [Claude Code mods](https://claude.com/blog/claude-code-mods) und [Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/).

## Related Projekte

Flightdeck works alongside these, und owes ideas to them:

- [claude-hud](https://github.com/jarrodwatts/claude-hud): Kontext, limits, Werkzeuge und Agenten in your Status Zeile. Use both: that's the Status Zeile, das ist the pane.
- [zoetrope](https://github.com/furkankly/zoetrope): a Claude Code oder Codex Sitzung as a live flow graph.
- [ccusage](https://github.com/ccusage/ccusage): Kosten reports von your Sitzung logs.
- [awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods): the index of Claude Code mods.

## Develop

```sh
claude --plugin-dir .            # load it; edits hot-reload
claude plugin validate .
claude plugin test .
npx -p typescript tsc -p .       # after the first load, which writes .claude-plugin/types/
```

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Lizenz

[MIT](LICENSE)

## Quelle und Lizenz

- Originalautor: scasella
- Originalrepository: https://github.com/scasella/claude-flightdeck
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
