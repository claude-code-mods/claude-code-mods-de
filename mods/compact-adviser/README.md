<h1 align="center">compact-adviser</h1>

<p align="center">
  <a href="https://github.com/kunchenguid/compact-adviser/blob/main/LICENSE"
    ><img
      alt="Lizenz"
      src="https://img.shields.io/badge/license-MIT-green?style=flat-square"
  /></a>
  <a
    href="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
    ><img
      alt="Platform"
      src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
  /></a>
  <a href="https://x.com/kunchenguid"
    ><img
      alt="X"
      src="https://img.shields.io/badge/X-@kunchenguid-black?style=flat-square"
  /></a>
  <a href="https://discord.gg/Wsy2NpnZDu"
    ><img
      alt="Discord"
      src="https://img.shields.io/discord/1439901831038763092?style=flat-square&label=discord"
  /></a>
</p>

**compact-adviser** is an Agent plugin that answers a single Frage: should I /compact jetzt?

![Compact adviser status line: "Compact adviser: work appears completed or recorded. Run /compact to save tokens." shown above a terminal prompt](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/hint-status-line.png)

It verwendet [Jev](https://typesafe.ai) to instantly judge whether the aktuell Sitzung is likely at a boundary that's safe to compact.

It can give you a hint to ausführen `/compact` - oder, on Pi und Claude Code, wenn du opt in, it can ausführen it for you at the right Zeit automatisch. Codex CLI und Grok are hint-only: nothing outside their Sitzungen can trigger `/compact`.

Judgment is two one-sentence Jev Fragen in one request (is the unit fertig; is this hands-on work oder coordination), composed in code in one score. The hint floor ist 0.90 while the Kontext is mostly empty (through about 10%) und relaxes toward 0.50 by about 90% full - a wrong hint costs most when es gibt still room. "Full" means the point where the host compacts: on Claude Code that is its automatisch-compact threshold when aktiviert, elsewhere the Modell's Fenster. Wenn du would rather compact well vorher that (long contexts Kosten mehr every Zug), set a Kontext budget: the floor dann relaxes as the Kontext approaches the smaller of your budget und that point. Automatic mode is the same gate, plus a erste-use confirmation.

## Quick Start

Prerequisites: Node 22+ (22.18+ for Codex und Grok), und one of [Pi](https://pi.dev) 0.82.0 oder newer (verified on **0.85.1**), Claude Code 2.1.274 oder newer (verified on **2.1.275**), Codex CLI 0.153.0 oder newer (verified on **0.153.4**), oder [Grok Build](https://docs.x.ai/build/overview) 1.0.34 oder newer (verified on **1.0.34**), plus a [TypeSafe API key](https://console.typesafe.ai/settings/keys). Supply it as `TYPESAFE_API_KEY` in the launch environment oder put it in the Sitzung cwd's `./.env`; Pi und Claude Code can auch speichern it through their settings, while Codex und Grok provide an external compact-adviser CLI. Jev is TypeSafe's structured decision Modell; this package asks it two one-sentence classification Fragen und nie asks it to schreiben a summary.

Installing the package is consent to senden eligible checkpoint Kontext to TypeSafe when a key is available und the other product gates pass. With `TYPESAFE_BASE` set, that Kontext und the key go to that base instead.

### Pi

```sh
pi install npm:compact-adviser
```

Restart Pi oder ausführen `/reload`, dann `/compact-adviser`.
`/compact-adviser status` should say `Key: env`, `Key: saved`, oder `Key: .env`.

To installieren von git: `pi install git:github.com/kunchenguid/compact-adviser` (hinzufügen `-l` for Projekt-local).

### Claude Code

Dieses Plugin verwendet Claude Mod which is an experimental feature that requires `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` in your environment.

```sh
claude plugin marketplace add kunchenguid/compact-adviser
claude plugin install compact-adviser@compact-adviser
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
```

Then `/compact-adviser`.

### Codex CLI

Codex support ist **macOS und Linux nur**. Das Plugin's Hooks ausführen through POSIX `sh`, matching
dieses Repository's platform badge; Windows is nicht supported this ship.

```sh
codex plugin marketplace add kunchenguid/compact-adviser
codex plugin add compact-adviser@compact-adviser
```

Restart Codex und review the Hook in `/hooks` once, so es ist trusted. After a completed
checkpoint the advice appears as a `↳ Hook · Compact adviser: ...` Zeile under the Antwort.

Codex ist **hint-only**: it has nein surface that lets another process ausführen `/compact`, so es gibt
nein automatic mode there. Einstellungen live in a small CLI statt a slash Befehl; ask Codex for
"compact-adviser Status" und the bundled Skill runs it, oder ausführen it yourself:

```sh
node "$(ls -d "${CODEX_HOME:-$HOME/.codex}"/plugins/cache/*/compact-adviser/*/ | tail -1)src/cli.ts" status
```

### Grok Build

Grok ist **hint-only**: nothing outside a läuft Sitzung can trigger `/compact`, so es gibt nein automatic mode here. The hint is painted on the Status row und nie enters the Modell's Kontext.

```sh
grok plugin install kunchenguid/compact-adviser#packages/grok-plugin --trust
```

(Install von the subdirectory, nicht the Repository root: Grok auch liest the Claude marketplace index in this repo, so a plain `grok plugin marketplace add` offers two plugins of the same Name und refuses an unqualified installieren.)

Then two one-time steps, because Grok does nicht let a plugin do either of them for you. Start Grok und ausführen:

```
/compact-adviser-install
```

That schreibt `${GROK_HOME:-~/.grok}/hooks/compact-adviser.json`, because **Grok 1.0.34 lists a plugin's own `hooks/hooks.json` aber nie loads it in a Sitzung**. Hooks in your own Grok home are immer trusted, so nothing else is needed; delete that Datei to entfernen them. From a shell es ist `node "$(node -e 'const l=JSON.parse(require("child_process").execFileSync("grok",["plugin","list","--json"],{encoding:"utf8"})); const p=(Array.isArray(l)?l:[]).find(x=>x&&x.name==="compact-adviser"); if(!p||typeof p.path!=="string") throw new Error("compact-adviser is not installed"); process.stdout.write(p.path)')/bin/adviser.ts" install`. After `install`, `${GROK_HOME:-~/.grok}/compact-adviser/adviser.sh` resolves the derzeit installed plugin the same way.

Then paste the `[ui.status_line]` block `install` printed in the config.toml Pfad it named und neu starten Grok. The Status row is off standardmäßig und nur your own config can Zug it on - a plugin cannot, und neither can a Repository. Grok has one Status row, so this script paints the built-in segments (`cwd`, `model`, `context`) too. Minimal render mode has nein Status row at alle.

On Grok, speichern the TypeSafe key as `TYPESAFE_API_KEY` oder a cwd `.env`, oder mit the CLI `key` Befehl von a shell outside Grok. Do nicht type secrets danach a Grok slash Befehl; Grok appends those words to the Modell.

## If it does nothing

| Symptom | Cause |
| --- | --- |
| TypeSafe requires payment (HTTP 402) | Check the TypeSafe account's billing und credits; waiting alone will nicht resolve a payment requirement. Context stays unchanged. |
| `Key: missing` in `/compact-adviser status` (Pi, Claude Code) oder `/compact-adviser` (Grok) | No `TYPESAFE_API_KEY` in the launch environment, gespeichert settings, oder the Sitzung cwd's `./.env` |
| No `/compact-adviser` Befehl in Claude Code | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` is nicht exactly `1` |
| Command exists, nein hint | Context is below the constant 40,000-token minimum, the Sitzung is nicht idle, oder the letzte Zug was nicht a settled final Antwort |
| Claude Code: "nonessential traffic" | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` blocks plugin network requests |
| No hint in Codex | The Hook is untrusted (review it in `/hooks`), Node is older than 22.18, oder the Hook cannot find Node at alle - Codex rebuilds its PATH, so set `COMPACT_ADVISER_NODE` to an absolute `node` Pfad |
| Grok: nein hint row at alle | `[ui.status_line]` is nicht set in the `config.toml` `install` named, oder Grok is in minimal render mode |
| Grok: nein hint danach a completed Zug | `/compact-adviser-install` has nicht ausführen, so nein Stop Hook is judging |
| Pi print / RPC / JSON, Claude `-p`, oder `codex exec` | The adviser stays inert in reliably detected non-interactive Sitzungen |
| Nothing at alle, in any host | `COMPACT_ADVISER_DISABLE` is set to a truthy value |

## Environment variables

| Variable | Effect |
| --- | --- |
| `TYPESAFE_API_KEY` | The Jev key; a gespeichert key oder the Sitzung cwd's `./.env` is used when das ist unset |
| `TYPESAFE_BASE` | Replaces the TypeSafe API base URL, `https://api.typesafe.ai` standardmäßig; the request goes to `<base>/v1/systemone` mit a trailing slash dropped. Read von the launch environment nur, nie a gespeichert setting oder `./.env`. It must be an `https` URL; plain `http` is accepted nur for a loopback host (`127.0.0.1`, `[::1]`, `localhost`). Any other value, oder one that carries credentials, a query oder a fragment, is a configuration Fehler: nein request und nein advice |
| `COMPACT_ADVISER_DISABLE` | `1`, `true`, `yes` oder `on` (any case) makes the Sitzung inert: nein TypeSafe request, nein hint, nein automatic compaction, nein Befehl. It wins over a gespeichert `hint` oder `auto` mode |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Claude Code nur; must be exactly `1` for der Mod to load |
| `COMPACT_ADVISER_NODE` | Codex nur; absolute Pfad to a Node 22.18 oder newer executable when the Hook cannot find one on its rebuilt PATH |

Export `COMPACT_ADVISER_DISABLE=1` for unattended Agent Sitzungen, where advice has nobody to lesen it.

## What is sent to TypeSafe

| Included | Not sent |
| --- | --- |
| Bounded user constraints, up to the letzte 64 visible replies und Werkzeug results (clipped), short Werkzeug-result excerpts, an existing summary, gespeichert-artifact names, omission markers | System prompts, hidden reasoning, Bilder, environment variables, the API key in the Modell Kontext und request body, complete transcripts |
| Best-effort redaction of known key patterns und obvious sensitive-file results | A guarantee. Uninstall oder set mode Off for material that must nicht leave the machine |

Requests go to `https://api.typesafe.ai/v1/systemone`, oder `<TYPESAFE_BASE>/v1/systemone` when that is set, are capped at 32,000 serialized UTF-8 bytes, und nie treat an Fehler as an affirmative judgment.
The TypeSafe API key nie enters the Modell Kontext oder the request body; es ist sent as the Authorization header to authenticate the call.
Details: [SECURITY.md](https://github.com/kunchenguid/compact-adviser/blob/main/SECURITY.md).

## How It Works

```
settled turn
      │
      ▼
┌───────────────────┐
│ cheap local gates │  mode, 40k minimum, idle session, key, cooldowns
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ TypeSafe Jev      │  done × shape score, floor slides 0.90→0.50 with usage
└─────────┬─────────┘
          ▼
 hint: run /compact     or, with explicit auto, native compaction
```

Automatic compaction is available on Pi und Claude Code. On Codex the same judgment nur ever
produces the hint, as a `↳ Hook ·` Zeile in the scrollback. On Grok the two halves are separate
processes: a `Stop` Hook judges und records a verdict, und the `[ui.status_line]` script liest
that verdict und paints the hint. The Grok Hook immer allows the stoppen und prints nothing, so a
hint can nie be fed zurück to the Modell.

On Claude Code, an optional `beforeCompactPrompt` setting (empty standardmäßig; set it in `/config`)
runs one Zug vorher that automatic compaction, und nur danach automatisch mode is confirmed. Set it to
`/stow` to ausführen the `stow` Befehl erste. Claude Code does nicht expand slash commands oder `@file`
mentions in a Prompt a plugin submits, und it rejects a plugin Prompt that starts mit `/`, so a
value that starts mit `/` is ausführen as a Befehl statt being sent to the Modell as Text. Wenn du
senden your own Prompt oder ausführen a Befehl in between, oder that Zug is interrupted, Fehler, oder does nicht
finish within 5 minutes, nothing is compacted. Hint mode, off, und an empty setting are unchanged. Pi, Codex, und
Grok do nicht have this setting.

## Verwendung

| Command | Effect |
| --- | --- |
| `/compact-adviser` (Pi und Claude Code) | Einstellungen (mode, minimum, request log, TypeSafe API key) |
| `/compact-adviser auto` / `hint` / `off` (Pi und Claude Code) | Save that mode; automatisch asks for erste-use confirmation |
| `/compact-adviser status` (Pi und Claude Code) | Mode, minimum, budget, Kontext, key source (`env` / `saved` / `.env` / `missing`), cooldown |
| `/compact-adviser threshold 60000` (Pi und Claude Code) | Save an absolute Token minimum |
| `/compact-adviser budget 450000` / `budget off` (Pi und Claude Code) | Save a Kontext budget: the hint floor is fully relaxed at this many Tokens, oder at the host's own compaction point if that is smaller (off standardmäßig) |
| `/compact-adviser snooze` / `dismiss` (Pi und Claude Code) | Suppress the nächste three exchanges, oder leeren the aktuell hint |
| `beforeCompactPrompt` in `/config` (Claude Code) | Optional Text ausführen vorher automatic compaction. Empty standardmäßig. `/stow` runs that Befehl |
| `/compact-adviser` (Grok) | Show Status; do nicht hinzufügen arguments because Grok sendet them to the Modell |
| `/compact-adviser-hint` / `/compact-adviser-off` (Grok) | Save hint-only mode, oder deaktivieren the adviser |
| `/compact-adviser-snooze` / `/compact-adviser-dismiss` (Grok) | Suppress the nächste three exchanges, oder leeren the aktuell hint |
| `/compact-adviser-install` (Grok) | Register the Hooks und print the Status-line block to paste in the named `config.toml` |
| `${GROK_HOME:-$HOME/.grok}/compact-adviser/adviser.sh threshold 60000` (Grok shell) | Save an absolute Token minimum; `budget <tokens\|off>` saves a Kontext budget; `help` lists the other shell-only settings |

On Codex the same commands are arguments to das Plugin's `src/cli.ts` (`status`, `hint`, `off`,
`threshold`, `budget <tokens|off>`, `log on|off`, `key set|clear|status`) rather than a slash
Befehl, because Codex plugins cannot register a Befehl mit code behind it. Codex has nein
snooze oder dismiss: the CLI cannot tell which Sitzung is aktuell.

## Judge profiles

An optional [judge profile](https://github.com/kunchenguid/compact-adviser/blob/main/docs/judge-profiles.md) ändert the two Fragen, score weight, oder floor schedule ohne changing shipped defaults. All four hosts accept the same bounded JSON string in the `profile` setting. Keep hint mode while evaluating a profile. Invalid profiles deaktivieren advice, und loading a profile nie grants automatic-mode consent.

## Eval

Local judgment eval verwendet real Sitzung checkpoints to score when the adviser should suggest `/compact`. The curve below is von a follow-up-aware gold set (96 checkpoints, 40 Sitzungen): as the Kontext Fenster fills, the score threshold loosens von **0.90** (≤10% used) to **0.50** (≥90% used) so **recall rises** while precision stays high - favoring Token savings when compaction is about to be forced anyway.

![Use Jev to answer "should I /compact now?" — precision stays high while recall rises as context used goes from ≤10% to ≥90%](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/eval-usage-floor-curve.png)

The judgment-eval harness lives in [packages/pi-extension/eval/](https://github.com/kunchenguid/compact-adviser/blob/main/packages/pi-extension/eval/README.md). Es ist nicht a published dataset: point it at your own Sitzungen und behalten transcripts local.

## Quelle und Lizenz

- Originalautor: kunchenguid
- Originalrepository: https://github.com/kunchenguid/compact-adviser
- Lizenz: MIT
- Deutsche Übersetzung und UI-Lokalisierung: Projekt claude-code-mods-de
